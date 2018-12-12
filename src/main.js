import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'babel-polyfill'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
// import VConsole from 'vconsole'
// import VConsole from 'vconsole/dist/vconsole.min.js'
// const vConsole = new VConsole();
import Cube from 'cube-ui'
// 
Vue.use(Cube)
console.log(222)
Vue.config.productionTip = false
window.$uri = 'http://47.96.100.173' // 这是我自己的服务器地址 需要代理转发的接口会使用$uri
// window.$uri = ''

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
