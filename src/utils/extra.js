import store from '@/store'

const extra = {
  doneLoading() {
    store.dispatch('setShowLoading', false)
  },

  getBrowserInfo() {
    const userAgent = navigator.userAgent //取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1 //判断是否Opera浏览器
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera //判断是否IE浏览器
    const isEdge = userAgent.indexOf('Edge') > -1 //判断是否IE的Edge浏览器
    const isFF = userAgent.indexOf('Firefox') > -1 //判断是否Firefox浏览器
    const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 //判断是否Safari浏览器
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 //判断Chrome浏览器

    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+)')
      reIE.test(userAgent)
      const fIEVersion = parseFloat(RegExp['$1'])
      switch (fIEVersion) {
        case 7:
          return 'IE7'
        case 8:
          return 'IE8'
        case 9:
          return 'IE9'
        case 10:
          return 'IE10'
        case 11:
          return 'IE11'
        default:
          return 'IE'
      }
    }

    function getVersion(browserName) {
      const idx = userAgent.indexOf(browserName)
      const versionArr = userAgent.slice(idx).split(' ')
      for (let i in versionArr) {
        const item = versionArr[i]
        if (item.indexOf(browserName) !== -1) {
          return item
        }
      }
      return ''
    }

    if (isOpera) {
      return getVersion('Opera')
    }
    if (isEdge) {
      return getVersion('Edge')
    }
    if (isFF) {
      return getVersion('Firefox')
    }
    if (isSafari) {
      return getVersion('Safari')
    }
    if (isChrome) {
      return getVersion('Chrome')
    }
  },

  // 深度clone
  deepClone(obj) {
    let o
    // 如果  他是对象object的话  , 因为null,object,array  也是'object'
    if (typeof obj === 'object') {
      // 如果  他是空的话
      if (obj === null) {
        o = null
      } else {
        // 如果  他是数组arr的话
        if (obj instanceof Array) {
          o = []
          for (let i = 0, len = obj.length; i < len; i++) {
            o.push(this.deepClone(obj[i]))
          }
        }
        // 如果  他是对象object的话
        else {
          o = {}
          for (const j in obj) {
            o[j] = this.deepClone(obj[j])
          }
        }
      }
    } else {
      o = obj
    }
    return o
  },

  /**
   * 树形数据转换
   * @param {*} data
   * @param {*} id
   * @param {*} pid
   */
  treeDataTranslate(data, id = 'id', pid = 'parentId') {
    let res = []
    let temp = {}
    for (let i = 0; i < data.length; i++) {
      temp[data[i][id]] = data[i]
    }
    for (let k = 0; k < data.length; k++) {
      if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
        if (!temp[data[k][pid]]['children']) {
          temp[data[k][pid]]['children'] = []
        }
        if (!temp[data[k][pid]]['_level']) {
          temp[data[k][pid]]['_level'] = 1
        }
        data[k]['_level'] = temp[data[k][pid]]._level + 1
        temp[data[k][pid]]['children'].push(data[k])
      } else {
        res.push(data[k])
      }
    }
    return res
  },

  /**
   * 参数转换
   * @param {*} param
   */
  parseXML(param) {
    let paramsListObj = []
    const params = '<params>' + param + '</params>'
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(params, 'text/xml')
    const parent = xmlDoc.children[0]
    const children = parent.children
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      const desc = item.innerHTML
      const type = item.getAttribute('type')
      const value = item.getAttribute('value')
      if (type && desc) {
        paramsListObj.push({
          type: type,
          desc: desc,
          value: value
        })
      }
    }

    return {
      paramsListObj: paramsListObj
    }
  },

  conversionSize(limit) {
    var size = ''
    if (limit < 0.1 * 1024) {
      size = limit.toFixed(2) + 'B'
    } else if (limit < 0.1 * 1024 * 1024) {
      size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    var sizeStr = size + ''
    var index = sizeStr.indexOf('.')
    var dou = sizeStr.substr(index + 1, 2)
    if (dou == '00') {
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size
  }
}

export default extra
