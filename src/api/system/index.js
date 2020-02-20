import request from '@/utils/request'

const system = {
  // 获取通讯协议
  getProtocol() {
    return request({
      url: '/api/product/allProts',
      method: 'get'
    })
  },
  // 获取所有支持的功能
  getAllFuncs() {
    return request({
      url: '/api/product/allFuncs',
      method: 'get'
    })
  },
  // 获取所有设备命令
  getAllCommand(params) {
    return request({
      url: '/api/command/allCmd',
      method: 'get',
      params
    })
  },

  // 添加设备类型
  addDeviceType(data) {
    return request({
      url: '/api/product/save',
      method: 'post',
      data
    })
  },

  // 编辑设备类型
  updateDeviceType(data) {
    return request({
      url: '/api/product/update',
      method: 'put',
      data
    })
  },

  // 获取用户所有的设备型号
  getProductByUser() {
    return request({
      url: '/api/product/ownerByUser',
      method: 'get'
    })
  },
  deleteProduct(id) {
    return request({
      url: `/api/product/delete/${id}`,
      method: 'delete'
    })
  },

  // 获取指令类型
  getCommandType() {
    return request({
      url: '/api/command/cmdAction',
      method: 'get'
    })
  },

  // 新增指令
  addCommand(data) {
    return request({
      url: '/api/command/save',
      method: 'post',
      data
    })
  },

  // 导入指令
  importCommand(params) {
    return request({
      url: '/api/command/importCmd',
      method: 'get',
      params
    })
  },

  // 更新指令
  updateCommand(data) {
    return request({
      url: '/api/command/update',
      method: 'put',
      data
    })
  },

  // 删除指令
  delCommand(id) {
    return request({
      url: `/api/command/delete/${id}`,
      method: 'delete'
    })
  },

  // 用户管理

  // 获取用户列表
  getUsers() {
    return request({
      url: '/api/sys/user/users',
      method: 'get',
    })
  },

  // 获取所有用户
  getUserList(params) {
    return request({
      url: '/api/sys/user/list',
      method: 'get',
      params,
    })
  },

  // 获取用户信息
  getUserDetail(id) {
    return request({
      url: `/api/sys/user/info/${id}`,
      method: 'get'
    })
  },

  // 删除用户
  deleteUser(data) {
    return request({
      url: '/api/sys/user/delete',
      method: 'post',
      data,
    })
  },

  // 重置密碼
  resetUserPwd(params) {
    return request({
      url: '/api/sys/user/resetPassword',
      method: 'put',
      params,
    })
  },

  // 保存用户
  saveUser(type, data) {
    return request({
      url: `/api/sys/user/${type}`,
      method: type === 'save' ? 'post' : 'put',
      data,
    })
  },

  // 获取数据权限
  getDataScopes() {
    return request({
      url: '/api/sys/user/datascopes',
      method: 'get'
    })
  },

  // 角色管理

  // 获取所有角色
  getRoleList(params) {
    return request({
      url: '/api/sys/role/list',
      method: 'get',
      params,
    })
  },

  // 获取选择权限
  getSelectRole() {
    return request({
      url: '/api/sys/role/select',
      method: 'get'
    })
  },

  // 获取角色详情
  getRoleDetail(id) {
    return request({
      url: `/api/sys/role/info/${id}`,
      method: 'get',
    })
  },

  // 删除角色
  deleteRole(data) {
    return request({
      url: '/api/sys/role/delete',
      method: 'post',
      data,
    })
  },

  // 保存角色
  saveRole(type, data) {
    return request({
      url: `/api/sys/role/${type}`,
      method: type === 'save' ? 'post' : 'put',
      data,
    })
  },

  // 定时任务

  // 获取所有任务
  getScheduleList(params) {
    return request({
      url: '/api/sys/schedule/list',
      method: 'get',
      params,
    })
  },

  // 获取任务详情
  getScheduleDetail(id) {
    return request({
      url: `/api/sys/schedule/info/${id}`,
      method: 'get',
    })
  },

  // 删除任务
  deleteSchedule(data) {
    return request({
      url: '/api/sys/schedule/delete',
      method: 'post',
      data,
    })
  },

  // 保存任务
  saveSchedule(data) {
    return request({
      url: '/api/sys/schedule/save',
      method: 'post',
      data,
    })
  },
  updateSchedule(data) {
    return request({
      url: '/api/sys/schedule/update',
      method: 'put',
      data,
    })
  },

  // 菜单管理

  // 获取所有菜单
  getMenuList(params) {
    return request({
      url: '/api/sys/menu/list',
      method: 'get',
      params,
    })
  },

  // 获取选择菜单
  getSelectMenuList() {
    return request({
      url: '/api/sys/menu/select',
      method: 'get',
    })
  },

  // 获取菜单详情
  getMenuDetail(id) {
    return request({
      url: `/api/sys/menu/info/${id}`,
      method: 'get',
    })
  },

  // 删除菜单
  deleteMenu(menuId) {
    return request({
      url: `/api/sys/menu/delete/${menuId}`,
      method: 'post',
    })
  },

  // 保存菜单
  saveMenu(type, data) {
    return request({
      url: `/api/sys/menu/${type}`,
      method: 'post',
      data,
    })
  },

  // 获取LogList
  getLogList(params) {
    return request({
      url: '/api/sys/log/list',
      method: 'get',
      params
    })
  },

  // 删除Log
  deleteLog(id) {
    return request({
      url: `/api/sys/log/delete/${id}`,
      method: 'delete'
    })
  },

  // 获取809info
  getJt809UserList(params) {
    return request({
      url: '/api/jt809/list',
      method: 'get',
      params
    })
  },

}

export default system
