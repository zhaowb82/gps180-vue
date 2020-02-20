<template>
  <el-dialog :visible="dialogVisible" width="500px" title="绑定设备列表" append-to-body @close="handleClose" destroy-on-close>
    <div style="margin-bottom: 10px;margin-top:-20px;">
      <el-button v-if="type === 'bind'" type="primary" @click="handleBind">绑定</el-button>
      <el-button v-else type="primary" @click="handleUnbind">解绑</el-button>
    </div>
    <el-table :data="list" @selection-change="handleSelect">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column label="设备名称" prop="plateNo" show-overflow-tooltip></el-table-column>
      <el-table-column label="设备号" prop="imei" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :current-page="listQuery.pageNum" @current-change="handleCurrentChange" hide-on-single-page>
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'bind'
    },
    geofenceId: {
      type: String,
      required: true
    }
  },
  watch: {
    visible(value) {
      this.dialogVisible = value
      value && this.getList()
    }
  },
  data() {
    return {
      dialogVisible: false,
      listQuery: {
        pageSize: 5,
        pageNum: 1
      },
      list: [],
      total: 0,
      selectDevices: []
    }
  },
  methods: {
    getList() {
      if (this.type === 'bind') {
        this.$api.device.getUnbindList(this.listQuery).then(res => {
          if (res.code === 0) {
            this.list = res.data.list
            this.total = res.data.totalCount
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        const listQuery = {
          ...this.listQuery,
          geoId: this.geofenceId
        }
        this.$api.device.getBindList(listQuery).then(res => {
          if (res.code === 0) {
            this.list = res.data.list
            this.total = res.data.totalCount
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    handleBind() {
      if (this.selectDevices.length === 0) {
        this.$message.error('请先选择设备！')
        return
      }
      const data = {
        imeis: this.selectDevices.map(e => (e.imei)),
        geofenceId: this.geofenceId
      }
      this.$api.device.bindFence(data).then(res => {
        if (res.code === 0) {
          this.$message.success('绑定设备成功！')
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleUnbind() {
      if (this.selectDevices.length === 0) {
        this.$message.error('请先选择设备！')
        return
      }
      const data = {
        imeis: this.selectDevices.map(e => (e.imei)),
        // geofenceId: this.geofenceId
      }
      this.$api.device.unbindFence(data).then(res => {
        if (res.code === 0) {
          this.$message.success('解除绑定成功！')
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSelect(e) {
      this.selectDevices = e
    },
    handleClose() {
      this.$emit('close')
    },
    handleCurrentChange(e) {
      this.listQuery.pageNum = e
      this.getList()
    }
  }
}
</script>

<style lang="scss">
</style>