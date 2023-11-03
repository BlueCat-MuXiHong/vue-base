import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui' //全局引入
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI) //全局引入
new Vue({
  el: '#app',
  router,
  store,
  created() {
    store.commit('addMenu', router)
  },
  components: {App},
  template: '<App/>'
})
