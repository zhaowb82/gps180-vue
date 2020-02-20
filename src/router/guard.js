import _cookies from '@/utils/webStorage'
import store from '@/store'
// import router from '@/router'

const whiteList = ['/login', '/404']

export default async (to, from, next) => {
  store.dispatch('setShowLoading', true)
  if (_cookies.getToken()) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (store.getters.userId === '') {
        await store.dispatch('GetUserInfo')
        await store.dispatch('GetUserMenuPermission')
        next()
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
}
