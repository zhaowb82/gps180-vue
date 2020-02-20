import _user from '@/api/user'
import _cookies from '@/utils/webStorage'

const user = {
  state: {
    token: '',
    loginType: '',
    username: '',
    userId: '',
    companyID: '',
    menuList: [],
    permissions: [],
  },
  mutations: {
    SET_TOKEN: (state, value) => {
      state.token = value
    },
    SET_LOGIN_TYPE: (state, value) => {
      state.loginType = value
    },
    SET_USERNAME: (state, value) => {
      state.username = value
    },
    SET_USERID: (state, value) => {
      state.userId = value
    },
    // SET_COMPANYID: (state, value) => {
    //   state.companyId = value
    // },
    SET_MENU_LIST: (state, value) => {
      state.menuList = value
    },
    SET_PERMISSIONS: (state, value) => {
      state.permissions = value
    },
  },
  actions: {
    // 用户登录
    Login({
      commit
    }, loginInfo) {
      // const username = loginInfo.username.trim()
      return new Promise((resolve, reject) => {
        _user
          .login(loginInfo)
          .then((res) => {
            if (res.code === 0) {
              commit('SET_TOKEN', res.data.token)
              _cookies.setToken(res.data.token)
              resolve(res.data)
            } else {
              reject(res)
            }
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    // 用户退出
    Logout({
      commit
    }) {
      // const username = loginInfo.username.trim()
      return new Promise((resolve, reject) => {
        _user
          .logout()
          .then((res) => {
            if (res.code === 0) {
              commit('SET_TOKEN', '')
              commit('SET_LOGIN_TYPE', '')
              commit('SET_USERID', '')
              commit('SET_USERNAME', '')
              _cookies.removeToken()
              resolve()
            } else {
              reject(res)
            }
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        _user
          .getUserInfo()
          .then((res) => {
            if (res && res.code === 0) {
              commit('SET_TOKEN', _cookies.getToken())
              var loginType = res.data.loginType
              commit('SET_LOGIN_TYPE', loginType)
              if (loginType === 'User') {
                commit('SET_USERID', res.data.user.userId)
                commit('SET_USERNAME', res.data.user.username)
              } else if (loginType === 'Device') {
                commit('SET_USERID', res.data.device.imei)
                commit('SET_USERNAME', res.data.device.imei)
              }
              // commit('SET_COMPANYID', res.data.deptId)
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    // 获取用户菜单和权限
    GetUserMenuPermission({
      commit
    }) {
      return new Promise((resolve, reject) => {
        _user
          .getUserMenuPermission()
          .then((res) => {
            if (res && res.code === 0) {
              commit('SET_MENU_LIST', res.data.menuList)
              commit('SET_PERMISSIONS', res.data.permissions)
              // 保存用户权限
              _cookies.setPermissions(JSON.stringify(res.data.permissions))
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch((e) => {
            reject(e)
          })
      })
    },
  },
}

export default user
