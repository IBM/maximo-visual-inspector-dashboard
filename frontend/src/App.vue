<head>
</head>

<template>
  <div id="app">

  <!-- <v-app id="app"> -->

  <!-- <card>
    <img slot="img" src="url/uploads/user361@paiv.com/datasets/f0f33ff2-54ae-46bc-92e5-7d71f535477b/thumbnails/28c5d101-7031-4c34-ba68-6d486579cc29.jpg"></img>
    <span slot="title">The title</span>
    <p>The content</p>
    <span slot="revealTitle">The revealed title</span>
    <p slot="reveal">The revealed content</p>
  </card> -->
  <div id="menu">
    <!-- <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_product_listing', 'fields': ['Product Listing Id', 'Supplier ID', 'Product ID'], 'title': 'Create Product Listing'})">Create Product Listing</vue-button>
    <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_product', 'fields': ['Product Id', 'Quantity', 'CountryId'], 'title': 'Create Product'})">Create Product</vue-button>
    <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_user', 'fields': ['ID'], 'title': 'Create User'})">Create User</vue-button> -->
    <div style="margin-top:10px">
      <vue-button type="default" v-on:click="goHome">Home</vue-button>
      <vue-button type="default" v-on:click="showModal({'name': 'upload-modal', 'title': 'Upload'})">Upload Image(s)</vue-button>
      <vue-button type="default" v-on:click="showModal({'name': 'login-modal', 'fields': ['URL', 'Username', 'Password'], 'title': 'Login'})">Login</vue-button>
      <vue-button type="default" v-on:click="downloadImages">Download Image(s)</vue-button>
    </div>


  </div>
  </br>


  <!-- <div id="drop_zone" ondrop="dropHandler(event);" ondragover="dragOverHandler(event);"> -->

    <!-- <div>
      <ul>
        <li v-for="file in files">{{file.name}} - Error: {{file.error}}, Success: {{file.success}}</li>
      </ul>
      <file-upload
        ref="upload"
        v-model="files"
        post-action="/post.method"
        put-action="/put.method"
        @input-file="inputFile"
        @input-filter="inputFilter"
      >
      Upload file
      </file-upload>
      <button v-show="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true" type="button">Start upload</button>
      <button v-show="$refs.upload && $refs.upload.active" @click.prevent="$refs.upload.active = false" type="button">Stop upload</button>
    </div> -->

    <template v-if="! (selectedInference && (selectedInference.length > 0))">
      <!-- hacky way to route, hide dashboard view and load detailed view -->
      <div>
        <md-field style="width:500px; margin: auto; ">
          <label>Search</label>
          <md-input @keyup.enter="search" v-model="query"></md-input>
          <!-- <span class="md-helper-text">Helper text</span> -->
        </md-field>
        <template v-if="inferences.length > 0">
          <br>
          <div> {{renderInferences.length}} results found </div>
          <template v-for="(inference, idx) in renderInferences">
            <!-- <md-card v-bind:inference="inference._id" v-on:click=setInference > -->
            <md-card v-bind:inference="inference._id" @click.native="setInference(inference._id) ; getInferenceDetails() ; formatLine(inference._id) ; formatCircle(inference._id)" >
              <!-- <h3>{{inference.sequence_number}}</h3> -->
              <!-- <md-card-title-text>
                <md-headline
              </md-card-title-text> -->
              <div class="md-subhead" style="margin-top:5px;margin-bottom:5px">{{parseDate(inference['created_date'])}}</div>

              <md-card-header>
                <md-card-header-text>
                  <div class="md-title">{{inference._id}}</div>
                </md-card-header-text>
              </md-card-header>

              <md-card-media md-big>
                <img :src="url + inference['thumbnail_path']" >
              </md-card-media>

              <md-card-content>
                <!-- <template v-if="'processed_frames' in Object.keys(inference)"> -->
                  <div class="md-subhead">{{inference['status']}}</div>
                  <div class="md-subhead">Processed {{inference['processed_frames']}} of {{inference['total_frames']}} total Frames</div>
                  <div class="md-subhead">{{inference['percent_complete']}} %</div>
                <!-- </template> -->
              </md-card-content>

              <md-card-content>
                <!-- <div class="md-subhead">thumbnail at </div>
                <div class="md-subhead">{{url + inference['thumbnail_path']}} </div> -->
                <!-- <div class="md-subhead">Model: {{inference['model_id']}} </div> -->


                <template v-if="inferenceDetails && (Object.keys(inferenceDetails).length > 0) && inferenceDetails[inference._id]">
                  <div class="md-subhead">Classes</div>
                  <div>{{Object.keys(inferenceDetails[inference._id]).join(", ")}}</div>
                </template>
                <!-- <div class="md-subhead">Classes: {{inferencedetailed['created_date']}}</div> -->

              </md-card-content>

              <!-- <md-card-actions>
                <md-button>Action</md-button>
                <md-button>Action</md-button>
              </md-card-actions> -->
            </md-card>
          </template>
        </template>
      </div>
        </br>
        <div>
          <template v-if="inferences.length > 0">
                    <!-- <md-card
                      color="green"
                      title="Inferences"
                      text="Inferences"
                    > -->
                    <!-- <md-table v-model="inferences">
                            <md-table-row>

                            </md-table-row>
                    </md-table> -->

                    <data-table :data=inferences  :items-per-page="5"  class="elevation-1">
                    </data-table>

                  <!-- </md-card> -->
          </template>

          <template v-if="models.length > 0">
                  <data-table :data=models :style="{overflow: 'auto'}">
                  <!-- <template slot="caption">Models</template> -->
                  </data-table>
          </template>

          <!-- <template v-if="ledgerState.retailers">
                  <data-table :data="ledgerState.retailers.map( s =>  ({ Id: s.Id, Products: s.products }) )" :style="{width: '300px', height: '200px', overflow: 'auto'}">
                      <template slot="caption">Retailers</template>
                  </data-table>
          </template> -->

        </div>

      </template>
      <div>

        <modal name="login-modal" height="auto" >
          <h2 align="center"> {{title}} </h2>
          <vue-form
            id="chaincode-form"
            :model="form">
            <template v-for="(field, idx) in fields">
              <vue-form-item style="width:500px;" align=center>
                <vue-input
                  :placeholder=field
                  v-model=input[idx]>
                </vue-input>
              </vue-form-item>
            </template>
            <vue-form-item style="margin-left:100px">
              <vue-button type="default" v-on:click="hideModal({'name': 'login-modal'})">Cancel</vue-button>
              <vue-button type="success" v-on:click="login">Submit</vue-button>
            </vue-form-item>
            </vue-form>
        </modal>

        <modal name="upload-modal" height="auto" >
          <h2 align="center"> Upload Files(s) </h2>
          <div id="drop_zone" v-on:drop="dropHandler" v-on:dragover="dragOverHandler">
            <p align="center">Drag and drop files here</p>
            <template v-if="filenames.length > 0">
              <li v-for="file in filenames">
                  {{ file }}
              </li>
            </template>

            <!-- <v-select v-model="selectedModel" :options="models"></v-select> -->
            <!-- <md-select v-model="selectedModel" name="selectedModel" id="selectedModel">
                <template v-for="m in models">
                  {{m}}
                  <md-option value=m._id> {{m._id}} {{m._name}} </md-option>
                </template>
            </md-select> -->
          </div>
          <div style="width: 100%; margin: 0 auto;">
            <h3 align="center">Select Model</h3>
            <div style="width: 100%; margin: 0 auto;">
              <select id="selectedModel">
                <template v-for="m in models">
                 <!-- <option value="volvo">Volvo</option> -->
                 <option :value=m._id> {{m.name}} ({{m._id}}) </option>
               </template>
              </select>
            </div>
          </div>
          <div>
            <vue-button type="default" v-on:click="hideModal({'name': 'upload-modal'})">Cancel</vue-button>
            <vue-button type="default" v-on:click="submitInference() ; hideModal({'name': 'upload-modal'})">Upload</vue-button>
          </div>
        </modal>


        <!-- </template> -->
        <!-- </template> -->
        </div>

      <template v-if="(selectedInference && (selectedInference.length > 0))">
         <h2> Detailed View </h2>
         <h3> {{selectedInference}} </h3>
         <!-- <h3> {{inferences}} </h3> -->
         <!-- <h3> {{inferenceDetails}} </h3> -->
         <!-- <p>{{(inferences.filter( (i) => i._id == selectedInference))[0]}}</p> -->

          <!-- <source :src="url/uploads/inferences/7afb7810-bdfa-4968-aafc-06a8bd758f5b/training_video_out.mp4" type="video/mp4"> -->

          <template v-if="((inferences.filter( (i) => i._id == selectedInference))[0].video_out) && ((inferences.filter( (i) => i._id == selectedInference))[0].percent_complete == 100)">
            <video id="videoContainer" ref="videoContainer" width="960" height="720" controls>
              <source :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].video_out"  type="video/mp4">
            </video>
          </template>
          <template v-else-if="(inferences.filter( (i) => i._id == selectedInference))[0].video_in" >
            <video id="videoContainer" ref="videoContainer" width="960" height="720"  controls>
              <source :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].video_in "  type="video/mp4">
            </video>
          </template>
          <template v-else>
            <img :src="url + (inferences.filter( (i) => i._id == selectedInference))[0]['thumbnail_path']" >
          </template>


         <md-card style="width:80%">
           {{lineGraphData}}
           <Plotly id="detailedLineGraph" ref="detailedLineGraph" v-on:click="updateVideo" :data="lineGraphData" :layout=lineGraphLayout :display-mode-bar="false"></Plotly>
         </md-card>


         <md-card style="width:50%">
           <!-- <md-card-content> -->
             {{circleGraphData}}
             <Plotly id="detailedPieGraph" :data=circleGraphData :display-mode-bar="false"></Plotly>
           <!-- </md-card-content> -->
         </md-card>

         <md-card style="width:35%">
           <md-card-header>
             <md-card-header-text>
               <div class="md-title">Placeholder</div>
             </md-card-header-text>
           </md-card-header>
           <md-card-content>
               <div class="md-subhead">Placeholder</div>
           </md-card-content>
         </md-card>
      </template>

