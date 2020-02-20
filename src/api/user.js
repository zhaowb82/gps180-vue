import request from '@/utils/request'

const user = {
  login(data) {
    return request({
      url: '/api/sys/login',
      method: 'post',
      data
    })
  },

  logout() {
    return request({
      url: '/api/sys/logout',
      method: 'post'
    })
  },

  getUserInfo() {
    return request({
      url: '/api/sys/user/info',
      method: 'get'
    })
  },

  // 获取用户菜单及权限配置
  getUserMenuPermission() {
    return request({
      url: '/api/sys/menu/nav',
      method: 'get'
    })
  },

  // 修改密码
  changePassword(data) {
    return request({
      url: '/api/sys/user/password',
      method: 'post',
      data
    })
  }
}

export default user
