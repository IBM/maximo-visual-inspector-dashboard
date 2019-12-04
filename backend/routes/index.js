const express = require('express');
const router = express.Router();
const request = require('request')
const hfc = require('fabric-client')
const CAClient = require('fabric-ca-client')
const fs = require('fs')
const cors = require('cors')
const _ = require('underscore')
const util = require('util')
const async = require('async')
const exec = require('child_process').exec;
const glob = require("glob")
const path = require('path');
const os = require('os');
const fetch = require('node-fetch')
const proxy = require('express-http-proxy');
require('dotenv').config()

router.all('*', cors())
module.exports = router;

// TODO, this line is temporary
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Authenticate to powerai
var username, password, url, token

if ( process.env.user ) {
  username = process.env.user
  password = process.env.password
  url = process.env.url
  console.log(username, password, url)
  // token = getToken(username, password, url)
}

var tokenRefreshTime
function getToken(username = undefined, password = undefined, url = undefined) {
// var getToken = function(username, password, url) { //function(username = undefined, password = undefined, url = undefined) {
// var getToken = new Promise(username = undefined, password = undefined, url = undefined) {
  return new Promise( (resolve, reject) => {
    console.log("requesting auth token")
    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          username: username,
          password: password,
          grant_type: "password"
      })
    }
    fetch( url + "/api/tokens", options ).then ( (r) => {
      console.log(r)
      r.json().then( (t) => {
        console.log("token received: " + t.token)
        token = t.token
        tokenRefreshTime = Date.now()
        resolve(t.token)
        // return token
      } )
      // token = r.token
    }).catch ( (err) => {
      console.log("error finding token")
      console.log(err)
      reject(err)
    })
  })
}

getToken(username, password, url)

router.get('/token', function(req, res) {
  console.log("token: " + token)
  // if token hasn't expired yet
  if ( Date.now() - 60*60*100 < tokenRefreshTime  ) {
    res.send(token)
  // otherwise, get a new token
  } else {
    if (req.username && req.password) {
      username = req.username
      password = req.password
      getToken(req.username, req.password, req.url).then( (t) => {
        token = t
        console.log(t)
        res.send(token)
      } )

    } else {
      // var token = getToken(username, password, url)
      // res.send(token)
      getToken(username, password, url).then( (t) => {
        token = t
        console.log(t)
        res.send(token)
      } )

    }
  }
  // res.set('Content-Type', 'text/json')
});


// app.use('/download', function(req, res) {
//   proxy(url)
//   // res.send(200)
// });

var getInferences = function() {
  return new Promise( (resolve, reject) => {
    var options = {
      method: "GET",
      headers: {
        "X-Auth-Token": token
      }
    }
    fetch( url + "/api/inferences", options ).then ( (r) => {
      // result = r
      // console.log(r)
      r.json().then( (e) => {
        console.log("inferences received")
        inferences = e
        console.log(e)
        resolve(inferences)
        // next get detailed inference info by id
      } ).catch((err) => {
        console.log("error parsing json")
        console.log(err)
      } )
    }).catch( (err) => {
      console.log(err)
    })
  })
}

router.get('/inferences', function(req, res) {
    getInferences().then( (i) => {
      inferences = i.inferences_list
      res.send(i.inferences_list)
      inferences.map( (i) =>  {
        processInferences(i) // store result in an object, reference by id
      })
    })
});

// inference_id = "7afb7810-bdfa-4968-aafc-06a8bd758f5b"
// 1. Split frames based off fps modulus
// 2. Get array of count of each

// var countObjects = function( ) {
//
// }
var inferenceData = {} // object to keep inference analytics
var processInferences = function(i) {
  // var infDetails = JSON.parse(fs.readFileSync('../inference.json').toString())
  // var d = JSON.parse(data) //JSON.parse(fs.readFileSync('../detections.json').toString())
  // get detections.json
  // reduce detections, select frames by modulus
  var options = {
    method: "GET",
    headers: {
      "X-Auth-Token": token
    }
  }
  // request inference detections
  fetch( url + "/api/inferences/" + i['_id'], options ).then ( (r) => {
    // result = r
    // console.log(r)
    r.json().then( (det) => {
      console.log("detections received")
      // console.log(d)
      var d = det.classified
      var framesPerSecond = 60
      var reducedFrames = d.filter(e => (e.frame_number % framesPerSecond == 0) )
      console.log(reducedFrames)
      // get unique classes
      var labels = [...new Set(reducedFrames.map(e => e.label))]
      // get list of unique frame numbers
      var frameNumbers = [...new Set(reducedFrames.map(e => Number(e.frame_number)))].reverse()
      console.log(frameNumbers)
      // get total number of objects found
      var totalObjectCount = []
      frameNumbers.map((num) => {
        totalObjectCount.push(reducedFrames.filter(f => f.frame_number == num).length)
      })

      // get number of classes by frame number
      objectCount = {} // TODO, function should be async instead of using global
      labels.map((label, lIdx) => {
        objectCount[label] = []
        frameNumbers.map( (num, frameIdx) => {
          var numInstances = reducedFrames.filter(f => (f.frame_number == num && f.label == label )).length
          objectCount[label].push(numInstances)
          if ( (frameIdx == (frameNumbers.length - 1 )) && (lIdx == (labels.length - 1))  ) {
            console.log("processing complete")
            console.log(objectCount)
            inferenceData[i['_id']] = objectCount
            // return objectCount
          }
        })
      })
    } ).catch((err) => {
      console.log("error parsing json")
      console.log(err)
    } )
  }).catch( (err) => {
    console.log(err)
  })


}

