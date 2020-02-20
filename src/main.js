import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import cookies from './utils/webStorage'
import Zui from './components'
import api from './api'
import extra from './utils/extra'
import trans from './utils/transform'
import ws from './utils/webSocket'
import datetime from './utils/datetime'
import './plugins/element.js'
import BaiduMap from 'vue-baidu-map'
import 'element-ui/lib/theme-chalk/display.css'
import { isAuth } from '@/utils'

Vue.use(BaiduMap, {
  ak: '3cyBpcnRStESk7rGV8v61GHYGsHvIupi'
})
Vue.use(Zui)

Vue.config.productionTip = false
Vue.prototype.$cookies = cookies
Vue.prototype.$api = api
Vue.prototype.$extra = extra
Vue.prototype.$trans = trans
Vue.prototype.$ws = ws
Vue.prototype.$datetime = datetime
Vue.prototype.isAuth = isAuth     // 权限方法

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
