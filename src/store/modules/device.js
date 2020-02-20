import _cookies from 'js-cookie'
import _device from '@/api/device'

const device = {
  state: {
    userType: _cookies.get('userType'),
    deviceList: [],
    groupList: [],
    lastPositions: [],
    currentDevice: null
  },
  mutations: {
    SET_DEVICE_LIST(state, value) {
      state.deviceList = value
    },
    SET_GROUP_LIST(state, value) {
      state.groupList = value
    },
    SET_LAST_POSITIONS(state, value) {
      state.lastPositions = value
    },
    SET_CURRENT_DEVICE(state, value) {
      state.currentDevice = value
    }
  },
  actions: {
    setAllDeviceList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        _device.getAllDeviceList().then(res => {
          if (res.code === 0) {
            commit('SET_DEVICE_LIST', res.data)
            resolve(res.data)
          } else {
            return Promise.reject('error')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    setAllGroupList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        _device.getAllGroupList().then(res => {
          if (res.code === 0) {
            commit('SET_GROUP_LIST', res.data)
            resolve(res.data)
          } else {
            return Promise.reject('error')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    setLastPositions({
      commit
    }, lastQueryPositionTime) {
      return new Promise((resolve, reject) => {
        const query = {
          lastQueryPositionTime
        }
        _device.getLastPosition(query).then(res => {
          if (res.code === 0) {
            commit('SET_LAST_POSITIONS', res.data)
            resolve(res.data)
          } else {
            return Promise.reject('error')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    setCurrentDevice({
      commit
    }, currentDevice) {
      commit('SET_CURRENT_DEVICE', currentDevice)
    }
  }
}

export default device
