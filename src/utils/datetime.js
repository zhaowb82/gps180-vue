const datetime = {
  format(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') {
        const now = new Date()
        if (date.toDateString() === now.toDateString()) {
          return '今天'
        } else {
          return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][value]
        }
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return timeStr
  },

  // 获取格林威治时间
  UTC() {
    const d = new Date()
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds())
  },

  // 计算间隔时间
  intervalTime(startTime, endTime) {
    const start = new Date(Date.parse(startTime.replace(/-/g, '/')))
    const end = new Date(Date.parse(endTime.replace(/-/g, '/')))
    const timeStamp = end.getTime() - start.getTime()

    const days = Math.floor(timeStamp / (24 * 3600 * 1000))

    const hours = Math.floor((timeStamp % (24 * 3600 * 1000)) / (3600 * 1000))

    const minutes = Math.floor(((timeStamp % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000))

    const seconds = Math.round((((timeStamp % (24 * 3600 * 1000)) % (3600 * 1000)) % (60 * 1000)) / 1000)

    const stopTime = ((days === 0) ? '' : (days + '天')) + ((hours === 0) ? '' : (hours + '小时')) + ((minutes === 0) ? '' : (minutes + '分')) + ((seconds === 0) ? '' : (seconds + '秒'))

    return stopTime
  }
}

export default datetime
