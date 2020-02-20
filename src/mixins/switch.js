export default {
  methods: {
    switchPositionType(type) {
      switch (type) {
        case 'un':
          return '未知'
        case 'lbs':
          return '基站定位'
        case 'gps':
          return '卫星定位'
        case 'wifi':
          return 'WIFI定位'
        default:
          return '未知'
      }
    }

  }
}
