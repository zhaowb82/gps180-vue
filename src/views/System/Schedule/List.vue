<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="请输入角色名称查询" v-model="listQuery.beanName" style="width: 260px;float:right;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.beanName)"></el-button>
      </el-input>
      <el-button v-if="isAuth('sys:schedule:save')" type="primary" @click="handleCreate">新增</el-button>
      <el-button v-if="isAuth('sys:schedule:delete')" type="danger" @click="deleteHandle()" :disabled="listSelections.length <= 0">批量删除</el-button>
      <el-button v-if="isAuth('sys:schedule:pause')" type="danger" @click="pauseHandle()" :disabled="listSelections.length <= 0">批量暂停</el-button>
      <el-button v-if="isAuth('sys:schedule:resume')" type="danger" @click="resumeHandle()" :disabled="listSelections.length <= 0">批量恢复</el-button>
      <el-button v-if="isAuth('sys:schedule:run')" type="danger" @click="runHandle()" :disabled="listSelections.length <= 0">批量立即执行</el-button>
      <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="logHandle()">日志列表</el-button>
    </div>
    <el-table :data="list" border v-loading="listLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"> </el-table-column>
      <el-table-column prop="jobId" width="80" label="ID"> </el-table-column>
      <el-table-column prop="beanName" label="bean名称"> </el-table-column>
      <el-table-column prop="params" label="参数"> </el-table-column>
      <el-table-column prop="cronExpression" label="cron表达式"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">暂停</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="280" label="操作">
        <template slot-scope="scope">
          <el-link v-if="isAuth('sys:schedule:update')" type="primary" @click="handleEdit(scope.row.jobId)">修改</el-link>
          <el-divider v-if="isAuth('sys:schedule:update')" direction="vertical"></el-divider>
          <el-link v-if="isAuth('sys:schedule:delete')" type="danger" @click="deleteHandle(scope.row.jobId)">删除</el-link>
          <el-divider v-if="isAuth('sys:schedule:delete')" direction="vertical"></el-divider>
          <el-link v-if="isAuth('sys:schedule:pause')" type="warning" @click="pauseHandle(scope.row.jobId)">暂停</el-link>
          <el-divider v-if="isAuth('sys:schedule:pause')" direction="vertical"></el-divider>
          <el-link v-if="isAuth('sys:schedule:resume')" type="primary" @click="resumeHandle(scope.row.jobId)">恢复</el-link>
          <el-divider v-if="isAuth('sys:schedule:resume')" direction="vertical"></el-divider>
          <el-link v-if="isAuth('sys:schedule:run')" type="success" @click="runHandle(scope.row.jobId)">立即执行</el-link>
        </template>
      </el-table-column>
    </el-table>
    <schedule-form :dialogVisible="dialogVisible" :dialogType="dialogType" :jobId="currentId" @close="handleClose"></schedule-form>
  </el-card>
</template>

<script>
export default {
  components: {
    ScheduleForm: () => import('./Form'),
  },
  mounted() {
    this.getList()
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        beanName: '',
      },
      listLoading: false,
      listSelections: [],
      dialogVisible: false,
      dialogType: 'save',
      currentId: null,
    }
  },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.$api.system
        .getScheduleList(this.listQuery)
        .then((res) => {
          if (res && res.code === 0) {
            this.list = res.data.list
            this.total = res.data.totalCount
          } else {
            this.list = []
            this.total = 0
          }
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.listSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle() {
      this.dialogVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
    },
    // 删除
    deleteHandle(id) {
      const data = {
        jobIds: id
          ? [id]
          : this.listSelections.map((item) => {
              return item.roleId
            }),
      }
      this.$confirm(`确定对[id=${data.jobIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.system.deleteSchedule(data.jobIds).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('删除任务成功！')
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 暂停
    pauseHandle(id) {
      var ids = id
        ? [id]
        : this.listSelections.map((item) => {
            return item.jobId
          })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/pause'),
            method: 'post',
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                },
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 恢复
    resumeHandle(id) {
      var ids = id
        ? [id]
        : this.listSelections.map((item) => {
            return item.jobId
          })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/resume'),
            method: 'post',
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                },
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 立即执行
    runHandle(id) {
      var ids = id
        ? [id]
        : this.listSelections.map((item) => {
            return item.jobId
          })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/run'),
            method: 'post',
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                },
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 日志列表
    logHandle() {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    },
    handleCreate() {
      this.dialogType = 'save'
      this.dialogVisible = true
    },
    handleEdit(id) {
      this.dialogType = 'update'
      this.currentId = id
      this.dialogVisible = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(id) {
      console.log(id)
    },
    handleClose(update) {
      this.dialogVisible = false
      this.currentId = null
      update && this.getList()
    },
  },
}
</script>

<style></style>
