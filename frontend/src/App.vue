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
    <div style="margin-top:50px" id="menu">
      <!-- <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_product_listing', 'fields': ['Product Listing Id', 'Supplier ID', 'Product ID'], 'title': 'Create Product Listing'})">Create Product Listing</vue-button>
    <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_product', 'fields': ['Product Id', 'Quantity', 'CountryId'], 'title': 'Create Product'})">Create Product</vue-button>
    <vue-button type="default" v-on:click="showInvokeModal({'function': 'init_user', 'fields': ['ID'], 'title': 'Create User'})">Create User</vue-button> -->
      <div >
        <vue-button type="default" v-on:click="goHome">Home</vue-button>
        <vue-button type="default" v-on:click="filenames = []  ; files = [] ; showModal({'name': 'upload-modal', 'title': 'Upload'})">Upload Image(s)</vue-button>
        <vue-button type="default" v-on:click="showModal({'name': 'login-modal', 'fields': ['URL', 'Username', 'Password'], 'title': 'Login'})">Login</vue-button>
        <vue-button type="default" v-on:click="downloadImages">Export Image(s)</vue-button>
        <vue-button type="default" v-on:click="toggleTables">Toggle Tables</vue-button>

      </div>


    </div>
    </br>



    <template v-if="( (! selectedInference) || (selectedInference.length < 1))">
      <!-- hacky way to route, hide dashboard view and load detailed view -->
      <div>
        <md-field style="width:500px; margin: auto; ">
          <label>Search</label>
          <md-input @keyup.enter="search" @input="search" v-model="query"></md-input>
          <md-icon v-on:click="search">search</md-icon>
          <!-- <span class="md-helper-text">Helper text</span> -->
        </md-field>
        <template v-if="inferences.length > 0">
          <br>
          <div> {{renderInferences.length}} results found </div>
          <template v-for="(inference, idx) in renderInferences">
            <!-- <md-ripple> -->
            <!-- <md-card v-bind:inference="inference._id" v-on:click=setInference > -->
            <md-card v-bind:inference="inference._id" @click.native="setInference(inference._id)" md-with-hover>
              <!-- <h3>{{inference.sequence_number}}</h3> -->
              <!-- <md-card-title-text>
                <md-headline
              </md-card-title-text> -->
              <div class="md-subhead" style="margin-top:5px;margin-bottom:5px">{{parseDate(inference['created_date'])}}</div>

              <md-card-header>
                <md-card-header-text>
                  <!-- <div class="md-title">{{inference._id}}</div> -->
                  <template v-if="(Object.keys(inference).includes('filename') && inference['filename'].includes('.') )">
                    <div class="md-title">{{inference.filename}}</div>
                  </template>
                  <template v-if="Object.keys(inference).includes('video_in') && inference['video_in'].includes('.') && inference['video_in'].includes('/')">
                    <!-- TODO, readd -->
                    <!-- <div class="md-title">{{inference.video_in.split('.')[0].split('/')[4]}}</div> -->

                  </template>
                </md-card-header-text>
              </md-card-header>

              <md-card-media md-big>
                <template v-if="Object.keys(inference).includes('heatmap')">
                    <canvas :id="'image_' + inference['_id']" v-overlay-image="inference"></canvas>
                    <!-- <input type="text" v-model="exampleContent" /> -->
                    <!-- <span>{{ exampleContent }}</span> -->


                    <!-- <img :src="inference['heatmap']">
                    <img :src="url + inference['thumbnail_path']"> -->


                    <!-- <img style="position: absolute; opacity: 0.2" :src="inference['heatmap']"> -->
                    <!-- <img style="position: absolute" :src="url + inference['thumbnail_path']"> -->
                </template>

                <template v-else-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection')">
                    <!-- <img :src="url + inference['thumbnail_path']"> -->
                    <canvas :id="'image_' + inference['_id']" v-overlay-image="inference"></canvas>
                </template>

                <template v-else>
                    <img :src="url + inference['thumbnail_path']">
                </template>
              </md-card-media>

              <md-card-content>
                <template v-if="'processed_frames' in Object.keys(inference)">
                  Status: <div class="md-subhead">{{inference['status']}}</div>
                  Progress: <div class="md-subhead">{{inference['percent_complete'].toFixed(2)}} %</div>
                  <!-- TODO, readd -->
                  <!-- Filename: <div class="md-subhead">{{inference['video_in'].split('/').slice(-1)[0]}}</div> -->
                </template>

                <template v-if="Object.keys(inference).includes('filename')">
                  <!-- <div class="md-subhead">{{inference['filename']}}</div> -->
                </template>
                <!-- </template> -->
              </md-card-content>


              <md-card-content>
                <!-- <div class="md-subhead">thumbnail at </div>
                <div class="md-subhead">{{url + inference['thumbnail_path']}} </div> -->
                <!-- <div class="md-subhead">Model: {{inference['model_id']}} </div> -->


                <template v-if="inferenceDetails && (Object.keys(inferenceDetails).length > 0) && inferenceDetails[inference._id]">
                  <div class="md-subhead">Detected Objects / Classes</div>


                  <!-- <div class="md-subhead"></div> -->
                  <!-- <div>All: {{inferenceDetails[inference._id]}}</div> -->
                  <template v-if="Object.keys(inference).includes('video_in')">
                    <!-- if video -->

                    <div class="md-subhead">{{Object.keys(inferenceDetails[inference._id]).join(", ")}}</div>
                  </template>

                  <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection') ">
                    <template v-for="idx in inference['classified'].length">
                      <!-- {{idx}} -->
                      <!-- {{inference['classified'][idx - 1]}} -->
                      {{inference['classified'][idx - 1]['label']}} {{inference['classified'][idx - 1]['confidence'].toFixed(2)}}
                    </template>
                  </template>

                  <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'classification') ">
                    <template v-for="key in Object.keys(inference['classified'])">
                      {{key}} {{parseFloat(inference['classified'][key]).toFixed(2)}}
                    </template>
                    <!-- <div class="md-subhead">{{Object.keys(inferenceDetails[inference._id]).join(", ")}}</div> -->
                  </template>


                  <!-- <template v-else>
                    <template v-for="(value, key) in Object.keys(inferenceDetails[inference._id])">
                      <template v-if="Object.keys(inferenceDetails[inference._id][value]).includes('score')">
                        {{value}} - {{inferenceDetails[inference._id][value]['score']}}
                      </template>
                    </template>
                  </template> -->

                </template>
                <!-- <div class="md-subhead">Classes: {{inferencedetailed['created_date']}}</div> -->

              </md-card-content>

              <!-- <md-card-actions>
                <md-button>Action</md-button>
                <md-button>Action</md-button>
              </md-card-actions> -->
            </md-card>
            <!-- </md-ripple> -->
          </template>
        </template>
      </div>
      </br>
      <div>
        <template v-if="(inferences.length > 0) && showTables">
          <!-- <div style="margin: 0 auto;width: 100%;"> -->
          <div>
            <md-card style="width:50%">
              <h1 style="margin: 0 auto; margin-top: 40px;  ">Inferences</h1>
              <table style="width:80%;float:center;table-layout:fixed;">


            <thead >
                 <tr>
                   <template v-for="header in inference_headers">
                     <th style="text-align:center">{{header}}</th>
                   </template>
                 </tr>
            </thead>
            <tbody>
              <template v-for="inference in inferences">
                <tr >
                  <td>
                    <template v-if="Object.keys(inference).includes('video_out')">
                      <!-- TODO, readd -->
                      <!-- {{inference['video_out'].split('/').slice(-1)[0] }} -->
                    </template>
                    <template v-else>
                      {{inference['filename']}}
                    </template>
                  </td>

                  <td>
                    <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection')">
                      <template v-for="o in inference['classified']">
                        {{o['confidence']}}
                      </template>
                    </template>
                    <template v-else-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'classification')">
                        {{Object.values(inference['classified'])}}
                    </template>
                  </td>

                  <td>
                    <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection')">
                      <template v-for="o in inference['classified']">
                        {{o['label']}}
                      </template>
                    </template>
                    <template v-else-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'classification')">
                        {{Object.keys(inference['classified'])}}
                    </template>
                    <template v-else-if="inferenceDetails[inference['_id']]">
                      {{Object.keys(inferenceDetails[inference['_id']]).join(', ')}}
                    </template>
                  </td>

                  <td>{{  filterModel(inference['model_id'])  }}</td>
                  <!-- <td>{{  inference['model_id']  }}</td> -->

                </tr>
              </template>
            </tbody>
            </table>
            </md-card>

        <!-- <template>
            <md-table style=" margin: 0 auto; width: 60%;" md-sort-order="asc" card>
              <md-table-toolbar>
                <h1 style="margin: 0 auto; margin-top: 40px">Inferences</h1>
              </md-table-toolbar>
              <md-table-row>
                <template v-for="header in inference_headers">
                  <md-table-head style="text-align:center">{{header}}</md-table-head>
                </template>
              </md-table-row>
              <template v-for="inference in inferences">
              <md-table-row>
                  <md-table-cell>
                    <template v-if="Object.keys(inference).includes('video_out')">
                      {{inference['video_out'].split('/').slice(-1)[0] }}
                    </template>
                    <template v-else>
                      {{inference['filename']}}
                    </template>
                  </md-table-cell>

                  <md-table-cell>
                    <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection')">
                      <template v-for="o in inference['classified']">
                        {{o['confidence']}}
                      </template>
                    </template>
                    <template v-else-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'classification')">
                        {{Object.values(inference['classified'])}}
                    </template>
                  </md-table-cell>

                  <md-table-cell>
                    <template v-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'object_detection')">
                      <template v-for="o in inference['classified']">
                        {{o['label']}}
                      </template>
                    </template>
                    <template v-else-if="Object.keys(inference).includes('analysis_type') && (inference['analysis_type'] == 'classification')">
                        {{Object.keys(inference['classified'])}}
                    </template>
                    <template v-else-if="inferenceDetails[inference['_id']]">
                      {{Object.keys(inferenceDetails[inference['_id']]).join(', ')}}
                    </template>
                  </md-table-cell>


                  <md-table-cell>
                    {{filterModel(inference['model_id'])}}
                  </md-table-cell>
              </md-table-row>
              </template >
            </md-table>
          </template> -->


          </div>
        </template>
          <!-- <md-card
                      color="green"
                      title="Inferences"
                      text="Inferences"
                    > -->




        <!-- </template> -->
        <!-- ALL
        <div>
          <md-table md-sort-order="asc">
            <md-table-toolbar>
              <h1 class="md-title">Inferences</h1>
            </md-table-toolbar>
            <md-table-row>
              <template v-for="header in Object.keys(inference_headers)">
                <md-table-head>{{header}}</md-table-head>
              </template>
            </md-table-row>
            <template v-for="inference in inferences">
                <md-table-row>
                  <template v-for="header in Object.keys(inferences[0])">
                    <md-table-cell>
                      {{inference[header]}}
                    </md-table-cell>
                  </template>
                </md-table-row>
            </template>
          </md-table>
        </div> -->

          <!-- {{inferences[0]}} -->
          <!-- <data-table :data=inferences :headers="[{ text: '_id', value: '_id' }]" :items-per-page="5">
          </data-table> -->

          <!-- </md-card> -->

        <template v-if="(models.length > 0) && showTables">
          <div>
            <md-table md-sort-order="asc">
              <md-table-toolbar>
                <h1 style="margin: 0 auto; margin-top: 40px">Models</h1>
              </md-table-toolbar>
              <md-table-row>
                <template v-for="header in model_headers">
                <!-- <template v-for="header in Object.keys(models[0])"> -->
                  <md-table-head style="text-align:center">{{header}}</md-table-head>
                </template>

                <!-- <md-table-head style="text-align:center">Name</md-table-head>
                <md-table-head style="text-align:center">Dataset</md-table-head>
                <md-table-head style="text-align:center">ID</md-table-head>
                <md-table-head style="text-align:center">Categories</md-table-head> -->
              </md-table-row>
              <template v-for="model in models">
                  <md-table-row>
                    <!-- <template v-for="header in Object.keys(models[0])"> -->
                    <!-- <template v-for="header in model_headers">
                      <md-table-cell>
                        {{model[header]}}
                      </md-table-cell>
                    </template> -->
                    <md-table-cell>
                      {{model['name']}}
                    </md-table-cell>
                    <md-table-cell>
                      <template v-if="datasets.length > 0">
                        {{filterDataset(model['dataset_id'])}}
                      </template>
                      <template v-else="datasets.length > 0">
                        {{model['dataset_id']}}
                      </template>

                    </md-table-cell>

                    <!-- <md-table-cell>
                      {{filterModel(model['_id'])}}
                    </md-table-cell> -->

                    <md-table-cell>
                      <template v-for="c in model['categories']">
                        {{c['category_name']}}
                      </template>
                    </md-table-cell>


                  </md-table-row>
              </template>
            </md-table>
            <!-- <md-table md-sort-order="asc" md-card md-fixed-header> -->
            <!-- <md-table md-sort-order="asc">
              <md-table-toolbar>
                <h1 class="md-title">Models</h1>
              </md-table-toolbar>
              <md-table-row>
                <template v-for="header in Object.keys(models[0])">
                  <md-table-head>{{header}}</md-table-head>
                </template>
              </md-table-row>
              <template v-for="model in models">
                  <md-table-row>
                    <template v-for="header in Object.keys(models[0])">
                      <md-table-cell>
                        {{model[header]}}
                      </md-table-cell>
                    </template>
                  </md-table-row>
              </template>
            </md-table> -->
          </div>
        </template>


        <!-- <template v-if="ledgerState.retailers">
                  <data-table :data="ledgerState.retailers.map( s =>  ({ Id: s.Id, Products: s.products }) )" :style="{width: '300px', height: '200px', overflow: 'auto'}">
                      <template slot="caption">Retailers</template>
                  </data-table>
          </template> -->

      </div>

    </template>
    <div>

      <modal name="login-modal" height="auto">
        <h2 align="center"> {{title}} </h2>
        <vue-form id="chaincode-form" :model="form">
          <template v-for="(field, idx) in fields">
            <vue-form-item style="width:500px;" align=center>
              <vue-input :placeholder=field v-model=input[idx]>
              </vue-input>
            </vue-form-item>
          </template>
          <vue-form-item style="margin-left:100px">
            <vue-button type="default" v-on:click="hideModal({'name': 'login-modal'})">Cancel</vue-button>
            <vue-button type="success" v-on:click="login">Submit</vue-button>
          </vue-form-item>
        </vue-form>
      </modal>

      <modal name="upload-modal" height="auto">
        <h2 align="center" style="margin-top:20px;margin-bottom:20px"> Upload Files(s) </h2>
        <div id="drop_zone" v-on:drop="dropHandler" v-on:dragover="dragOverHandler">
          <p align="center">Drag and drop files here</p>
          <template v-if="filenames.length > 0">
            <li v-for="file in filenames">
              {{ file }}
            </li>
          </template>

          <!-- <v-select v-model="selectedModel" :options="models"></v-select> -->
        </div>
        <div style="width: 100%; margin: 0 auto;margin-top:20px">
          <h3 align="center">Select Model</h3>
          <div style="width: 80%; margin: 0 auto;">

            <select style="margin-top:10px;margin-bottom:30px" class="select-css" id="selectedModel">
              <template v-for="m in models">
                <option :value=m._id> {{m.name}} ({{m._id}}) </option>
              </template>
            </select>

            <!-- <md-field style="z-index:1000">
              <md-select v-model="selectedModel" name="selectedModel" id="selectedModel">
                  <template v-for="m in models">
                    <md-option style="z-index:1000" value=m._id> {{m._id}} {{m._name}} </md-option>
                  </template>
              </md-select>
            </md-field> -->

          </div>
        </div>
        <div style="width:35%; margin: 0 auto; margin-bottom: 20px">
          <!-- <div> -->
            <vue-button type="default" v-on:click="hideModal({'name': 'upload-modal'})">Cancel</vue-button>
            <vue-button type="success" v-on:click="submitInference() ; hideModal({'name': 'upload-modal'})">Upload</vue-button>
          <!-- </div> -->
        </div>
      </modal>


      <!-- </template> -->
      <!-- </template> -->
    </div>

    <template v-if="(selectedInference && (selectedInference.length > 0))">
      {{inferences.filter( (i) => i._id == selectedInference)[0]._id }}
      <h2> Detailed View </h2>

        <template v-if="((inferences.filter( (i) => i._id == selectedInference))[0].video_out) && ((inferences.filter( (i) => i._id == selectedInference))[0].percent_complete == 100)">
        <h3> {{(inferences.filter( (i) => i._id == selectedInference))[0].video_out}} </h3>
        <video id="videoContainer" ref="videoContainer" width="960" height="720" controls>
          <source :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].video_out" type="video/mp4">
        </video>
      </template>
      <template v-else-if="(inferences.filter( (i) => i._id == selectedInference))[0].video_in">
        <h3> {{(inferences.filter( (i) => i._id == selectedInference))[0].video_out}} </h3>
        <video id="videoContainer" ref="videoContainer" width="960" height="720" controls>
          <source :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].video_in " type="video/mp4">
        </video>
      </template>
      <template v-else>
        <h3> {{(inferences.filter( (i) => i._id == selectedInference))[0].filename}} </h3>
        <br />
        <template v-if="Object.keys(filterInference(selectedInference)).includes('analysis_type') && (filterInference(selectedInference)['analysis_type'] == 'classification') ">

          Adjust Transparency
          <input ref="opacitySlider" @input="updateTransparency" type="range" min="1" max="80" value="25" class="slider" id="myRange">

          <div style="position: absolute ; height: 700px; width: 100%" :id="'im_container_' + selectedInference" >
            <div>
              <img style="position:absolute; left:0; right:0; margin-left: auto; margin-right: auto; height: 500px; width: 700px" :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].thumbnail_path"></img>
              <img ref="heatmap" id="heatmap" style="position:absolute; left:0; right:0; margin-left: auto; margin-right: auto; opacity: 0.25 ;height: 500px; width: 700px" :src="(inferences.filter( (i) => i._id == selectedInference))[0].heatmap"></img>
            </div>
          </div>
        </template>
        <template v-else-if="Object.keys(filterInference(selectedInference)).includes('analysis_type') && (filterInference(selectedInference)['analysis_type'] == 'object_detection') ">
          <div style="position: absolute ; height: 700px; width: 100%" :id="'im_container_' + selectedInference" >
            <div>
              <canvas :id="'image_' + inference['_id']" v-overlay-image="filterInference(selectedInference)"></canvas>
              <!-- <img style="position:absolute; left:0; right:0; margin-left: auto; margin-right: auto; height: 500px; width: 700px" :src="url + (inferences.filter( (i) => i._id == selectedInference))[0].thumbnail_path"></img> -->
            </div>
          </div>
        </template>
      </template>

      <div style="position:relative;">


        <template v-if="Object.keys((inferences.filter( (i) => i._id == selectedInference))[0]).includes('video_in')">
          <md-card style="width:80%">
            <Plotly id="detailedLineGraph" ref="detailedLineGraph" v-on:click="updateVideo" :data="lineGraphData" :layout=lineGraphLayout :display-mode-bar="false"></Plotly>
          </md-card>
          <md-card style="width:50%">
            <!-- <md-card-content> -->
            <Plotly id="detailedPieGraph" :data=circleGraphData :display-mode-bar="false"></Plotly>
            <!-- </md-card-content> -->
          </md-card>

        </template>


      <md-card style="width:35%">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Inference Details</div>
          </md-card-header-text>
        </md-card-header>
        <!-- <md-card-content>
          <div class="md-subhead">Placeholder</div>
        </md-card-content> -->


        <md-card-content>
          <template v-if="Object.keys(filterInference(selectedInference)).includes('filename')">
            Filename: <div class="md-subhead">{{filterInference(selectedInference)['filename']}}</div>
          </template>
          <template v-else>
            <!-- TODO, readd -->
            <!-- <div class="md-subhead">{{filterInference(selectedInference)['video_in'].split('/').slice(-1)[0]}}</div> -->
          </template>
          <template v-if="inferenceDetails && (Object.keys(inferenceDetails).length > 0) && inference && inferenceDetails[selectedInference]">
            <div class="md-subhead">Detected Objects</div>
            <div>{{Object.keys(inferenceDetails[selectedInference]).join(", ")}}</div>
          </template>
          <!-- <div class="md-subhead">{{filterInference(selectedInference)['status']}} {{(inferences.filter( (i) => i._id == selectedInference))[0]['percent_complete'].toFixed(2)}} %</div> -->

          <!-- <div class="md-subhead">Model: {{filterInference(selectedInference)['model_id']}}</div> -->
          Model:  <div class="md-subhead">{{filterModel(filterInference(selectedInference)['model_id'])}}</div>


          Date: <div class="md-subhead">{{filterInference(selectedInference)['created_date']}}</div>


          <template v-if="Object.keys(filterInference(selectedInference)).includes('video_in')">
            Objects
            <!-- if video -->

            <div class="md-subhead">{{Object.keys(inferenceDetails[selectedInference]).join(", ")}}</div>
          </template>

          <template v-if="Object.keys(filterInference(selectedInference)).includes('analysis_type') && (filterInference(selectedInference)['analysis_type'] == 'object_detection') ">
            Objects
            <template v-for="idx in filterInference(selectedInference)['classified'].length">
              <!-- {{idx}} -->
              <!-- {{inference['classified'][idx - 1]}} -->
              {{filterInference(selectedInference)['classified'][idx - 1]['label']}} {{filterInference(selectedInference)['classified'][idx - 1]['confidence'].toFixed(3)}}
            </template>
          </template>

          <template v-if="Object.keys(filterInference(selectedInference)).includes('analysis_type') && (filterInference(selectedInference)['analysis_type'] == 'classification') ">
            Classes
            <template v-for="key in Object.keys(filterInference(selectedInference)['classified'])">
              <div class="md-subhead">{{key}} {{filterInference(selectedInference)['classified'][key]}}</div>
            </template>
            <!-- <div class="md-subhead">{{Object.keys(inferenceDetails[inference._id]).join(", ")}}</div> -->
          </template>

          <!-- <div> Object visible in n of x frames </div>
          <div> Object visible in n of x frames </div> -->
        </md-card-content>

      </md-card>
      </div>
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

    directives: {
      overlayImage: function(canvasElement, inference, opacity=1.0) {
          // Get canvas context
          console.log("loading overlay")
          console.log("inference.value")
          console.log(inference.value)
          console.log(Object.keys(inference.value))
          console.log(inference.value.heatmap)

          var ctx = canvasElement.getContext("2d");
          var can_w = ctx.canvas.width //= 400
          var can_h = ctx.canvas.height //= 500
          // var ch = canvasElement.height /
          var colors = ['red', 'blue', 'green', 'yellow', 'purple']
          var heatmap = new Image
          heatmap.id = "heatmap_" + inference.value['_id'];
          console.log('heatmap')
          console.log("heatmap_" + inference.value['_id'])
          console.log('_id')

          console.log(inference.value['_id'])
          var i = new Image
          i.id = "image_" + inference.value['_id'];

          i.onload = function() {
              // ctx.drawImage(i, 0,0, 100, 100 * imageObj.height / imageObj.width)
              // ctx.drawImage(i, 0, 0)
              console.log("creating thumbnail canvas image")
              var img_w = this.width
              var img_h = this.height
              var can_w = ctx.canvas.width //= 400
              var can_h = ctx.canvas.height //= 500

              // var hRatio = canvasElement.width / img_w    ;
              // var vRatio = canvasElement.height / img_h  ;
              console.log(`img_h ${img_h} img_w ${img_w} can_w ${can_w} can_h ${can_h}`)
              var vRatio = 1 //can_h / img_h ;
              var hRatio = 1 //can_w / img_w ;

              ctx.canvas.width = img_w
              ctx.canvas.height = img_h
              console.log(`img_h ${img_h} img_w ${img_w} can_w ${ctx.canvas.width} can_h ${ctx.canvas.height}`)
              var ratio = Math.min ( hRatio, vRatio )
              console.log('ratio')
              console.log(ratio)
              ctx.globalAlpha = 0.8;

              var centerShift_x = 0//( canvasElement.width - hRatio*img_w ) / 2;
              var centerShift_y = 0//( canvasElement.height - vRatio*img_h ) / 2;

              // var centerShift_x = ( canvasElement.width - img_w*ratio ) / 2;
              // var centerShift_y = ( canvasElement.height - img_h*ratio ) / 2;
              // ctx.drawImage(i, 0, 0, img_w, img_h, centerShift_x,centerShift_y,img_w*ratio, img_h*ratio ) //, 100, 100 * imageObj.height / imageObj.width)
              // ctx.drawImage(i, 0, 0, img_w, img_h, centerShift_x,centerShift_y,img_w*hRatio, img_h*vRatio ) //, 100, 100 * imageObj.height / imageObj.width)
              ctx.drawImage(i, 0, 0, img_w, img_h)//, centerShift_x,centerShift_y,img_w, img_h ) //, 100, 100 * imageObj.height / imageObj.width)

              // ctx.drawImage(i, 0, 0, img_w, img_h, 0,0,img_w*ratio, img_h*ratio ) //, 100, 100 * imageObj.height / imageObj.width)
              if (inference.value['analysis_type'] == 'object_detection') {
                // inference['classified']
                // "classified":[{"confidence":0.9998242259025574,"ymax":153,"label":"helmet","xmax":236,"xmin":136,"ymin":8},{"confidence":0.7896438241004944,"ymax":492,"label":"safety_vest","xmax":314,"xmin":114,"ymin":143}]
                console.log("drawing boxes")
                inference.value['classified'].map( (o, idx) => {
                  // context.rect(x,y,width,height)
                  // ctx.rect(20, 20, 150, 100);
                  // var ratio = 0.5 // 0.7220216606498195
                  // var y_offset = -150

                  var tl_x = o['xmin'] * hRatio
                  var tl_y = (o['ymin'] * vRatio)

                  var w = (o['xmax'] - o['xmin']) * hRatio
                  var h = (o['ymax'] - o['ymin']) * vRatio
                  ctx.lineWidth = "6";
                  ctx.strokeStyle = colors[idx % colors.length];
                  ctx.fillStyle = colors[idx % colors.length];
                  // ctx.strokeStyle = "blue";
                  console.log(`xmin ${o['xmin']}, ymax ${o['ymax']}, hRatio ${hRatio} vRatio ${vRatio}`)
                  console.log(`w ${w}, h ${h}, tl_x ${tl_x}, tl_y ${tl_y} ` )
                  ctx.beginPath()
                  ctx.font = "30px Arial";
                  ctx.fillText(o['label'], o['xmin'] + 20, o['ymin'] + 20)
                  ctx.rect( tl_x, tl_y, w, h )
                  // ctx.rect( tl_x + centerShift_x, tl_y + centerShift_y, w, h )
                  // ctx.rect( tl_x + centerShift_x, tl_y + centerShift_y + y_offset, w, h )
                  ctx.stroke()
                })
              } else {
                heatmap.onload = function() {
                    var img_w = this.width
                    var img_h = this.height
                    var hRatio = canvasElement.width / img_w    ;
                    var vRatio = canvasElement.height / img_h  ;
                    var ratio  = Math.max ( hRatio, vRatio )
                    ctx.globalAlpha = 0.4;
                    ctx.drawImage(heatmap, 0, 0, img_w, img_h, 0,0,img_w*ratio, img_h*ratio ) //, 100, 100 * imageObj.height / imageObj.width)
                    console.log("dims")
                    console.log(this.width)
                    console.log(this.height)
                    // TODO, add text based on class
                    // canvasElement.width = this.width
                    // canvasElement.height = this.height
                }
                heatmap.style.opacity = 0.1
                heatmap.style['z-index'] = 100
                heatmap.src = inference['value']['heatmap']
              }


          }
          // i.style.opacity = 0.1
          // console.log("thumbnail")
          // console.log(inference['value']['url'] + inference['value']['thumbnail_path'])

          i.src = inference['value']['url'] + inference['value']['thumbnail_path']

          console.log(`canvasElement.width ${canvasElement.width} ` )
          console.log(`canvasElement.height ${canvasElement.height} ` )






          // ctx.beginPath();
          // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
          // ctx.stroke();


          // ctx.drawImage(inference['heatmap'], 0, 0)
      }
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
        token: (localStorage['token'] || ''),

        model_headers: [
          'Name',
          'Dataset', // select category_name
          // '_id',
          'Categories'
        ],
        inference_headers: [
          "Filename",
          "Score",
          "Objects",
          "Model"
        ],
        // inference_headers: {
        //   "Filename": "",
        //   "Score": "",
        //   "Objects": "", //  Object.keys('classified')
        //   "Model": "model_id"
        // },
        // user_fields: [],
        // user_type: '',
        // user_input: [],
        input: [],
        func: '',
        showTables: true,
        title: '',
        selectedInference: '',
        selectedModel: '',
        models: [],
        datasets: [],
        files: [],
        filenames: [],
        inference: {},
        inferenceDetails: {},
        lineGraphData: [],
        circleGraphData: [],
        url: (localStorage['paiv_url'] || process.env.VUE_APP_URL),
        username: (localStorage['paiv_user'] || process.env.VUE_APP_USER),
        password: (localStorage['paiv_password'] || process.env.VUE_APP_PASSWORD),
        lineGraphLayout: {
          title: 'Objects Time Series',
          xaxis: {
            title: 'Num Seconds',
            showgrid: false,
            zeroline: false,
            tickmode: 'linear',
            autotick: true,
            dtick: '10',
            nticks: 10,
            // tickvals: [ 1, 10, 20, 30, 40, 50 ],
            // ticktext: [ "" ]
          },
          yaxis: {
            title: 'Objects',
            showline: false,
            dtick: 1
          }
        }

      }
    },
    components: {
      Form,
      FormItem,
      // DemoLoginModal,
      [Input.name]: Input,
      [Button.name]: Button
    },

    beforeMount() {

      // this.$data.selectedInference = "foobar"
      this.getInferences()
      // if (localStorage.getItem('token')) {
      //   this.$data.token = localStorage.getItem('token')
      // } else {
      //   this.login()
      // }
      // this.login()
      // this.$data.url = process.env.VUE_APP_URL,
      // this.$data.username = process.env.VUE_APP_USER,
      // this.$data.password = process.env.VUE_APP_PASSWORD

    },
    mounted() {
      this.getInferenceDetails();
      // this.getInferenceDetails()
      this.getModels()
      this.getDatasets()
      // TODO, remove this, get env vars working
      // this.$data.url = process.env.VUE_APP_URL,
      // this.$data.username = process.env.VUE_APP_USER,
      // this.$data.password = process.env.VUE_APP_PASSWORD
      // this.$data.url = process.env.url
      // console.log("process.env")
      // console.log(process.env)
      // this.getInferences()
    },
    methods: {
      dragOverHandler(ev) {
        console.log('File(s) in drop zone');
        ev.preventDefault();
      },
      filterInference(id){
        return (this.$data.inferences.filter( (i) => i._id == id))[0]
      },
      // filterModel(model_id){
      //   console.log(`getting name for model id ${model_id}`)
      //   return(this.$data.models.filter( (i) => i._id == model_id))[0].name
      // },
      filterModel(model_id){
        console.log(`getting name for model id ${model_id}`)
        // console.log(this.$data.models)
        let models = this.$data.models.filter( (i) => i._id == model_id)
        if (models.length > 0) {
          console.log(models)
          return models[0].name
        } else {
          return ""
        }
      },
      filterDataset(ds_id){
        console.log(`getting name for dataset ${ds_id}`)
        if ((this.$data.datasets.length > 0) && (ds_id.length > 0)) {
          console.log("parsing datasets")
          console.log(this.$data.datasets[0])
          console.log(Object.keys(this.$data.datasets[0]))
          console.log("name")
          console.log(this.$data.datasets[0]['name'])
          return this.$data.datasets.filter( (i) => i._id == ds_id)[0].name
        } else {
          console.log("no ds found")
        }
      },

      toggleTables() {
        this.$data.showTables = ! this.$data.showTables
      },
      // updateTransparency(canvasElement, inference, opacity=1.0) {
      updateTransparency() {
        console.log("updating image transparency")
        var heatmap = this.$refs['heatmap']
        var opacitySlider = this.$refs['opacitySlider']
        // console.log(opacitySlider)
        console.log(`heatmap.style.opacity ${heatmap.style.opacity}`)
        console.log(`opacitySlider.value ${opacitySlider.value}`)
        heatmap.style.opacity = (opacitySlider.value * .01)
        // console.log(heatmap.style.opacity)
      },
      getModels() {
        var options = {
          method: "GET",
          headers: {
            "X-Auth-Token": this.$data.token,
            "X-Proxy-URL": this.$data.url
          }
        }
        console.log("getting models")
        console.log(options)
        // fetch(this.$data.url + "/trained-models", options).then((res) => {
        // proxy needed for cors
        fetch('http://localhost:30000/proxyget' + "/api/trained-models", options).then((res) => {
          console.log("models received")
          // console.log(res)
          res.json().then((models) => {
            this.$data.models = models.filter( (m) => m.deployed == '1'  )
            console.log(models)
          })
        })
      },

      getDatasets() {
        var options = {
          method: "GET",
          headers: {
            "X-Auth-Token": this.$data.token,
            "X-Proxy-URL": this.$data.url
          }
        }
        console.log("getting datasets")
        console.log(options)
        // fetch(this.$data.url + "/trained-models", options).then((res) => {
        // proxy needed for cors
        fetch('http://localhost:30000/proxyget' + "/api/datasets", options).then((res) => {
          console.log("datasets received")
          // console.log(res)
          res.json().then((datasets) => {
            console.log("parsed dataset json")
            this.$data.datasets = datasets //models.filter( (m) => m.deployed == '1'  )
          })
        }).catch( (err) =>  {
          console.log("error getting datasets")
          console.log(err)
        })
      },

      parseDate(d) {
        var dateObj = (new Date(Date.parse(d)))
        // var r = date.getMonth() + date.getDay() + date.getYear()
        var date = `${dateObj.getMonth()}/${dateObj.getDate()}/${dateObj.getFullYear()}`
        var time = dateObj.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
        return `${date} ${time}`
      },
      forceFileDownload(response) {
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
          var fileName = s[s.length - 1]
          var options = {
            headers: {
              'X-Proxy-URL': this.$data.url
            }
          }
          fetch('http://localhost:30000/proxyget' + endpoint, options).then((res) => {
            res.blob().then((content) => {
              if (idx == (this.$data.renderInferences.length - 1)) {
                console.log("adding " + fileName + " to zip")
                var z = zip.file(fileName, content)
                setTimeout(() => { // TODO, there definitely should be a better option than setTimeout, but jszip chaining isn't working
                  console.log("z.files")
                  console.log(z.files)
                  z.generateAsync({
                    type: "blob"
                  }).then((blob) => {
                    console.log("downloading zip")
                    const url = window.URL.createObjectURL(blob) //new Blob([blob]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', "images.zip") //or any other extension
                    document.body.appendChild(link)
                    link.click()
                  })
                }, 1000);
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
        // this.$data.filenames = []
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
          localStorage.setItem('paiv_url', this.$data.input[0])
          localStorage.setItem('paiv_user', this.$data.input[1])
          localStorage.setItem('paiv_password', this.$data.input[2])

          this.$data.url = this.$data.input[0]
          this.$data.username = this.$data.input[1]
          this.$data.password = this.$data.input[2]
        }
        var options = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: this.$data.input[0],
            username: this.$data.input[1],
            password: this.$data.input[2]
          })
        }
        fetch("http://localhost:30000/token", options).then((res) => {
          console.log("token api request made")
          this.$modal.hide("login-modal")
          res.text().then((token) => {
            console.log(`received new token ${token}`)
            this.$data.token = token
            localStorage.setItem('token', token)
            this.getModels()
            this.getDatasets()
            this.getInferences()
            this.getInferenceDetails()
            // pull data
          }).catch((err) => {
            console.log("err in token api promise")
            console.log(err)
          })
        })
      },
      inputFile: function(newFile, oldFile) {
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          // Get response data
          console.log('response', newFile.response)
          if (newFile.xhr) {
            //  Get the response status code
            console.log('status', newFile.xhr.status)
          }
        }
      },
      inputFilter: function(newFile, oldFile, prevent) {
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
      updateVideo(eventData) {
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
        this.$data.files.map((file, f_idx) => {
          var formData = new FormData()
          formData.append('blob', file)
          var options = {
            method: "POST",
            body: formData,
            headers: {
              // "X-Auth-Token": this.$data.token,
              "X-Proxy-URL": this.$data.url
            //   // "Content-Type": "multipart/form-data"
            }
          }
          console.log("uploading file: " + file.name)
          console.log("posting to: " + "http://localhost:30000/proxypost" + "/api/dlapis/" + selectedModel)
          fetch("http://localhost:30000/proxypost" + "/api/dlapis/" + this.$data.selectedModel, options).then((res) => {
            console.log("api call complete")
            // this.$modal.hide('invoke-modal');
            res.json().then((result) => {
              console.log("json")
              console.log(result)
              // this.$data.inferences.append(result)
              // TODO, this only applies in case of a still image

              var endpoint = result.imageUrl.split('/uploads')[1]
              // result.classified.filter((c) =>  )
              this.$data.inferenceDetails[result.imageMd5] = {}
              console.log(JSON.stringify(result))
              if (Object.keys(result).includes('classified')) {
                // var labels = Array.from(new Set(result.classified.map((c) => c.label)))

                // if classified is "array", we're receiving results of "object detection"
                if (Array.isArray(result.classified)) {
                  // object detection
                  var analysis_type = 'object_detection'
                } else {
                  // classification
                  var analysis_type = 'classification'
                  /*
                  var labels = Array.from(new Set(Object.keys(result.classified).map((c) => c)))
                  labels.map((l) => {
                    var r = Object.keys(result.classified).filter(c => c.label == l)
                    var count = r.length //Array.from((new Set(r))).length
                    console.log("count for " + l)
                    this.$data.inferenceDetails[result.imageMd5][l] = {"count": count, "score": result.classified[l]}
                    // this.$data.inferenceDetails[result.imageMd5]['score'] = result.classified[l]
                  })
                  console.log("labels")
                  console.log(labels)
                  */
                }

                // object detection
                // {"webAPIId":"61539587-2c52-47d6-bfb7-a60d6d49bace","imageUrl":"http://vision-v120-prod-service:9080/vision-v120-prod-api/uploads/temp/61539587-2c52-47d6-bfb7-a60d6d49bace/ebd425bc-c675-4161-95e1-ca81bf685957.png","imageMd5":"8cb49157f32d2790dfc46b96abadbce7","classified":[{"confidence":0.9998242259025574,"ymax":153,"label":"helmet","xmax":236,"xmin":136,"ymin":8},{"confidence":0.7896438241004944,"ymax":492,"label":"safety_vest","xmax":314,"xmin":114,"ymin":143}],"result":"success"}
                // "classified":[{"confidence":0.9998242259025574,"ymax":153,"label":"helmet","xmax":236,"xmin":136,"ymin":8},{"confidence":0.7896438241004944,"ymax":492,"label":"safety_vest","xmax":314,"xmin":114,"ymin":143}]

                // classifier
                // {"webAPIId":"f1bdbfb5-7a55-402d-9cd4-3d7c16d1d8d4","imageUrl":"http://vision-v120-prod-service:9080/vision-v120-prod-api/uploads/temp/f1bdbfb5-7a55-402d-9cd4-3d7c16d1d8d4/d90d3ed3-8076-4cca-b2b9-b10ba331e9f3.png","imageMd5":"f9c7439db22cf5cea47d24453876cd14","classified":{"Pneumonia-Virus":"79.53754425048828"},"result":"success"}
                // "classified":{"Pneumonia-Virus":"79.53754425048828"}
              }

              if (Object.keys(result).includes('heatmap')) {
                var heatmap = result['heatmap']
              } else {
                var heatmap = ""
              }
              // TODO, curretly have to store this locally since pictures are not returned with other inferences. Should investigate where these images/metadata are stored, and possibly cache results
              var filename = endpoint.split('/').slice(-1)[0]

              var inference = {
                _id: result.imageMd5,
                analysis_type: analysis_type, //"image",
                created_date: (new Date().toJSON()),
                thumbnail_path: '/uploads' + endpoint,
                status: result['result'],
                filename: file.name, //filename,
                model_id: result['webAPIId'],
                heatmap: heatmap,
                percent_complete: 100,
                classified: result['classified'],
                url: this.$data.url


                // objects:
              }
              // this.$data.inferenceDetails[result.imageMd5] =  //result.classified
              console.log("appending inference ")
              console.log(inference)
              this.$data.inferences.push(inference)
              // "http://powerai-vision-ny-service:9080/powerai-vision-ny-api/uploads/temp/ee5f1177-7ff1-4cd5-86d2-60faca266c71/16acd8ad-2008-484b-8f7a-e669621852f3.jpg"
            }).catch((err) => {
              console.log("error parsing json")
              console.log(err)
            })
          }).catch((err) => {
            console.log(err)
          })
          if (f_idx == (this.$data.files.length - 1)) {
            this.$data.files = []
            this.$data.filenames = []
          }
        })
      },
      getInferences() {
        return new Promise((resolve, reject) => {
          var options = {
            method: "GET",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-Proxy-URL": this.$data.url,
              "X-Auth-Token": this.$data.token
            }
          }
          fetch("http://localhost:30000/inferences", options).then((response) => {
            response.json().then((json) => {
              // TODO filter is only here to ignore shared inferences
              var inf = json //.filter(i => i.model_id != '29dad520-4908-42fc-b118-9971b957bf8c')
              this.$data.inferences = inf; // json
              this.$data.renderInferences = inf //.filter(i => i.model_id == '3ac091c7-66ef-450a-8b7d-fa9e0cc748e6 	') // only need to do this initially

              resolve(inf)

              console.log(`inferences received ${JSON.stringify(inf)}`)
              // localStorage.setItem('inferences', inferences)
            })
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
        setTimeout(() => {
          fetch("http://localhost:30000/inferencedetailed", options).then((response) => {
            console.log(response)
            response.json().then((json) => {
              console.log("inference details received")
              console.log(JSON.stringify(json))
              this.$data.inferenceDetails = json
            }).catch((err) => {
              console.log("failure receiving detailed data")
              console.log(err)
            })
          })
        }, 2000)

      },
      search() {
        var query = this.$data.query.toLowerCase()
        console.log("performing search for: " + query)
        var a = []
        // TODO, allow multi search, split by query and
        // console.log("this.$data.inferenceDetails")
        // console.log(this.$data.inferenceDetails)
        this.$data.inferences.map((inference) => {
          // Object.values(inference).map( (v) => {
          // console.log(JSON.stringify(this.$data.inferenceDetails[inference._id]))
          if (JSON.stringify(inference).toLowerCase().includes(query) || (this.$data.inferenceDetails[inference._id] && JSON.stringify(this.$data.inferenceDetails[inference._id]).toLowerCase().includes(query))) {
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
        this.formatLine(inferenceId)
        this.formatCircle(inferenceId)
        // self.getInferenceDetails()
        // self.formatLine(inferenceId)
        // selectedInference
      },
      formatLine(inferenceId) {
        // console.log("keys")
        // console.log(Object.keys(this.$data.inferenceDetails[inferenceId])
        console.log("in formatLine method")
        console.log(inferenceId)
        if ( (inferenceId.includes('-')) && (this.$data.inferenceDetails) && (Object.keys(this.$data.inferenceDetails).includes(inferenceId)) ) {
          console.log("generating line graph for " + inferenceId)
          console.log(this.$data.inferenceDetails[inferenceId])
          var detections = this.$data.inferenceDetails[inferenceId]
          var objects = Object.keys(detections)
          var d = []
          objects.map((o) => {
            console.log("adding object " + o)
            var x = Array.from(Array(detections[o].length + 1).keys())
            // d['data'].push({
            d.push({
              x: [0].concat(x),
              y: [0].concat(detections[o]),
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
        }
        // this.$data.lineGraph =
        // this.$data.circleGraph =
      },
      formatCircle(inferenceId) {

        if (inferenceId.includes('-')) {
          console.log("generating circle graph for " + inferenceId)
          var detections = this.$data.inferenceDetails[inferenceId]
          var objects = Object.keys(detections)
          var d = {
            values: [],
            labels: [],
            type: "pie",
            textinfo: "label+percent",
            textposition: "outside",
            automargin: true
          }
          objects.map((o) => {
            d['values'].push(detections[o].reduce((a, b) => a + b, 0))
            d['labels'].push(o)
            console.log(d)
          })

          this.$data.circleGraphData = [d]
          console.log("this.$data.circleGraphData")
          console.log(this.$data.circleGraphData)
        }

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
    border: 2px dashed #eaecee;
    width: 400px;
    height: 300px;
    margin: auto;
  }

  /* select {
    margin: 50px;
    padding: 5px 35px 5px 5px;
    font-size: 16px;
    border: 1px solid #666666;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  } */

  /*  */



  .select-css {
  	display: block;
  	font-size: 16px;
  	font-family: sans-serif;
  	font-weight: 700;
  	color: #444;
  	line-height: 1.3;
  	padding: .6em 1.4em .5em .8em;
  	width: 100%;
  	max-width: 100%;
  	box-sizing: border-box;
  	margin: 0;
  	border: 1px solid #aaa;
  	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
  	border-radius: .5em;
  	-moz-appearance: none;
  	-webkit-appearance: none;
  	appearance: none;
  	background-color: #fff;
  	background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
  	  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  	background-repeat: no-repeat, repeat;
  	background-position: right .7em top 50%, 0 0;
  	background-size: .65em auto, 100%;
  }

  @import url("https://fonts.googleapis.com/css?family=Material+Icons");


  /* table {
      border-collapse: collapse;
      width: 100%;
  }

  tr {
      border-bottom: 1px solid #ccc;
  }

  th {
      text-align: left;
  } */


table.md-table tbody tr.secondary td[data-title]:before {
          content: attr(data-title);
          float: left;
          font-weight: bold;
      }
table.md-table tr.secondary td.md-cell {
color: rgba(0, 0, 0, 0.87);
font-size: 13px;
border-top: 1px rgba(0, 0, 0, 0.12) solid;
}
table.md-table tr.secondary td.md-cell {
  text-align: right;
padding: 10px !important;
}

table.md-table {
  width: 100%;
  border-spacing: 0;
  overflow: hidden;
}

th {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}


/* .md-table .md-table-head-text,
.md-table .md-table-cell .md-table-cell-container {
  padding-right: 0;
  padding-left: 0;
} */


</style>

<style lang="scss" scoped>
  .md-card {
    width: 320px;
    margin: 40px;
    display: inline-block;
    vertical-align: top;
  }
</style>
