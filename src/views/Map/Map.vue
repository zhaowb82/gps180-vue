<template>
  <div>
    <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" :scroll-wheel-zoom="true" class="bm-view">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> -->
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="(marker, index) of markers" :key="index" :icon="iconObj[marker.connectionStatus]" :rotation="marker.direction" :position="handleTransform(marker.longitude, marker.latitude)" @click="handleClick(marker)">
          <bm-label :content="marker.imei" />
          <!-- :labelStyle="{ color: '#ffffff', fontSize: '13px', backgroundColor: '#0088ef', border: 'none' }"  -->
        </bm-marker>
      </bml-marker-clusterer>
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
      <bm-info-window :position="infoWindowPosition" title="设备信息" :width="350" :show="infoWindow.show" autoPan @close="infoWindowClose" @open="infoWindowOpen">
        <div class="info-window">
          <ul>
            <li>设备名称: {{ currentDevice && currentDevice.plateNo }}</li>
            <li>设备序号: {{ deviceInfo.imei }}</li>
            <li>定位类型: {{ switchPositionType(deviceInfo.gotsrc) }}</li>
            <li>经纬度: {{ deviceInfo.longitude }},{{ deviceInfo.latitude }}</li>
            <li>更新时间: {{ deviceInfo.signalUpdateTime }} ({{ deviceInfo.connectionStatus }})</li>
            <li>定位时间: {{ deviceInfo.positionUpdateTime }}</li>
            <li>速度: {{ deviceInfo.speed === 0 ? '0km/h' : handleSpeed(deviceInfo.speed) }}</li>
            <li>总里程: {{ handleMileage(deviceInfo.totalDistance) }}</li>
            <li>状态: {{ deviceInfo.gotsrc }}</li>
            <li>详细地址: {{ deviceAddress }}</li>
          </ul>
          <div>
            <el-button size="small" @click="handleOperate('device-travel')">轨迹</el-button>
            <el-button size="small" @click="handleOperate('device-track')">跟踪</el-button>
            <el-button size="small" @click="handleRefresh(deviceInfo.imei)">刷新</el-button>
            <el-button size="small" @click="handleOperate('device-send-cmd')">发送指令</el-button>
            <el-button size="small" @click="handleOperate('device-info-form')">编辑</el-button>
            <el-button size="small" @click="handleOperate('device-info-window')" style="margin: 10px 0 0 0;">设备基本信息</el-button>
            <el-button size="small" @click="handleOperate('device-cmd-logs')" style="margin-top: 10px;">指令记录</el-button>
            <!-- <el-button size="small" @click="handleOperate('设置围栏', 'device-fence')">围栏</el-button> -->
          </div>
        </div>
        <!-- <button @click="clear">Clear</button> -->
      </bm-info-window>
      <bm-circle v-if="circleInfo" :center="circleInfo.center" :radius="circleInfo.radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-circle>
      <bm-polygon v-if="polygonPath.length>0" :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" />
    </baidu-map>
    <el-dialog custom-class="alarm-dialog" :visible.sync="dialogVisible" :fullscreen="fullscreen">
      <button type="button" class="el-dialog__headerbtn" style="margin-right: 30px;" @click="handleDialogFullscreen"><i class="el-dialog__close el-icon" :class="fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'"></i></button>
      <el-tabs slot="title" v-model="alarmType" @tab-click="handleSelectAlarm">
        <el-tab-pane label="设备报警消息" name="alarmWarning">
          <el-table :data="alarmWarning.list" border>
            <el-table-column type="index" align="center" fixed="left" width="50" label="序号"></el-table-column>
            <el-table-column prop="imei" fixed="left" label="设备名称" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="occurTime" label="报警时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="报警消息" show-overflow-tooltip>
              <span slot-scope="scope">{{switchAlarmType(scope.row.type)}}</span>
            </el-table-column>
            <el-table-column prop="occurNum" label="报警次数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="processStatus" label="是否处理" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleAlarmWarning(scope.row)">处理</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="danger" @click="handleDeleteAlarmWarning(scope.row.id, scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="z-table-footer">
            <el-pagination class="pagination" @current-change="handleCurrentChange($event, 'alarmWarning')" :current-page="alarmWarning.pageNum" :page-sizes="[10, 20, 30, 50, 100]" :page-size="alarmWarning.pageSize" layout="total, prev, pager, next" :total="alarmWarning.total" background hide-on-single-page></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备事件信息" name="alarmMessage">
          <el-table :data="alarmMessage.list" border>
            <el-table-column type="index" align="center" fixed="left" width="50" label="序号"></el-table-column>
            <el-table-column prop="imei" fixed="left" label="设备名称" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="occurTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="事件内容" show-overflow-tooltip>
              <span slot-scope="scope">{{switchEventType(scope.row.type)}}</span>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="50">
              <template slot-scope="scope">
                <el-link type="danger" @click="handleDeleteAlarmMessage(scope.row.id, scope.$index)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="z-table-footer">
            <el-pagination class="pagination" @current-change="handleCurrentChange($event, 'alarmMessage')" :current-page="alarmMessage.pageNum" :page-sizes="[10, 20, 30, 50, 100]" :page-size="alarmMessage.pageSize" layout="total, prev, pager, next" :total="alarmMessage.total" background hide-on-single-page></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <transition name="fade" mode="out-in" appear>
      <el-button v-show="!dialogVisible" class="message-box" circle @click="handleDialogOpen">
        <el-badge class="blink" is-dot :value="12">
          <i class="el-icon-message"></i>
        </el-badge>
      </el-button>
    </transition>
    <div class="map-toolbar">
      <el-button type="primary" style="margin-right: 6px" @click="setFenceDialog = true">围栏设置</el-button>
      <el-select v-model="geofenceId" style="width: 160px" @focus="getFenceList">
        <el-option label="不显示围栏" :value="-1" :key="-1" @click.native="handleSelectFence(null)"></el-option>
        <template v-for="item in geofence">
          <el-option :label="item.name" :value="item.id" :key="item.id" @click.native="handleSelectFence(item)"></el-option>
        </template>
      </el-select>
    </div>
    <el-dialog title="围栏设置" :visible.sync="setFenceDialog" custom-class="z-fence-dialog" width="500px" destroy-on-close>
      <set-fences></set-fences>
    </el-dialog>
    <component :is="currentComponent" :visible="operateDialogVisible" :imei="deviceInfo.imei" :location="infoWindowPosition" @close="operateDialogVisible = false"></component>
  </div>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'
