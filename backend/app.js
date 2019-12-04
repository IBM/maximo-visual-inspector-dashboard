var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var cors = require('cors')
var multer  = require('multer')
const proxy = require('express-http-proxy');
require('dotenv').config()

console.log("Backend Server Started.")
// app.use(cors({credentials: false, origin: true}))
app.use(cors())
app.options('*', cors())
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    console.log('!OPTIONS');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Credentials", "true")
    res.writeHead(200, headers);
    res.end();
  }
  next();
});

// var bodyParser = require('body-parser')
// bodyParser.raw({ type: 'application/vnd.custom-type' })

app.use('/proxyget', function(req, res) {
  var paiv_url = url + req.url;
  console.log("sending proxy get request to " + paiv_url)
  const headers = req.headers
  console.log("headers")
  console.log(headers)
  const options = {
    url: paiv_url,
    headers: headers
  }
  console.log("options")
  console.log(options)
  require('request').get(options).pipe(res)
});

// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));


// var storage = multer.memoryStorage()
// var upload = multer({ storage: storage })

// const eformData = require("express-form-data");
// app.use(express.static(__dirname + '../public'));
app.set('views', path.join(__dirname, ''));
app.use(require("express-form-data").parse())
// app.use(formData.stream())
app.use('/proxypost', function(req, res) {
  // console.log(upload)
  // console.log(req)
  var paiv_url = url + req.url;
  // console.log(paiv_url)
  // console.log("req")
  // console.log(req)
  // console.log(Object.keys(req))
  // console.log("req.body")
  // console.log(req.body)
  // console.log("req.files")
  // console.log()
  // console.log(fs.createReadStream(req.files['files']['path']))
  // console.log(req.files)
  var filePath = req.files['blob']['path']
  // console.log("filePath")
  // console.log(filePath)
  var readStream = fs.createReadStream(filePath)
  console.log("readStream")
  console.log(readStream)
  var formData = {
    files: readStream
  }
  // console.log("posting to " + paiv_url)
  // require('request').post({url: paiv_url}).pipe(res)
  require('request').post({url: paiv_url, formData: formData}).pipe(res)
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var url = process.env.url
console.log("url")
console.log(url)
app.use('/proxy', proxy(url));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
