const xPI = (3.14159265358979324 * 3000.0) / 180.0
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

const transformlat = (lng, lat) => {
  lat = +lat
  lng = +lng
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0
  return ret
}

const transformlng = (lng, lat) => {
  lat = +lat
  lng = +lng
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
const out_of_china = (lng, lat) => {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const wgs2gcj = (lng, lat) => {
  lat = +lat
  lng = +lng
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0)
    let dlng = transformlng(lng - 105.0, lat - 35.0)
    const radlat = (lat / 180.0) * PI
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    const sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [mglng, mglat]
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const gcj2wgs = (lng, lat) => {
  lat = +lat
  lng = +lng
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0)
    let dlng = transformlng(lng - 105.0, lat - 35.0)
    const radlat = (lat / 180.0) * PI
    let magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    const sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const bd2gcj = (lng, lat) => {
  const x = lng - 0.0065
  const y = lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI)
  const gg_lng = z * Math.cos(theta)
  const gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat]
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const gcj2bd = (lng, lat) => {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI)
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI)
  const bd_lng = z * Math.cos(theta) + 0.0065
  const bd_lat = z * Math.sin(theta) + 0.006
  return [bd_lng, bd_lat]
}

/**
 * WGS84 与百度坐标系(BD - 09) 的转换
 * 即GPS 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const wgs2bd = (lng, lat) => {
  const lng_lat_1 = wgs2gcj(lng, lat)
  const lng_lat_2 = gcj2bd(lng_lat_1[0], lng_lat_1[1])
  return lng_lat_2
}

/**
 * 百度坐标系(BD - 09) 与 WGS84 的转换
 * 即百度 转 GPS
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const bd2wgs = (lng, lat) => {
  const lng_lat_1 = bd2gcj(lng, lat)
  const lng_lat_2 = gcj2wgs(lng_lat_1[0], lng_lat_1[1])
  return lng_lat_2
}

/**
 * 百度坐标系(BD - 09)转换为详细地址
 * @param lng
 * @param lat
 * @returns {''}
 */
const bd2address = (lng, lat) => {
  return new Promise(async (resolve, reject) => {
    // eslint-disable-next-line
    const point = new BMap.Point(lng, lat)
    // eslint-disable-next-line
    const geo = new BMap.Geocoder()
    await geo.getLocation(point, (rs) => {
      if (rs) {
        const addComp = rs.addressComponents
        const surroundingPois = rs.surroundingPois
        let finaladdress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
        let buildingAddress = ''
        if (surroundingPois && surroundingPois.length > 0) {
          //get max 3 size
          const realSize = Math.min(3, surroundingPois.length)
          for (var i = 0; i < realSize; ++i) {
            var singleAddress = surroundingPois[i].title
            buildingAddress += singleAddress
            if (i < realSize - 1) {
              buildingAddress += ','
            }
          }
        }
        if (buildingAddress.length > 0) {
          finaladdress += ';' + buildingAddress
        }
        // if (callback) {
        //   callback(finaladdress)
        // } else {
        resolve(finaladdress)
        // }
      } else {
        reject()
      }
    })
  })
}

export default {
  wgs2gcj,
  gcj2wgs,
  bd2gcj,
  gcj2bd,
  wgs2bd,
  bd2wgs,
  bd2address,
}