import zSwitch from '@/mixins/switch'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [zSwitch],
  watch: {
    deviceList: {
      handler(value) {
        if (value.length > 0) {
          this.setLastPositions(this.lstQueryTime)
          this.lstQueryTime = this.$datetime.UTC()
          this.getAlarmMessage()
          this.getAlarmWarning()
          this.handlePositionTiming()
          this.handleAlarmTiming()
        }
      },
      immediate: true
    },
    currentDevice(value) {
      if (value) {
        let center = null
        let device = null
        this.lastPositions.map((e) => {
          if (e.imei === value.imei) {
            center = this.handleTransform(e.longitude, e.latitude)
            device = e
          }
        })
        if (center) {
          this.center = center
          this.zoom = 19
          this.handleClick(device)
        } else {
          this.$message.error('该设备没有上报位置信息。')
        }
      }
    },
    operateDialogVisible(value) {
      if (!value) {
        this.currentComponent = null
      }
    }
  },
  components: {
    BmlMarkerClusterer,
    SetFences: () => import('./Fences'),
    DeviceFence: () => import('./components/Fence'),
    DeviceTrack: () => import('./components/Track'),
    DeviceTravel: () => import('./components/Travel'),
    DeviceSendCmd: () => import('./components/SendCmd'),
    DeviceInfoForm: () => import('./components/InfoForm'),
    DeviceInfoWindow: () => import('./components/InfoWindow'),
    DeviceCmdLogs: () => import('./components/CmdLogs')
  },
  computed: {
    ...mapGetters(['deviceList', 'lastPositions', 'currentDevice', 'username']),
    markers() {
      let markers = this.lastPositions
      return markers
    },
  },
  data() {
    return {
      currentComponent: 'device-fence',
      componentTitle: '设置围栏',
      operateDialogVisible: false,
      geofenceId: '',
      setFenceDialog: false,
      lstQueryTime: 0,
      // lastPositions: [],
      alarmType: 'alarmWarning',
      alarmMessage: {
        list: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      alarmWarning: {
        list: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      fullscreen: false,
      alarmTimer: null,
      positionTimer: null,
      dialogVisible: false,
      center: '中国',
      // center: { lng: 115, lat: 34 },
      zoom: 5,
      deviceInfo: {
        imei: '',
        longitude: 0,
        latitude: 0,
        speed: 0,
        direction: 0,
        totalDistance: 0,
        gotsrc: 'gps',
        connectionStatus: 'offline',
        positionUpdateTime: '',
        signalUpdateTime: '',
        geofenceIds: null,
        geofenceStatus: null,
        blockStatus: 0,
        alarmStatus: 1,
        reportFrequency: null,
        attribute: null,
        orgMsg: null,
      },
      deviceAddress: '',
      iconObj: {
        online: {
          url: require('@/assets/images/car/car_blue.png'),
          size: {
            width: 20,
            height: 36,
          },
        },
        offline: {
          url: require('@/assets/images/car/car_gray.png'),
          size: {
            width: 20,
            height: 36,
          },
        }
      },
      infoWindow: {
        show: false,
        contents: '设备信息',
      },
      infoWindowPosition: null,
      mapStyle: {
        styleJson: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: {
              lightness: 10,
              saturation: -100,
            },
          },
        ],
      },
      geofence: [],
      circleInfo: null,
      polygonPath: []
    }
  },
  mounted() {
    // const wsHost = process.env.NODE_ENV === 'production' ? '' : 'ws://wibim.vicp.net:8089'
    const wsHost = 'ws://192.168.1.112:8085'
    // const wsHost = 'ws://wibim.vicp.net:8089'
    this.initWebsocket(wsHost)
  },
  destroyed() {
    clearInterval(this.alarmTimer)
    clearInterval(this.positionTimer)
  },
  methods: {
    ...mapActions(['setLastPositions', 'setCurrentDevice']),
    handler({ map }) {
      this.map = map
    },
    getFenceList() {
      this.$api.device.getFenceList().then(res => {
        if (res.code === 0) {
          this.geofence = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getAlarmMessage(time = this.$datetime.UTC()) {
      const query = {
        lastqueryallmsgtime: time,
        pageSize: this.alarmMessage.pageSize,
        pageNum: this.alarmMessage.pageNum
      }
      this.$api.device.getAlarmMessage(query).then((res) => {
        this.alarmMessage.list = res.data.list
        this.alarmMessage.total = res.data.totalCount
      })
    },
    getAlarmWarning(time = this.$datetime.UTC()) {
      const query = {
        lastqueryallalarmtime: time,
        pageSize: this.alarmWarning.pageSize,
        pageNum: this.alarmWarning.pageNum
      }
      this.$api.device.getAlarmWarning(query).then((res) => {
        this.alarmWarning.list = res.data.list
        this.alarmWarning.total = res.data.totalCount
      })
    },
    handleAlarmTiming() {
      this.alarmTimer = setInterval(() => {
        this.getAlarmMessage()
        this.getAlarmWarning()
      }, 30000)
    },
    handleAlarmWarning(e) {
      const data = {
        imei: e.imei,
        params: null,
        type: 'TYPE_SERVER_DIS_ALARM',
        attributes: {
          alarmId: e.id,
          remark: '11'
        }
      }
      this.$api.device.sendCommand(data).then(res => {
        if (res.code === 0) {
          this.$message.success('处理成功！')
          this.getAlarmWarning()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDeleteAlarmWarning(id) {
      const params = {
        alarmId: id
      }
      this.$api.device.deleteAlarmWarning(params).then(res => {
        if (res.code === 0) {
          this.$message.success('删除报警消息成功！')
          this.getAlarmWarning()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDeleteAlarmMessage(id, index) {
      const params = {
        evtId: id
      }
      this.$api.device.deleteMessage(params).then(res => {
        if (res.code === 0) {
          this.alarmMessage.list.splice(index, 1)
          this.alarmMessage.total--
          this.$message.success('删除成功！')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handlePositionTiming() {
      this.positionTimer = setInterval(() => {
        this.setLastPositions(this.lstQueryTime)
        this.lstQueryTime = this.$datetime.UTC()
      }, 15000)
    },
    async handleClick(e) {
      this.deviceInfo = e
      const location = await this.$trans.wgs2bd(e.longitude, e.latitude)
      this.deviceAddress = await this.$trans.bd2address(location[0], location[1])
      this.infoWindowPosition = {
        lng: location[0],
        lat: location[1],
      }
      const device = this.deviceList.filter(d => d.imei === e.imei)
      this.setCurrentDevice(device[0])
      this.infoWindow.show = true
    },
    handleSpeed(speed) {
      return (speed / 0.539957).toFixed(2) + 'km/h'
    },
    handleMileage(totaldistance) {
      if (totaldistance == 0) {
        return totaldistance + 'km'
      }
      return ((totaldistance * 1.0) / 1000).toFixed(3) + 'km'
    },
    handleTransform(lng, lat) {
      const location = this.$trans.wgs2bd(lng, lat)
      return {
        lng: location[0],
        lat: location[1],
      }
    },
    handleSelectAlarm(type, event) {
      console.log(type, event)
    },
    handleSelectFence(data) {
      this.map.clearOverlays()
      if (data) {
        const area = this.areaFomart(data.area)
        if (area.type === 'CIRCLE') {
          this.circleInfo = {
            center: area.path[0],
            radius: Number(area.path[1])
          }
          this.center = area.path[0]
          this.zoom = 12
        }
        if (area.type === 'POLYGON') {
          this.polygonPath = area.path
          const center = this.getCenterPoint(area.path)
          this.center = center
          this.zoom = 12
        }
      } else {
        this.center = '中国'
        this.zoom = 5
      }
    },
    // 围栏数据转换
    areaFomart(area) {
      // eslint-disable-next-line
      const point = area.match(/[^\(\)]+(?=\))/g)[0].split(', ')
      if (area.match('CIRCLE')) {
        const p = this.$trans.wgs2bd(point[0].split(' ')[1], point[0].split(' ')[0])
        return {
          type: 'CIRCLE',
          path: [{ lng: p[0], lat: p[1] }, point[1]]
        }
      }
      if (area.match('POLYGON')) {
        const path = []
        point.forEach(item => {
          const p = this.$trans.wgs2bd(item.split(' ')[1], item.split(' ')[0])
          path.push({ lng: p[0], lat: p[1] })
        })
        return {
          type: 'POLYGON',
          path: path
        }
      }
    },

    getCenterPoint(path) {
      let lng = 0.0
      let lat = 0.0

      for (let i = 0; i < path.length; i++) {
        lng = lng + parseFloat(path[i].lng)
        lat = lat + parseFloat(path[i].lat)
      }
      lng = lng / path.length
      lat = lat / path.length
      return { lng, lat }
    },
    handleOperate(component) {
      this.currentComponent = component
      this.operateDialogVisible = true
    },
    infoWindowClose() {
      this.infoWindow.show = false
    },
    infoWindowOpen() {
      this.infoWindow.show = true
    },
    handleDialogOpen() {
      this.dialogVisible = true
    },
    handleDialogFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    initWebsocket(wsHost) {
      this.$ws(wsHost + '/api/websocket', this.username, this.handleWsCallback)
    },
    handleWsCallback(resp) {
      console.log(resp, 'resp')
      var action = resp.messageType
      if (action === 'TYPE_EVENTS') {
        var data = resp.event
        // communicate.$emit('remindmsg', data);
        this.$Notice.open({
          title: '事件通知',
          desc: data.imei + ':' + data.type
        })
      } else if (action === 'TYPE_RESULTS') {
        let data = resp.commandResult
        // this.$Message.success('Command:' + data.result + ' ' + data.reason)
        if (data.result) {
          var res = '成功'
          if (data.resultObject) {
            // var j = JSON.parse(data.resultObject)
            var j = JSON.stringify(data.resultObject)
            res += '\n'
            res += (j)
          }
          this.$Notice.success({
            title: '命令发送结果',
            desc: res,
            duration: 0
          })
        } else {
          this.$Notice.error({
            title: '命令发送失败',
            desc: '原因：'+ data.reason,
            duration: 0
          })
        }
      } else if (action === 'TYPE_POSITIONS') {
        // var pos = resp.position
        // // var pos1= utils.convertPos(pos)
        // // communicate.$emit('positionlast', pos1)
        // var imei = pos.imei
        // data.devicename = this.deviceInfos[imei] ? this.deviceInfos[imei].plateNo : ''
        // me.positionLastrecords[imei] = pos
        // //console.log("handleWebSocket"+JSON.stringify(pos))
        // me.updateTreeOnlineState()
        // me.updateDevLastPosition(pos)
        // // console.log('轨迹push', imei, DateFormat.longToDateTimeStr(data.updatetime, 0));
        // if (this.currentDeviceId == imei) {
        //     this.map && this.map.updateSingleMarkerState(imei)
        // }
      // } else if (action === 'reminddevicemsg') {
      //   var data = resp.devicemsg;
      //   communicate.$emit('reminddevicemsg', data);
      } else if (action == 'reminddevicemedia') {
        var devicemediatemp = resp.devicemedia
        this.addPushMediaToLocalStore(devicemediatemp)
      }
    },
    handleCurrentChange(e, type) {
      this[type].pageNum = e
      if (type === 'alarmMessage') {
        this.getAlarmMessage()
      } else if (type === 'alarmWarning') {
        this.getAlarmWarning()
      }
    },
    handleRefresh(imei) {
      this.$api.device.getDeviceInfo(imei).then(res => {
        if (res.code === 0) {
          this.deviceInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    switchAlarmType(type) {
      switch (type) {
        case 'dismantle':
          return '拆除报警'
        case 'vibration':
          return '震动报警'
        case 'lightOn':
          return '感光报警'
        case 'dismantal':
          return '掉电报警'

        default:
          return '其它报警'
      }
    },
    switchEventType(type) {
      switch (type) {
        case 'deviceOnline':
          return '上线'
        case 'deviceOffline':
          return '离线'
        case 'deviceMoving':
          return '运动'
        case 'deviceStopped':
          return '静止'
        case 'ignitionOn':
          return 'Acc开'
        case 'ignitionOff':
          return 'Acc关'

        default:
          return type
      }
    },
  },
}
</script>

<style lang="scss">
.BMap_cpyCtrl {
  visibility: hidden !important;
}
.anchorBL {
  bottom: 0 !important;
}
.bm-view {
  width: 100%;
  height: calc(100vh - 60px);
  .info-window {
    font-size: 14px;
    ul {
      list-style: none;
      padding-left: 0;
    }
  }
}
.alarm-dialog {
  .el-dialog__body {
    padding: 0 20px 30px;
  }
}
.message-box {
  position: absolute;
  bottom: 5px;
  right: 300px;
}
.map-toolbar {
  position: absolute;
  bottom: 7px;
  right: 20px;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 定义blink类*/
.blink {
  color: teal;
  font-size: 18px;
  font-weight: bold;
  animation: blink 1s linear infinite;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 1s linear infinite;
  -moz-animation: blink 1s linear infinite;
  -ms-animation: blink 1s linear infinite;
  -o-animation: blink 1s linear infinite;
}
.z-fence-dialog {
  .el-dialog__body {
    padding: 10px 20px 30px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
}
.z-map-dialog {
  .el-dialog__header {
    padding: 20px;
  }
  .el-dialog__body {
    padding: 0;
    .map-area {
      box-shadow: inset 5em 1em #000000;
      position: relative;
      .tool-window {
        width: 200px;
        position: absolute;
        bottom: 20px;
        right: 20px;
        .button {
          font-size: 20px;
        }
        .step {
          font-size: 16px;
          padding-top: 13px;
        }
      }
    }
  }
  .dialog-map-view {
    width: 100%;
    height: 70vh;
    &.map-full {
      height: calc(100vh - 65px);
    }
  }
}
</style>