<!--  TODO, this is being hidden by datatables since it's fixed -->
<!-- <div v-if="!isHidden" style="z-index:9000">
      <vue-form
        id="chaincode-form"
        :model="form"
        style="width: 75%; position: fixed; left: 50%; margin-left: -37.5%;">
        <h2 style="float:center"> Invoke Chaincode </h2>
        <vue-form-item label="Function">
          <vue-input
            placeholder="Function"
            v-model="form.function"
            style="width: 100%">
          </vue-input>
        </vue-form-item>

        <vue-form-item label="Arguments">
          <vue-input
            placeholder="Arguments"
            v-model="form.args"
            style="width: 100%">
          </vue-input>
        </vue-form-item>
        <vue-form-item>
          <vue-button type="default" v-on:click="isHidden = true">Cancel</vue-button>
          <vue-button type="success" v-on:click="invoke" >Submit</vue-button>
        </vue-form-item>
      </vue-form>
    </div> -->
<!-- <vue-form-item> item 1 </vue-form-item>
      <vue-form-item> item 2 </vue-form-item> -->
<!-- <vue-input placeholder="Please input"></vue-input>
      <vue-input placeholder="Please input"></vue-input> -->


<!-- </v-app> -->
</div>


</template>

<script>
  import 'vfc/dist/vfc.css'
  import './dist/json-tree.css'

  import {
    Input
  } from 'vfc'
  import {
    Form
  } from 'vfc'
  import {
    FormItem
  } from 'vfc'
  import {
    Button
  } from 'vfc'
  // import DemoLoginModal       from './components/modals/DemoLoginModal.vue'

  // import 'vue-js-modal'
  // import { Card } from 'v-card'
  // import { DataTable } from 'v-data-table'
  // import { Button } from 'vfc'



  export default {
    name: 'app',
    created() {
      zip = new this.JSZip();
    },
    data() {
      return {
        isHidden: false,
        form: {
          function: '',
          args: ''
        },
        args: [],
        products: [],
        inferences: [],
        renderInferences: [],
        inference_data: {},
        fields: [],
        query: '',
        // user_fields: [],
        // user_type: '',
        // user_input: [],
        input: [],
        func: '',
        title: '',
        selectedInference: '',
        selectedModel: '',
        models: [],
        files: [],
        filenames: [],
        inferenceDetails: {},
        lineGraphData: [],
        circleGraphData: [],
        url: (localStorage['paiv_url'] || process.env.VUE_APP_URL),
        username: (localStorage['paiv_user'] || process.env.VUE_APP_USER),
        password: (localStorage['paiv_password'] || process.env.VUE_APP_PASSWORD),
        lineGraphLayout: {title: 'Objects Time Series',xaxis: {title: 'Time',showgrid: false,zeroline: false},yaxis: {title: 'Objects',showline: false}}

      }
    },
    components: {
      Form,
      FormItem,
      // DemoLoginModal,
      [Input.name]: Input,
      [Button.name]: Button
    },
    beforeMount(){

       // this.$data.selectedInference = "foobar"
       this.getInferences()
       // if (localStorage.getItem('token')) {
       //   this.$data.token = localStorage.getItem('token')
       // } else {
       //   this.login()
       // }
       this.login()
       this.$data.url = process.env.VUE_APP_URL,
       this.$data.username = process.env.VUE_APP_USER,
       this.$data.password = process.env.VUE_APP_PASSWORD

    },
    mounted(){
      this.getInferenceDetails()
      this.getModels()
      // TODO, remove this, get env vars working
      // this.$data.url = process.env.VUE_APP_URL,
      // this.$data.username = process.env.VUE_APP_USER,
      // this.$data.password = process.env.VUE_APP_PASSWORD
      // this.$data.url = process.env.url
      // console.log("process.env")
      // console.log(process.env)
      // this.getInferences()

      // this.$router.push('/inference/foo')
    },
    methods: {
      dragOverHandler(ev) {
         console.log('File(s) in drop zone');
         ev.preventDefault();
      },
      getModels() {
        var options = {
          method: "GET",
          headers: {
            "X-Auth-Token": this.$data.token,
          }
        }
        console.log("getting models")
        console.log(options)
        // fetch(this.$data.url + "/trained-models", options).then((res) => {
        fetch('http://localhost:30000/proxyget' + "/api/trained-models", options).then((res) => {
          console.log("models received")
          console.log(res)
          res.json().then((models) => {
            this.$data.models = models
            console.log(models)
          })
        })
      },
      parseDate(d){
        var dateObj = (new Date(Date.parse(d)))
        // var r = date.getMonth() + date.getDay() + date.getYear()
        var date = `${dateObj.getMonth()}/${dateObj.getDay()}/${dateObj.getFullYear()}`
        var time = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${date} ${time}`
      },
      forceFileDownload(response){
           const url = window.URL.createObjectURL(new Blob([response.data]))
           const link = document.createElement('a')
           link.href = url
           link.setAttribute('download', 'file.png') //or any other extension

           document.body.appendChild(link)
           link.click()
      },
      downloadImages() {
        var zip = new this.$JSZip();
        this.$data.renderInferences.map((inference, idx) => {
          if (inference['video_out']) { //(Object.keys(inference).includes("video_out") && inference['video_out'] != null) {
            var endpoint = inference.video_out
            console.log("requesting video at: " + endpoint)
          } else {
            var endpoint = inference.thumbnail_path
            console.log("requesting thumbnail at: " + endpoint)
          }
          var s = endpoint.split('/')
          var fileName = s[s.length-1]
          fetch('http://localhost:30000/proxyget' + endpoint).then((res) => {
            res.blob().then((content) => {
              if (idx == (this.$data.renderInferences.length - 1) ) {
                  console.log("adding " + fileName + " to zip")
                  var z = zip.file(fileName, content)
                  setTimeout(()=>{ // TODO, there definitely should be a better option than setTimeout, but jszip chaining isn't working
                    console.log("z.files")
                    console.log(z.files)
                    z.generateAsync({type: "blob"}).then((blob) => {
                      console.log("downloading zip")
                      const url = window.URL.createObjectURL(blob) //new Blob([blob]))
                      const link = document.createElement('a')
                      link.href = url
                      link.setAttribute('download', "images.zip") //or any other extension
                      document.body.appendChild(link)
                      link.click()
                    })
                  },1000);
              } else {
                console.log("adding " + fileName + " to zip")
                zip.file(fileName, content)
              }
            })
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      dropHandler(ev) {
        console.log('File(s) dropped');
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        this.$data.filenames = []
        if (ev.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
              var file = ev.dataTransfer.items[i].getAsFile();
              console.log('... file[' + i + '].name = ' + file.name);
              this.$data.filenames.push(file.name)
              this.$data.files.push(file)
              console.log(file)
            }
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
          }
        }
      },
      login() {
        console.log("requesting token")
        console.log(this.$data.input)
        if (this.$data.input.length > 0) {
          // if
          localStorage.setItem('paiv_url', this.$data.input[0])
          localStorage.setItem('paiv_user', this.$data.input[1])
          localStorage.setItem('paiv_password', this.$data.input[2])

          this.$data.url = this.$data.input[0]
          this.$data.username = this.$data.input[1]
          this.$data.password = this.$data.input[2]
        }
        var options = {
          method: "GET"
        }
        fetch("http://localhost:30000/token", options).then((res) => {
          console.log("api call complete")
          this.$modal.hide("login-modal")
          res.text().then( (token) => {
              console.log("in text promise")
              this.$data.token = token
              localStorage.setItem('token', token)
              console.log(token)
          }).catch( (err) => {
            console.log("err")
            console.log(err)
          })
        })
      },
      inputFile: function (newFile, oldFile) {
            if (newFile && oldFile && !newFile.active && oldFile.active) {
              // Get response data
              console.log('response', newFile.response)
              if (newFile.xhr) {
                //  Get the response status code
                console.log('status', newFile.xhr.status)
              }
            }
      },
      inputFilter: function (newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
              // Filter non-image file
              if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
                return prevent()
              }
            }

            // Create a blob field
            newFile.blob = ''
            let URL = window.URL || window.webkitURL
            if (URL && URL.createObjectURL) {
              newFile.blob = URL.createObjectURL(newFile.file)
            }
      },
      updateVideo(eventData){
        // console.log("eventData")
        var x = eventData.points[0]['x']
        var vid = document.getElementById("videoContainer")
        vid.currentTime = x
        vid.play()
        console.log("skipping video to second:" + x)
        // this.$refs["videoContainer"]
        // console.log(this.$refs["detailedGraph"])
        // console.log(this.$refs["detailedGraph"].$el._fullData[0].selected.markers.toString())
        // console.log(this.$refs["detailedGraph"].$el._fullData[0])
      },
      submitInference() {
        // post to powerai when user clicks "upload"
        var e = document.getElementById("selectedModel");
        var selectedModel = e.options[e.selectedIndex].value
        this.$data.selectedModel = selectedModel //'ee5f1177-7ff1-4cd5-86d2-60faca266c71'
        this.$data.files.map( (file, f_idx) => {
          var formData = new FormData()
          formData.append('blob', file)
          var options = {
            method: "POST",
            body: formData
            // headers: {
            //   "X-Auth-Token": this.$data.token,
            //   // "Content-Type": "multipart/form-data"
            // }
          }
          console.log("formData")
          console.log(formData)
          console.log("adding file: " + file.name)
          // console.log('this.$data.url + "/dlapis/" + this.$data.selectedModel')
          // console.log(this.$data.url + "/dlapis/" + this.$data.selectedModel)
          // fetch(this.$data.url + "/dlapis/" + this.$data.selectedModel, options).then((res) => {
          console.log("posting to: " + "http://localhost:30000/proxypost" + "/api/dlapis/" + selectedModel)
          fetch("http://localhost:30000/proxypost" + "/api/dlapis/" + this.$data.selectedModel, options).then((res) => {
            console.log("api call complete")
            // this.$modal.hide('invoke-modal');
            // console.log(res.text())
            console.log(res)
            res.json().then((result) => {
              console.log("json")
              console.log(result)
              // this.$data.inferences.append(result)
              // TODO, this only applies in case of a still image
              var labels = Array.from(new Set(result.classified.map( (c) => c.label )))
              var endpoint = result.imageUrl.split('/uploads')[1]
              // result.classified.filter((c) =>  )
              this.$data.inferenceDetails[result.imageMd5] = {}
              labels.map((l) => {
                var r = result.classified.filter(c => c.label == l)
                var count = r.length //Array.from((new Set(r))).length
                console.log("count for " + l)
                this.$data.inferenceDetails[result.imageMd5][l] = count
              })

              var inference = {
                _id: result.imageMd5,
                created_date: (new Date().toJSON()),
                thumbnail_path: '/uploads' + endpoint,
                status: result['result'],
                model: result['webAPIId'],
                percent_complete: 100
              }
              console.log("labels")
              console.log(labels)
              // this.$data.inferenceDetails[result.imageMd5] =  //result.classified
              console.log("appending inference ")
              console.log(inference)
              this.$data.inferences.push(inference)
              // "http://powerai-vision-ny-service:9080/powerai-vision-ny-api/uploads/temp/ee5f1177-7ff1-4cd5-86d2-60faca266c71/16acd8ad-2008-484b-8f7a-e669621852f3.jpg"
            }).catch( (err) => {
              console.log("error parsing json")
            } )
          }).catch((err) => {
            console.log(err)
          })
          if (f_idx == (this.$data.files.length - 1)) {
            this.$data.files = []
          }
        })
      },
      postInference() {
        var options = {
          method: "POST",
          body: file
          // headers: {
          //   'Accept': 'application/json',
          //   'Content-Type': 'application/json'
          // }
        }
        const input = document.getElementById('fileinput');
        const file = input.files[0]
        fetch("http://localhost:30000/inferences", options).then((response) => {
          response.json().then((json) => {
            // TODO filter is only here to ignore shared inferences
            this.$data.inferences = inf; // json
            this.$data.renderInferences = inf //.filter(i => i.model_id == '3ac091c7-66ef-450a-8b7d-fa9e0cc748e6 	') // only need to do this initially
            console.log("inferences received")
            // localStorage.setItem('inferences', inferences)
          })
        })
      },
      getInferences() {
        var options = {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
        fetch("http://localhost:30000/inferences", options).then((response) => {
          response.json().then((json) => {
            // TODO filter is only here to ignore shared inferences
            var inf = json.filter(i => i.model_id != '29dad520-4908-42fc-b118-9971b957bf8c')
            this.$data.inferences = inf; // json
            this.$data.renderInferences = inf //.filter(i => i.model_id == '3ac091c7-66ef-450a-8b7d-fa9e0cc748e6 	') // only need to do this initially
            console.log("inferences received")
            // localStorage.setItem('inferences', inferences)
          })
        })
      },
      getInferenceDetails() {
        var options = {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
        fetch("http://localhost:30000/inferencedetailed", options).then((response) => {
          console.log(response)
          response.json().then((json) => {
            console.log("inference details received")
            this.$data.inferenceDetails = json
          }).catch( (err) => {
            console.log("failure receiving detailed data")
            console.log(err)
          } )
        })
      },
      search() {
        var query = this.$data.query
        console.log("performing search for: " + query)
        var a = []
        // TODO, allow multi search, split by query and
        // console.log("this.$data.inferenceDetails")
        // console.log(this.$data.inferenceDetails)
        this.$data.inferences.map( (inference) => {
          // Object.values(inference).map( (v) => {
              // console.log(JSON.stringify(this.$data.inferenceDetails[inference._id]))
              if ( JSON.stringify(inference).includes(query) || (this.$data.inferenceDetails[inference._id] && JSON.stringify(this.$data.inferenceDetails[inference._id]).includes(query)) ) {
              // if (typeof(v) == "object" && v.includes(query)) {
                a.push(inference)
              }
          // })
        })
        this.$data.renderInferences = a
        console.log(this.$data.renderInferences)
      },
      // setInference(event) {
      setInference(inferenceId) {
        console.log("setting inference")
        // console.log(event.explicitOriginalTarget.offsetParent.offsetParent)
        // var inference = event.explicitOriginalTarget.offsetParent.offsetParent.attributes['inference'].nodeValue
        console.log(inferenceId)
        this.$data.selectedInference = inferenceId
        // self.getInferenceDetails()
        // self.formatLine(inferenceId)
        // selectedInference
      },
      formatLine(inferenceId) {
        console.log("generating line graph for " + inferenceId)
        var detections = this.$data.inferenceDetails[inferenceId]
        var objects = Object.keys(detections)
        // var d = {
        //   data: []
        // }
        var d = []
        objects.map( (o) => {
          var x = Array.from(Array(detections[o].length).keys())
          // d['data'].push({
          d.push({
            x: x,
            y: detections[o],
            mode: 'lines',
            type: 'scatter',
            name: o
            // mode:"lines+markers"
          })
          console.log(d)
        })

        this.$data.lineGraphData = d
        console.log("this.$data.lineGraphData")
        console.log(this.$data.lineGraphData)
        // detections.map( (detection) )

        // this.$data.lineGraph =
        // this.$data.circleGraph =
      },
      formatCircle(inferenceId) {
        console.log(this.$data.inferenceDetails)
        console.log("generating line graph for " + inferenceId)
        var detections = this.$data.inferenceDetails[inferenceId]
        var objects = Object.keys(detections)
        var d = {
          values: [],
          labels: [],
          type:"pie"
        }
        objects.map( (o) => {
          d['values'].push(detections[o].reduce((a, b) => a + b, 0))
          d['labels'].push(o)
          console.log(d)
        })

        this.$data.circleGraphData = [d]
        console.log("this.$data.circleGraphData")
        console.log(this.$data.circleGraphData)
      },
      showInvokeModal(config) {
        console.log("opening modal")
        // console.log(fields)
        this.$data.input = []
        console.log(config.function)
        console.log(config.fields)
        this.$data.func = config.function
        this.$data.fields = config.fields
        this.$data.title = config.title
        this.$data.user_fields = []
        this.$data.user_type = ''
        this.$modal.show('invoke-modal', {
          "fields": config.fields
        });
      },
      showModal(config) {
        console.log("opening modal")
        this.$data.fields = config.fields
        this.$data.title = config.title
        // console.log(fields)
        // this.$data.input = []
        this.$modal.show(config.name, {
          "fields": config.fields
        });
      },
      hideModal(config) {
        this.$modal.hide(config.name);
        console.log("hiding modal: " + config.name)
        // this.$data.user_fields = []
        // this.$data.user_type = ''
      },
      getFormValues() {
        console.log("getting form vals")
        console.log(this.$data.input)
        // this.output = this.$refs.my_input.value
        // console.log(this.$refs.my_input.value)
      },
      goHome() {
        this.$data.selectedInference = null
        this.$data.renderInferences = this.$data.inferences
      },
    },
    filters: {
      pretty: function(value) {
        return JSON.stringify(value, null, 2);
      }
    }


  }
</script>

<!-- TODO, finish modal -->
<!-- <script type="text/x-template" id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</script> -->


<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  #drop_zone {
    border: 2px dashed #eaecee ;
    width:  400px;
    height: 300px;
    margin: auto;
  }
</style>

<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 40px;
    display: inline-block;
    vertical-align: top;
  }
</style>
