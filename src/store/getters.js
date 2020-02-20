const getters = {
  showLoading: state => state.app.showLoading,
  loginType: state => state.user.loginType,
  userId: state => state.user.userId,
  username: state => state.user.username,
  // companyId: state => state.user.companyId,
  menuList: state => state.user.menuList,
  permissions: state => state.user.permissions,
  groupList: state => state.device.groupList,
  deviceList: state => state.device.deviceList,
  lastPositions: state => state.device.lastPositions,
  currentDevice: state => state.device.currentDevice
}
export default getters