// get detections from powerai with
// powerai-vision-ny/api/inferences/7afb7810-bdfa-4968-aafc-06a8bd758f5b

// Global dashboard view
// List of inferences
// List of all pic/vid thumbnails



// Detailed View
// Get and process detections for a given inference
// Should give a response to render the following
// Draw a graph (line, circle)
//

router.get('/inference/:infId', function(req, res) {
  console.log("requesting detections for id: " + req.params.infId)
  if ( req.params.infId in inferenceData.keys() ) {
    res.send(inferenceData[req.params.infId])
  } else {
    res.send(404)
  }
  // if (req.user && req.password) {
  /*
    var options = {
      method: "GET",
      headers: {
        "X-Auth-Token": token
      }
    }
    fetch( url + "/api/inferences/" + id, options ).then ( (r) => {
      // result = r
      // console.log(r)
      r.json().then( (e) => {
        console.log("inference")
        inferences = e
        console.log(e)
        res.send(inferences)
      } ).catch((err) => {
        console.log("error parsing json")
        console.log(err)
      } )
    }).catch( (err) => {
      console.log(err)
    } )*/
});

router.get('/inferencedetailed', function(req, res) {
  console.log("requesting detections for all inferences ")
  console.log(inferenceData)
  res.json(inferenceData)
});

router.post('/api/chaincode', function(req, res) {
  console.log("chaincode request received")
  console.log(req.body)
  var chaincode = req.body.params.ctorMsg
  var chaincode_query = JSON.stringify({
    "Args": [chaincode.function].concat(chaincode.args)
  })
  if (typeof(client) !== 'undefined') {
    console.log("invoking chaincode with hfc client")
    console.log("req")
    console.log(req.body)
    console.log("req.body.method")
    console.log(req.body.method)
    if (req.body.method && req.body.method.includes('invoke')) {
      console.log("invoking request")
      var transaction_id = client.newTransactionID(true)
      var txRequest = {
        chaincodeId: sec_chaincode.name,
        chaincodeVersion: sec_chaincode.version,
        txId: transaction_id,
        fcn: req.body.params.ctorMsg.function,
        args: req.body.params.ctorMsg.args
      }
      console.log(txRequest)
      var txResult = proposeAndSubmitTransaction(txRequest)
      res.send(200)
    } else {
      console.log("querying chaincode with hfc client")
      var txRequest = {
        chaincodeId: sec_chaincode.name,
        chaincodeVersion: sec_chaincode.version,
        fcn: req.body.params.ctorMsg.function,
        args: req.body.params.ctorMsg.args
      }
      console.log("txRequest")
      console.log(txRequest)
      channel.queryByChaincode(txRequest).then((cc_response) => {
        console.log("cc query response received")
        console.log(cc_response[0].toString())
        res.json(cc_response[0].toString())
      }).catch((err) => {
        console.log("cc query failed")
        console.log(err)
        res.json(err)
      })
    }
  }

});

function submitTransaction(txRequest) {
  console.log(util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"', proposalResponses[0].response.status, proposalResponses[0].response.message));
  var promises = []
  var sendPromise = channel.sendTransaction({
    proposalResponses: proposalResponses,
    proposal: proposal
  })
  sendPromise.then((result) => {
    console.log("transaction result")
    console.log(result)
    res.send(result)
  })
}

function proposeAndSubmitTransaction(txRequest) {
  console.log("sending transaction proposal")
  channel.sendTransactionProposal(txRequest).then((proposalRes) => {
    console.log("response received")
    var proposalResponses = proposalRes[0];
    var proposal = proposalRes[1];
    let isProposalGood = false;
    console.log("proposalResponses[0].response")
    console.log(proposalResponses[0].response)
    if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
      console.log('Transaction proposal was accepted');
      channel.sendTransaction({
        proposalResponses: proposalResponses,
        proposal: proposal
      }).then((res) => {
        console.log("Transaction result was accepted")
        return true
      })
    } else {
      console.log('Transaction proposal was rejected');
      return false
    }
  }).catch((err) => {
    return false
    console.log(err)
  });
}

function uploadAdminCert(req, mspId) {
  var uploadAdminCertReq = {
    "msp_id": mspId,
    "adminCertName": "admin_cert" + Math.floor(Math.random() * 1000),
    "adminCertificate": user._signingIdentity._certificate,
    "peer_names": Object.keys(client._network_config._network_config.peers),
    "SKIP_CACHE": true
  }
  if (! req.body.api_endpoint.includes('/api/v1')) {
    var api_endpoint = req.body.api_endpoint + '/api/v1'
  } else {
    var api_endpoint = req.body.api_endpoint
  }
  var options = {
    url: api_endpoint + '/networks/' + req.body.network_id + '/certificates',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8',
      "Authorization": "Basic " + new Buffer(req.body.key + ":" + req.body.secret, "utf8").toString("base64")
    },
    body: uploadAdminCertReq
  }
  console.log("uploading admin cert")
  request(options, function(err, res, body) {
    console.log("res")
    console.log(res)
    if (err) {
      console.log(err)
    }
  })
}
