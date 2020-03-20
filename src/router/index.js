import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import routes from './routes'
import guard from './guard'

Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

router.beforeEach(guard)

router.afterEach(() => {
  store.dispatch('setShowLoading', false)
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
