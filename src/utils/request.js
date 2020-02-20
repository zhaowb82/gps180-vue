import axios from 'axios'
// import store from '@/store'
import _cookies from '@/utils/webStorage'

const service = axios.create({
  timeout: 20000
})

service.interceptors.request.use(
  (config) => {
    if (_cookies.getToken()) {
      config.headers.token = _cookies.getToken()
    }
    // if (getLocaToken()) {
    //   // config.headers.token = getLocaToken()
    //   // config.headers.usertype = 'cert_h5'
    // } else {
    //   // config.headers.usertype = 'cert_h5'
    //   // config.headers.token = ''
    // }
    return config
  },
  (error) => {
    console.log(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data
    } else {
      console.log(response)
    }
  },
  (error) => {
    const response = error.response
    if (response.status === 401) {
      console.log(response.data.msg)
      _cookies.removeToken()
      location.reload()
      // store.dispatch('Logout').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
    }
  }
)

export default service
