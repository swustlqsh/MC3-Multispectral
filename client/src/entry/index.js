import 'nprogress/nprogress.css'
import 'font-awesome/css/font-awesome.css'
import 'PLUGINS/uikit/css/uikit.min.css'
import 'PLUGINS/uikit/js/uikit.min.js'
import 'PLUGINS/jquery-extend/resize.js'
import Vue from 'vue'
import App from '../App.vue'
import Store from '../vuex/index'
import config from '../commons/config'
import frame from 'FRAME'
console.log('App', App)
Vue.use(frame)
frame.vueInstall({ module: 'v', name: 'config' }, config) // 在Vue实例中通过this.vConfig进行使用

const run = function () {
  return new Vue({
    el: 'body',
    replace: false,
    components: {
      App
    },
    store: Store
  })
}

run()
