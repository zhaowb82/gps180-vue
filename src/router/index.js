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

export default router
