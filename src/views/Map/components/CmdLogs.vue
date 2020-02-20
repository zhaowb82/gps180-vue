<template>
  <el-dialog title="指令记录" :visible="dialogVisible" width="900px" custom-class="z-tab-dialog" @close="handleClose" append-to-body destroy-on-close>
    <el-tabs slot="title" v-model="activeTab">
      <el-tab-pane label="待发送指令" name="wait">
        <el-table :data="waitList" size="small" v-loading="loading" border>
          <el-table-column label="编号" align="center" property="no" width="50">
            <span slot-scope="scope">
              {{scope.row.no}}
            </span>
          </el-table-column>
          <el-table-column property="imei" label="设备序号" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="name" label="指令名称" width="80" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="executeTime" label="发送时间" width="140" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="commandBody" label="发送参数" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column float="right" label="操作" align="center" width="60">
            <template slot-scope="scope">
              <el-link type="danger" @click="handleCancel(scope.row.id)" style="font-size: 12px;">取消</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已发送指令" name="done">
        <el-table :data="doneList" size="small" border>
          <el-table-column label="编号" align="center" prop="no" width="50">
            <span slot-scope="scope">
              {{scope.row.no}}
            </span>
          </el-table-column>
          <el-table-column property="imei" label="设备序号" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="name" label="指令名称" width="80" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="executeTime" label="发送时间" width="140" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="commandBody" label="发送参数" minWidth="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="feedbackTime" label="回复时间" width="140" show-overflow-tooltip>
            <span slot-scope="scope">
              {{scope.row.feedbackTime || '-'}}
            </span>
          </el-table-column>
          <el-table-column property="feedbackResult" label="结果" width="60" show-overflow-tooltip>
            <span slot-scope="scope">
              {{scope.row.feedbackResult?'成功':'失败'}}
            </span>
          </el-table-column>
          <el-table-column property="reason" label="原因" minWidth="80">
            <span slot-scope="scope">
              {{scope.row.reason || '-'}}
            </span>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imei: {
      type: String,
      required: true
    }
  },
  watch: {
    visible: {
      handler(value) {
        this.dialogVisible = value
        value && this.getCmdLogs()
        !value && (this.recodes = [])
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      recodes: [],
      activeTab: 'wait',
      waitList: [],
      doneList: [],
      loading: false
    }
  },
  // computed: {
  //   waitList() {
  //     const list = []
  //     // this.recodes.map(e => {
  //     //   if (!e.feedbackResult) {
  //     //     list.push(e)
  //     //   }
  //     // })
  //     return list
  //   },
  //   doneList() {
  //     const list = []
  //     // this.recodes.map(e => {
  //     //   if (e.feedbackResult) {
  //     //     list.push(e)
  //     //   }
  //     // })
  //     return list
  //   }
  // },
  methods: {
    getCmdLogs() {
      const params = {
        imei: this.imei
      }
      this.loading = true
      this.$api.device.getCmdLogs(params).then(res => {
        if (res.code === 0) {
          // console.log(res.data)
          this.loading = false
          this.recodes = res.data
          this.handleList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleList() {
      // 返回数组中为null的对象，待发送
      let waitQuery = this.recodes.filter(item => item.feedbackResult === null)
      this.waitList = waitQuery.map((e, index) => {
        if (!e.feedbackResult) {
          const body = JSON.parse(e.commandBody)
          return {
            no: index + 1,
            id: e.id,
            imei: e.imei,
            name: body.attributes.name,
            executeTime: e.executeTime,
            commandBody: e.commandBody,
            feedbackTime: e.feedbackTime,
            feedbackResult: e.feedbackResult,
            reason: e.reason
          }
        }
      })
      // 返回数组中为true的对象，已完成发送
      let doneQuery = this.recodes.filter(item => item.feedbackResult === true)
      this.doneList = doneQuery.map((e, index) => {
        if (e.feedbackResult) {
          const body = JSON.parse(e.commandBody)
          return {
            no: index + 1,
            id: e.id,
            imei: e.imei,
            name: body.attributes.name,
            executeTime: e.executeTime,
            commandBody: e.commandBody,
            feedbackTime: e.feedbackTime,
            feedbackResult: e.feedbackResult,
            reason: e.reason
          }
        }
      })
      // console.log(this.waitList, this.doneList)
    },
    handleCancel(cmdid) {
      const params = {
        cmdid
      }
      this.$api.device.cancelCommand(params).then(res => {
        if (res.code === 0) {
          this.$message.success('成功删除该指令！')
          this.handleClose()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.z-tab-dialog {
  .el-dialog__body {
    padding: 0 20px 20px;
  }
}
</style>