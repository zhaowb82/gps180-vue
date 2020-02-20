<template>
  <el-dialog :title="dialogType ==='create'?'添加指令':'编辑指令'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 100%;">
          <el-option v-for="(type, index) in deviceTypeList" :key="index" :label="type.deviceDesc" :value="type.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指令类型" prop="cmdCodeName">
        <el-select v-model="form.cmdCodeName" placeholder="请选择指令类型" style="width: 100%;">
          <el-option v-for="(type, index) in commandTypeList" :key="index" :label="type.cmdName" :value="type.cmdCode" @click.native="handleSelectCommandType(type)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指令名称">
        <el-input v-model.trim="form.cmdName"></el-input>
      </el-form-item>
      <el-form-item label="是否同步" prop="sync">
        <el-switch v-model="form.sync"></el-switch>
      </el-form-item>
      <el-form-item label="指令描述">
        <el-input v-model.trim="form.cmdDescr"></el-input>
      </el-form-item>
      <el-form-item label="指令密码">
        <el-input v-model.trim="form.cmdPwd"></el-input>
      </el-form-item>
      <el-form-item label="参数类型">
        <el-select v-model="form.cmdType" placeholder="请选择参数类型" style="width: 100%;">
          <el-option label="文本输入" value="text"></el-option>
          <el-option label="下拉选择" value="list"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数">
        <el-input v-model="form.params" type="textarea"></el-input>
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
      default: 'create',
    },
    commandInfo: {
      type: Object,
      default: () => {
        return null
      },
    },
  },
  watch: {
    dialogVisible(value) {
      value && this.init()
    },
  },
  data() {
    return {
      deviceTypeList: [],
      commandTypeList: [],
      form: {
        cmdCodeName: '',
        deviceType: '',
        cmdName: '',
        cmdCode: '',
        sync: false,
        cmdDescr: '',
        cmdPwd: '',
        cmdType: 'text',
        params: '',
      },
      rules: {
        deviceType: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
        cmdCodeName: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
        sync: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    async init() {
      try {
        const deviceType = await this.$api.system.getProductByUser()
        const commandType = await this.$api.system.getCommandType()
        this.deviceTypeList = deviceType.data
        this.commandTypeList = commandType.data
        if (this.dialogType === 'edit' && this.commandInfo) {
          this.form = this.commandInfo
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSelectCommandType(e) {
      const form = {
        ...this.form,
        cmdCode: e.cmdCode,
        cmdName: e.cmdName,
        sync: e.sync,
        cmdDescr: e.cmdDescr,
        cmdPwd: e.cmdPwd,
        params: e.params,
        cmdType: e.cmdType,
      }
      this.form = form
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = {
            deviceType: this.form.deviceType,
            cmdCode: this.form.cmdCode,
            cmdName: this.form.cmdName,
            sync: this.form.sync ? 1 : 0,
            cmdPwd: this.form.cmdPwd,
          }

          if (this.form.cmdDescr) {
            data.cmdDescr = this.form.cmdDescr
          }

          if (this.form.params) {
            data.params = this.form.params
          }

          if (this.form.cmdType) {
            data.cmdType = this.form.cmdType
          }

          this.$api.system.addCommand(data).then((res) => {
            if (res.code === 0) {
              this.$message.success('添加命令成功！')
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleClose(update = false) {
      this.deviceTypeList = []
      this.commandTypeList = []
      this.cmdCodeName = ''
      this.form = {
        deviceType: '',
        cmdName: '',
        cmdCode: '',
        sync: false,
        cmdDescr: '',
        cmdPwd: '',
        cmdType: 'text',
        params: '',
      }
      this.$emit('close', update)
    },
  },
}
</script>