// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'

import AmMapCss from 'amcharts3/amcharts/ammap.css'
import AmMap from 'amcharts3/amcharts/ammap'
import WorldLow from 'amcharts3/amcharts/maps/js/worldLow'

import Style from './assets/style.scss'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
