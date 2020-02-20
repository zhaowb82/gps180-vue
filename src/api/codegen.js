import request from '@/utils/request'

// const baseUrl = 'http://localhost'
const codegen = {
  getTableList(params) {
    return request({
      url: '/api/sys/generator/list',
      method: 'get',
      params,
    })
  },

  // 发送命令
  generateCode(tables, param) {
    return request({
      url: '/api/sys/generator/code',
      method: 'get',
      params: {
        tables,
        param
      },
      responseType: 'blob',
    })
  },

}

export default codegen
