import request from '@/utils/request'

const manage = {
  // 获取客户列表
  getDepts() {
    return request({
      url: '/api/sys/dept/deps',
      method: 'get',
    })
  },

  // 获取客户列表选择
  deptsSelect() {
    return request({
      url: '/api/sys/dept/select',
      method: 'get',
    })
  },

  addDept(data) {
    return request({
      url: '/api/sys/dept/save',
      method: 'post',
      data,
    })
  },
  enableDept(params) {
    return request({
      url: '/api/sys/dept/enable',
      method: 'put',
      params,
    })
  },
  updateDept(data) {
    return request({
      url: '/api/sys/dept/update',
      method: 'put',
      data,
    })
  },

  // 获取分组列表
  getAllGroups() {
    return request({
      url: '/api/group/list',
      method: 'get',
    })
  },
  getGroupsByDept(deptId) {
    return request({
      url: '/api/group/listByDept',
      method: 'get',
      params: { deptId }
    })
  },

  // 保存或更新分组
  saveGroup(type, data) {
    return request({
      url: `/api/group/${type}`,
      method: type === 'save' ? 'post' : 'put',
      data,
    })
  },

  // 删除分组
  deleteGroup(id) {
    return request({
      url: `/api/group/delete/${id}`,
      method: 'delete'
    })
  },

  // 获取设备类型列表
  getDeviceTypeList() {
    return request({
      url: '/api/product/ownerByUser',
      method: 'get',
    })
  },

  // 获取设备录音列表
  getDeviceRecs(params) {
    return request({
      url: '/api/devicerec/list',
      method: 'get',
      params,
    })
  },

  // 删除录音
  deleteRec(id) {
    return request({
      url: `/api/devicerec/delete/${id}`,
      method: 'delete',
    })
  },

  // 下载设备录音
  downloadRec(params) {
    return request({
      url: '/api/devicerec/downRec',
      method: 'get',
      params,
      responseType: 'blob',
    })
  },
}

export default manage
