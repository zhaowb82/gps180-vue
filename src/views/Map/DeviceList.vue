<template>
  <div class="z-device-list">
    <div class="tabbar">
      <el-row type="flex">
        <el-col>
          <div class="click" :class="{'actived':currentTab==='all'}" @click="handleChangeTab('all')">
            <i class="el-icon-s-grid"></i>
            <div>全部({{this.deviceList.length}})</div>
          </div>
        </el-col>
        <el-col>
          <div class="click" :class="{'actived':currentTab==='online'}" @click="handleChangeTab('online')">
            <i class="el-icon-success"></i>
            <div>在线({{this.onlineNum}})</div>
          </div>
        </el-col>
        <el-col>
          <div class="click" :class="{'actived':currentTab==='offline'}" @click="handleChangeTab('offline')">
            <i class="el-icon-warning"></i>
            <div>离线({{this.offlineNum}})</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="search">
      <el-autocomplete placeholder="输入设备名称" v-model="searchDevice" :fetch-suggestions="querySearchAsync" value-key="imei" @select="handleSelectDevice" style="width: 100%;">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-autocomplete>
    </div>
    <div class="tree-list">
      <el-tree :data="filterTree" ref="deviceTree" node-key="id" highlight-current @node-click="handleSelect" accordion>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <b v-if="data.children">{{ node.label }} ({{currentTab==='all' ? (data.online+'/') : ''}}{{data.children.length}})</b>
          <div v-else class="node" :class="{'online':data.status}">
            <i class="el-icon-user-solid"></i>
            {{ node.label }}
            <el-row v-if="data.id === currentImei" :gutter="10">
              <el-col :span="6" class="col" @click.native="handleOpenDialog('device-info-form')">
                <i class="el-icon-edit-outline"></i>
                <div>编辑</div>
              </el-col>
              <el-col :span="6" class="col" @click.native="handleOpenDialog('device-travel')">
                <i class="el-icon-discover"></i>
                <div>轨迹</div>
              </el-col>
              <el-col :span="6" class="col" @click.native="handleOpenDialog('device-track')">
                <i class="el-icon-location-information"></i>
                <div>跟踪</div>
              </el-col>
              <el-col :span="6" class="col">
                <el-dropdown size="small">
                  <div>
                    <i class="el-icon-more-outline icon"></i>
                    <div class="label">
                      更多
                    </div>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-s-promotion" @click.native="handleOpenDialog('device-send-cmd')">发送指令</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-document-checked" @click.native="handleOpenDialog('device-cmd-logs')">指令记录</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-paperclip" @click.native="handleOpenDialog('device-info-window')">设备信息</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </div>
        </span>
      </el-tree>
    </div>
    <component v-if="currentDevice" :is="currentComponent" :visible="dialogVisible" :imei="currentDevice.imei" :location="location" @close="handleCloseDialog"></component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    DeviceTrack: () => import('./components/Track'),
    DeviceTravel: () => import('./components/Travel'),
    DeviceSendCmd: () => import('./components/SendCmd'),
    DeviceInfoForm: () => import('./components/InfoForm'),
    DeviceInfoWindow: () => import('./components/InfoWindow'),
    DeviceCmdLogs: () => import('./components/CmdLogs')
  },
  watch: {
    currentTab(value) {
      let tree = JSON.parse(JSON.stringify(this.tree))
      let filter = []
      if (value === 'online') {
        for (let i in tree) {
          if (tree[i].online > 0) {
            const children = tree[i].children.filter(e => e.status)
            filter.push({
              ...tree[i],
              children
            })
          }
        }
      } else if (value === 'offline') {
        for (let i in tree) {
          if (tree[i].children.length > 0) {
            const children = tree[i].children.filter(e => !e.status)
            filter.push({
              ...tree[i],
              online: 0,
              children
            })
          }
        }
      } else {
        for (let i in tree) {
          if (tree[i].online > 0) {
            for (let c in tree[i].children) {
              if (tree[i].children[c].status && c != 0) {
                tree[i].children.unshift(tree[i].children.splice(c, 1)[0])
              }
            }
          }
        }
        filter = tree
      }
      this.filterTree = filter
    },
    groupList: {
      handler(value) {
        let groupList = value.map(e => {
          return {
            id: e.id,
            label: e.name,
            online: 0,
            children: []
          }
        })
        groupList.push({
          id: '-1',
          label: '默认组',
          online: 0,
          children: []
        })
        this.treeGroups = groupList
      },
      immediate: true
    },
    deviceList: {
      handler(value) {
        let deviceList = value.map(e => {
          return {
            pId: e.groupId || '-1',
            id: e.imei,
            label: e.plateNo,
            status: false
          }
        })
        this.treeDevices = deviceList
      },
      immediate: true
    },
    lastPositions: {
      handler() {
        let groups = JSON.parse(JSON.stringify(this.treeGroups))
        let devices = JSON.parse(JSON.stringify(this.treeDevices))
        let onlineNum = 0
        groups.map(group => {
          devices.map(device => {
            if (device.pId === group.id) {
              group.children.push(device)
              const status = this.getIsOnline(device.id)
              if (status) {
                group.online++
                onlineNum++
              }
              device.status = status
            }
          })
        })
        this.tree = groups
        this.onlineNum = onlineNum
      },
      immediate: true
    },
    currentDevice(value) {
      if (value) {
        if (!this.selectOnTree && this.currentTab !== 'all') {
          this.currentTab = 'all'
        }
        this.$nextTick(() => {
          this.$refs.deviceTree.setCurrentKey(Number(value.imei), true)
          const node = this.$refs.deviceTree.getCurrentNode()
          this.$refs.deviceTree.store.nodesMap[node.pId].expanded = true
          this.currentImei = value.imei
        })
        this.selectOnTree = false
      }
    }
  },
  data() {
    return {
      currentComponent: 'device-info-form',
      dialogVisible: false,
      currentTab: '',
      searchDevice: '',
      treeGroups: [],
      treeDevices: [],
      tree: [],
      filterTree: [],
      onlineNum: 0,
      selectOnTree: false,
      currentImei: null,
      location: null
    }
  },
  mounted() {
    setTimeout(() => {
      this.currentTab = 'all'
    }, 500)
  },
  computed: {
    ...mapGetters(['deviceList', 'groupList', 'lastPositions', 'currentDevice']),
    offlineNum() {
      return this.deviceList.length - this.onlineNum
    }
  },
  methods: {
    ...mapActions(['setCurrentDevice']),
    handleChangeTab(tab) {
      this.currentTab = tab
    },
    querySearchAsync(value, callback) {
      const deviceList = this.deviceList
      const results = value ? deviceList.filter(this.createStateFilter(value)) : deviceList
      callback(results)
    },
    getIsOnline(imei) {
      let isOnline = false
      this.lastPositions.map(e => {
        if (e.imei === imei) {
          isOnline = e.connectionStatus === 'online'
        }
      })
      return isOnline
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.imei.indexOf(queryString) === 0
      }
    },
    handleOpenDialog(component) {
      this.currentComponent = component
      this.dialogVisible = true
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },
    handleSelectDevice(e) {
      this.selectOnTree = true
      const lastPosition = this.lastPositions.filter(p => p.imei === e.imei)
      lastPosition.length > 0 && (this.location = this.handleTransform(lastPosition[0].longitude, lastPosition[0].latitude))
      this.setCurrentDevice(e)
    },
    handleSelect(node) {
      if (!node.children) {
        this.selectOnTree = true
        const device = this.deviceList.filter(e => e.imei === node.id)
        const lastPosition = this.lastPositions.filter(e => e.imei === node.id)
        lastPosition.length > 0 && (this.location = this.handleTransform(lastPosition[0].longitude, lastPosition[0].latitude))
        this.setCurrentDevice(device[0])
      } else {
        this.currentImei = null
      }
    },
    handleTransform(lng, lat) {
      const location = this.$trans.wgs2bd(lng, lat)
      return {
        lng: location[0],
        lat: location[1],
      }
    }
  },
}
</script>

