import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import 'babel-polyfill'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false

fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/image/logo@2x.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
