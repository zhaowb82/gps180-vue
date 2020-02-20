import request from '@/utils/request'

const riskpos = {

  getRiskPointList(params) {
    return request({
      url: '/api/riskpos/list',
      method: 'get',
      params,
    })
  },
  getRiskPointDetail(id) {
    return request({
      url: `/api/riskpos/info/${id}`,
      method: 'get'
    })
  },
  addRiskPoint(data) {
    return request({
      url: '/api/riskpos/save',
      method: 'post',
      data
    })
  },
  updateRiskPoint(data) {
    return request({
      url: '/api/riskpos/update',
      method: 'put',
      data
    })
  },
  deleteRiskPoint(id) {
    return request({
      url: `/api/riskpos/delete/${id}`,
      method: 'delete'
    })
  },

}

export default riskpos
