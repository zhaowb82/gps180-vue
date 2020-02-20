<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="handleAdd">新增围栏</el-button>
    </div>
    <el-table :data="fenceList" :show-header="false" empty-text="暂未配置围栏">
      <el-table-column prop="icon" align="center" width="120">
        <template slot-scope="scope">
          <i :class="scope.row.icon" style="font-size: 48px;"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <template slot-scope="scope">
          <ul>
            <li><span>{{scope.row.name}}</span></li>
            <li><span>绑定设备数：{{scope.row.deviceCount}}</span></li>
            <li><span>最后更新时间：{{scope.row.updateTime || scope.row.createTime}}</span></li>
            <li>
              <el-link size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link size="mini" type="danger" @click="handleDelete(scope.row.id, scope.row.deviceCount)">删除</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link size="mini" @click="handleDevice('bind', scope.row.id)">绑定设备</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link size="mini" @click="handleDevice('unbind', scope.row.id)">解绑设备</el-link>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <fence-map :visible="dialogVisible" :editFence="editFence" @close="handleClose"></fence-map>
    <fence-device :visible="deviceDialogVisible" :geofenceId="geofenceId" :type="deviceBindStatus" @close="handleDeviceClose"></fence-device>
  </div>
</template>

<script>
export default {
  name: 'Fences',
  components: {
    FenceMap: () => import('./Fence'),
    FenceDevice: () => import('./Device')
  },
  data() {
    return {
      fenceList: [],
      dialogVisible: false,
      deviceDialogVisible: false,
      editFence: null,
      deviceBindStatus: 'bind',
      geofenceId: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$api.device.getFenceList().then(res => {
        if (res.code === 0) {
          this.fenceList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleEdit(fence) {
      this.editFence = fence
      this.dialogVisible = true
    },
    handleDelete(id, deviceCount) {
      if (deviceCount > 0) {
        this.$message.error('绑定了设备的围栏不能删除！')
        return
      }
      this.$api.device.delFence(id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除围栏成功！')
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDevice(type, id) {
      console.log(type, id)
      this.deviceBindStatus = type
      this.geofenceId = id
      this.deviceDialogVisible = true
    },
    handleDeviceClose() {
      this.getList()
      this.deviceDialogVisible = false
    },
    handleClose() {
      this.getList()
      this.editFence = null
      this.dialogVisible = false
    }
  }
}
</script>