<style lang="scss">
.z-device-list {
  font-size: 14px;
  padding: 10px;
  .tabbar {
    padding: 10px;
    text-align: center;
    background-color: #ecf2f6;
    i {
      font-size: 24px;
    }
    .click {
      cursor: pointer;
      &.actived {
        color: #0088ef;
      }
    }
  }
  .search {
    margin: 10px auto;
  }
  .tree-list {
    height: 300px;
    // .el-tree {
    //   height: calc(100vh - 205px);
    // }
    .el-collapse {
      border-top: none;
    }
    .el-tree-node__content {
      padding-left: 0 !important;
      height: 32px;
      line-height: 28px;
      border: none !important;
    }
    .el-tree-node__children {
      .el-tree-node {
        &.is-current {
          height: 80px;
          .el-tree-node__content {
            border-radius: 5px;
            border: 1px solid rgba(37, 196, 196, 0.6) !important;
            height: 80px;
          }
        }
      }
    }
    ul {
      list-style: none;
      text-align: left;
      padding-left: 10px;
      margin: 0;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .node {
        color: #c1c1c1;
        width: 100%;
        &.online {
          color: teal;
          font-weight: bold;
        }
        .col {
          text-align: center;
          line-height: 18px;
          font-size: 12px;
          color: $--color-primary;
          i {
            font-size: 14px;
            color: $--color-primary;
          }
          .label {
            font-size: 12px;
            color: $--color-primary;
          }
        }
      }
    }
  }
}
</style>