<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="z-table-control">
          <el-button type="primary" @click="handleCreateGroup">添加分组</el-button>
        </div>
        <el-table :data="groupList" :show-header="false" @row-click="handleSelectRow" :highlight-current-row="true">
          <el-table-column prop="name"> </el-table-column>
          <el-table-column fixed="right" width="100px">
            <template slot-scope="scope">
              <el-link type="primary" @click.native.stop="handleUpdateGroup(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click.native.stop="handleDeleteGroup(scope.row.id)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18">
        <div class="z-table-control">
          <el-input placeholder="请输入设备序号查询" v-model="listQuery.imei" style="width: 260px;float:right;">
            <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
          </el-input>
          <el-button type="primary" @click="handleCreateDevice">添加设备</el-button>
          <!-- <el-button type="primary" @click="handleCreateDevice('multiple-device-form')">批量添加设备</el-button> -->
          <el-button @click="handleAllDevice">全部设备</el-button>
          <!-- <el-button @click="handleNoGroupDevice">默认组设备</el-button> -->
        </div>
        <!-- deviceList.slice((listQuery.pageNum - 1) * listQuery.pageSize, listQuery.pageNum * listQuery.pageSize) ||  -->
        <el-table :data="deviceList" v-loading.body="listLoading" border @sort-change='sortChangeHandle'>
          <el-table-column prop="plateNo" label="设备名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="imei" label="设备序号" sortable='custom' show-overflow-tooltip> </el-table-column>
          <el-table-column prop="protocol" label="通信协议" sortable='custom' show-overflow-tooltip> </el-table-column>
          <el-table-column prop="crtTime" label="添加时间" sortable='custom' show-overflow-tooltip> </el-table-column>
          <el-table-column prop="simEndDate" label="到期时间" sortable='custom' show-overflow-tooltip> </el-table-column>
          <!-- <el-table-column prop="companyId" label="所属客户" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="groupId" label="所属分组" show-overflow-tooltip> </el-table-column> -->
          <el-table-column label="操作" fixed="right" width="170px">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleUpdateDevice(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="handleDeleteDevice(scope.row.imei)">删除</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link :disabled="!scope.row.canLogin" :type="scope.row.canLogin ? 'success' : 'info'" @click="handleResetPwd(scope.row.imei)">重置密码</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="z-table-footer">
          <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listQuery.pageSize" layout="total, prev, pager, next" :total="total" background hide-on-single-page>
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <device-form :visible="dialogVisible" :dialogGroupId="dialogGroupId" :dialogDeptId="dialogDeptId" :dialogType="dialogType" :device="currentDevice" @close="handleClose"></device-form>
    <group-form :visible="dialogGroupVisible" :dialogType="dialogGroupType" :group="currentGroup" @close="handleGroupClose"></group-form>
  </el-card>
</template>

<script>
export default {
  mounted() {
    this.getDeviceList()
    this.getGroupList()
  },
  components: {
    DeviceForm: () => import('./DeviceForm'),
    GroupForm: () => import('./GroupForm')
  },
  data() {
    return {
      deviceList: [],
      groupList: [],
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        sort: null,
        order: null,
        imei: null,
        groupId: null,
      },
      total: 0,
      listLoading: false,

      dialogDeptId: null,
      dialogGroupId: null,
      dialogVisible: false,
      dialogType: 'save',
      currentDevice: null,

      dialogGroupVisible: false,
      dialogGroupType: 'save',
      currentGroup: null,
    }
  },
  methods: {
    getDeviceList() {
      this.listLoading = true
      this.$api.device.getDevices(this.listQuery)
        .then((res) => {
          if (res.code === 0) {
            this.deviceList = res.data.list
            this.total = res.data.totalCount
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    getGroupList() {
      this.$api.manage.getAllGroups().then((res) => {
        if (res.code === 0) {
          this.groupList = res.data
          this.groupList.unshift({
            id: '-1',
            name: '默认分组'
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleResetPwd(imei) {
      this.$api.device.resetDevicePwd({ imei }).then((res) => {
        if (res.code === 0) {
          this.$message.success('新设备密码：' + res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    sortChangeHandle(column) {
      var prop = column.prop
      var order = column.order === 'descending' ? 'DESC' : 'ASC'
      this.listQuery.sort = prop
      this.listQuery.order = order
      this.handleFilter()
    },
    handleDeleteDevice(imei) {
      this.$confirm('此操作将' + imei + '删除', '是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          imei,
        }
        this.$api.device.deleteDevice(params).then((res) => {
          if (res.code === 0) {
            this.$message.success('删除设备成功！')
            this.getDeviceList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    handleDeleteGroup(id) {
      this.$api.manage.deleteGroup(id).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除分组成功！')
          this.getGroupList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAllDevice() {
      this.listQuery.groupId = null
      this.handleFilter()
    },
    // handleNoGroupDevice() {
    //   this.listQuery.groupId = 'null'
    //   this.handleFilter()
    // },
    handleSelectRow(row) {
      this.listQuery.groupId = row.id === '-1' ? 'null' : row.id
      this.handleFilter()
    },
    handleCurrentChange(e) {
      this.listQuery.pageNum = e
      this.getDeviceList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getDeviceList()
    },
    handleCreateDevice() {
      const gid = this.listQuery.groupId
      const group = this.groupList.find((n) => gid && gid != 'null' && n.id === gid)
      this.dialogDeptId = group ? group.deptId + '' : null
      this.dialogGroupId = gid
      this.dialogType = 'save'
      this.dialogVisible = true
    },
    handleUpdateDevice(device) {
      this.dialogGroupId = null
      this.dialogType = 'update'
      this.currentDevice = device
      this.dialogVisible = true
    },
    handleClose(update) {
      this.dialogVisible = false
      this.currentDevice = null
      update && this.getDeviceList()
    },
    handleCreateGroup() {
      this.dialogGroupType = 'save'
      this.dialogGroupVisible = true
    },
    handleUpdateGroup(group) {
      this.dialogGroupType = 'update'
      this.dialogGroupVisible = true
      setTimeout(() => {
        this.currentGroup = group
      }, 200)
    },
    handleGroupClose(update) {
      this.dialogGroupVisible = false
      this.currentGroup = null
      update && this.getGroupList()
    },
  },
}
</script>

<style></style>
