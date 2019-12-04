import Vue from 'vue'
import App from './App.vue'
import VFC from 'vfc'
import DataTable from 'v-data-table'
import VModal from 'vue-js-modal'
// import Modal from './components/Modal.vue'
// import card from 'vue-card'
import vSelect from 'vue-select'

import 'vfc/dist/vfc.css'
import './dist/json-tree.css'


import TreeView from "vue-json-tree-view"

import VCardElement from 'vue-card-element'
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// import vuetify from './plugins/vuetify';
// Vue.use(Vuetify)
// Vue.use(vuetify)
// import Vue from 'vue'
import { MdButton, MdContent, MdTabs, MdCard, MdField, MdInput, MdTable } from 'vue-material/dist/components'
// import {MdSelect, MdOption} from 'vue-material/src/components/MdField/MdSelect'
// import 'vue-material/src/components/MdField'

import 'vuetify/dist/vuetify.min.css'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
// import VueMaterial from 'vue-material'
const VueUploadComponent = require('vue-upload-component')
// Vue.use(VueMaterial)
import { Plotly } from 'vue-plotly'
import JSZip from 'jszip'
import DetailedInferenceView from './components/DetailedInferenceView'
import Drag from './components/Drag'
import Router from 'vue-router'
Vue.use(Drag)
Vue.component('drag', Drag)

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdCard)
Vue.use(MdTabs)
Vue.use(MdField)
Vue.use(MdTable)

Vue.config.productionTip = false

Vue.use(DataTable)
Vue.use(VFC)
Vue.use(VModal)
Vue.use(Router)
// Vue.use(card)
// Vue.use(VueUploadComponent)
Vue.use(Plotly)
Vue.component('Plotly', Plotly)
// Vue.use(VModal, { componentName: "modal" })
Object.defineProperty(Vue.prototype, '$JSZip', { value: JSZip });
// Vue.use(Vuetable)
// Vue.component('modal', {
//   template: '#modal-template'
// })
const router = new Router({
  routes: [
    // {
    //   path: '/inference/:inferenceId',
    //   name: 'inference',
    //   component: DetailedInferenceView
    // },
    {
      path: '/',
      name: 'app',
      component: App
    }
  ]
})

new Vue({
  render: h => h(App),

  router,
  // vuetify,
  // components: {FileUpload: VueUploadComponent},
  // data: function() {
  //   return {
  //     showModal: false
  //   }
  // }
}).$mount('#app')
