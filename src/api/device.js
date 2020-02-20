import request from '@/utils/request'

const device = {
  // 获取分组列表
  getAllGroupList() {
    return request({
      url: '/api/group/list',
      method: 'get',
    })
  },

  // 获取设备列表
  getAllDeviceList() {
    return request({
      url: '/api/device/list',
      method: 'get',
    })
  },

  // 获取设备列表
  getDevices(params) {
    return request({
      url: '/api/device/listPage',
      method: 'get',
      params,
    })
  },

  // 获取设备基本信息
  getDeviceDetail(imei) {
    return request({
      url: `/api/device/info/${imei}`,
      method: 'get'
    })
  },

  // 保存或更新设备
  saveDevice(type, data) {
    return request({
      url: `/api/device/${type}`,
      method: type === 'save' ? 'post' : 'put',
      data,
    })
  },

  // 编辑设备信息
  saveDeviceDetail(data) {
    return request({
      url: '/api/device/update',
      method: 'put',
      data
    })
  },

  // 批量保存设备
  saveDevices(data) {
    return request({
      url: '/api/device/saveList',
      method: 'post',
      data,
    })
  },

  // 删除设备
  deleteDevice(params) {
    return request({
      url: '/api/device/delete',
      method: 'delete',
      params,
    })
  },

  // 重置设备密码
  resetDevicePwd(params) {
    return request({
      url: '/api/device/resetPassword',
      method: 'put',
      params,
    })
  },

  // 搜索获取设备
  getDeviceListBySearch(params) {
    return request({
      url: '/api/device/listByImei',
      method: 'get',
      params,
    })
  },




  // 获取最新设备上报位置信息
  getLastPosition(params) {
    return request({
      url: '/api/gps/lastPosition',
      method: 'get',
      params,
    })
  },

  // 获取设备报警
  getAlarmWarning(params) {
    return request({
      url: '/api/alarm/alarms',
      method: 'get',
      params,
    })
  },

  // 删除设备报警
  deleteAlarmWarning(params) {
    return request({
      url: '/api/alarm/delAlarm',
      method: 'delete',
      params
    })
  },

  // 获取设备信息
  getAlarmMessage(params) {
    return request({
      url: '/api/alarm/msgs',
      method: 'get',
      params,
    })
  },

  // 获取设备命令列表
  getDeviceCmd(params) {
    return request({
      url: '/api/command/cmdForDevice',
      method: 'get',
      params
    })
  },

  // 发送命令
  sendCommand(data) {
    return request({
      url: '/api/command/sendCmd',
      method: 'post',
      data,
    })
  },

  // 取消发送指令
  cancelCommand(params) {
    return request({
      url: '/api/command/delCacheCmd',
      method: 'delete',
      params
    })
  },

  // 删除消息
  deleteMessage(params) {
    return request({
      url: '/api/alarm/delEvent',
      method: 'delete',
      params,
    })
  },

  // 刷新设备信息
  getDeviceInfo(imei) {
    return request({
      url: `/api/gps/postion/${imei}`,
      method: 'get',
    })
  },



  // 获取指令下发记录
  getCmdLogs(params) {
    return request({
      url: '/api/command/records',
      method: 'get',
      params
    })
  },

  // 获取围栏列表
  getFenceList() {
    return request({
      url: '/api/geofence',
      method: 'get'
    })
  },

  // 添加围栏
  saveFence(data) {
    return request({
      url: '/api/geofence',
      method: 'post',
      data
    })
  },

  // 修改围栏
  updateFence(data) {
    return request({
      url: '/api/geofence',
      method: 'put',
      data
    })
  },

  // 删除围栏
  delFence(id) {
    return request({
      url: `/api/geofence/${id}`,
      method: 'delete'
    })
  },

  // 为设备绑定围栏
  bindFence(data) {
    return request({
      url: '/api/geofence/bind',
      method: 'post',
      data
    })
  },

  // 获取围栏列表
  unbindFence(data) {
    return request({
      url: '/api/geofence/unbind',
      method: 'delete',
      data
    })
  },

  // 获取绑定围栏设备列表
  getBindList(params) {
    return request({
      url: 'api/device/bindGeofenceList',
      method: 'get',
      params
    })
  },

  // 获取未绑定围栏设备列表
  getUnbindList(params) {
    return request({
      url: 'api/device/unbindGeofenceList',
      method: 'get',
      params
    })
  }
}

export default device
