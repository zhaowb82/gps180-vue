import request from '@/utils/request'

const report = {
  // 获取报警消息
  getAlarms(params) {
    return request({
      url: '/api/alarm/allAlarms',
      method: 'get',
      params,
    })
  },

  // 获取命令报表
  getCommandLogs(params) {
    return request({
      url: '/api/command/commandLogs',
      method: 'get',
      params,
    })
  },

  // 获取轨迹停靠点信息
  getTravelInfoList(params) {
    return request({
      // url: '/api/hbase/get',
      url: '/api/gps/trackPos',
      method: 'get',
      params,
    })
  },

}

export default report
