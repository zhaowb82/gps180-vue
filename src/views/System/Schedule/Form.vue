<template>
  <el-dialog :title="dialogType === 'save' ? '添加任务' : '编辑任务'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="bean名称" prop="beanName">
        <el-input v-model="form.beanName" placeholder="spring bean名称, 如: testTask"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="form.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="form.cronExpression" placeholder="如: 0 0 12 * * ?"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSumit">添加</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogType: {
      type: String,
      default: 'save',
    },
    jobId: {
      type: Number,
      default: null,
    },
  },
  watch: {
    dialogVisible(value) {
      value && this.init()
    },
  },
  data() {
    return {
      form: {
        jobId: null,
        beanName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0,
      },
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      rules: {
        beanName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        cronExpression: [{ required: true, message: 'cron表达式不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    async init() {
      try {
        if (this.jobId) {
          const jobInfo = await this.$api.system.getScheduleDetail(this.jobId)
          if (jobInfo && jobInfo.code === 0) {
            this.form.jobId = jobInfo.data.jobId
            this.form.beanName = jobInfo.data.beanName
            this.form.params = jobInfo.data.params
            this.form.cronExpression = jobInfo.data.cronExpression
            this.form.remark = jobInfo.data.remark
            this.form.status = jobInfo.data.status
          }
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var apiV
          if (this.dialogType === 'save') {
            apiV = this.$api.system.saveSchedule(this.form)
          } else {
            apiV = this.$api.system.updateSchedule(this.form)
          }
          apiV.then((res) => {
            if (res.code === 0) {
              const action = this.dialogType === 'save' ? '添加' : '编辑'
              this.$message.success(`${action}任务成功！`)
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleClose(update = false) {
      this.form = {
        jobId: null,
        beanName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: 0,
      }
      this.$emit('close', update)
    },
  },
}
</script>
