<template>
  <el-dialog title="发送指令" :visible="dialogVisible" width="500px" @close="handleClose" append-to-body destroy-on-close>
    <div class="s_raido">
      <!-- <el-select v-model="command" placeholder="请选择" style="width: 100%;margin-bottom: 20px;">
        <el-option v-for="(cmd, index) in cmdList" :key="index" :label="cmd.cmdname" :value="cmd.cmdcode" @click.native="handleSelect(cmd)"> </el-option>
      </el-select> -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-radio-group v-model="command">
            <el-radio v-for="(cmd, index) in cmdList" :label="cmd.cmdCode" :key="index" @click.native="handleSelect(cmd)">{{cmd.cmdName}}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <div v-if="cmdDesc" style="width: 100%;">{{ cmdDesc }}</div>
          <template v-if="cmdType === 'text'">
            <el-form label-position="top">
              <el-form-item v-for="(param, index) in cmdParams" :key="index" :label="param.desc">
                <el-input v-model.trim="cmdParams[index].value"></el-input>
              </el-form-item>
            </el-form>
            <!-- <el-row v-for="(param, index) in cmdParams" :key="index" :gutter="10" style="margin-top: 20px;">
              <el-col :span="10">
                <div>{{ param.desc }}</div>
              </el-col>
              <el-col :span="14">
                <el-input v-model.trim="cmdParams[index].value"></el-input>
              </el-col>
            </el-row> -->
          </template>
          <div v-if="cmdType === 'list'" style="margin-top: 20px;">
            <!-- <el-select v-if="cmdParams" v-model="params" placeholder="请选择">
              <el-option v-for="(param, index) in cmdParams" :key="index" :label="param.desc" :value="param.value"> </el-option>
            </el-select> -->
            <el-radio-group v-if="cmdParams" v-model="params">
              <el-radio v-for="(param, index) in cmdParams" :label="param.value" :key="index">{{param.desc}}</el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button v-if="command" type="primary" :loading="btnLoading" @click="handleSendCmd">发送指令</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imei: {
      type: String,
      required: true,
    },
  },
  watch: {
    visible: {
      handler(value) {
        this.command = null
        this.params = null
        this.cmdList = []
        this.dialogVisible = value
        value && this.getAllCmd()
      },
      immediate: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      command: null,
      params: null,
      cmdList: [],
      cmdParams: null,
      cmdType: null,
      cmdDesc: null,
      btnLoading: false,
    }
  },
  methods: {
    getAllCmd() {
      const params = {
        imei: this.imei,
      }
      this.$api.device.getDeviceCmd(params).then((res) => {
        if (res.code === 0) {
          this.cmdList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSelect(e) {
      this.cmdParams = null
      this.cmdType = e.cmdType || null
      this.cmdDesc = e.cmdDescr || null
      if (e.params) {
        const paramsXMLObj = this.$extra.parseXML(e.params)
        this.cmdParams = paramsXMLObj.paramsListObj
      }
    },
    handleSendCmd() {
      const command = this.command
      if (!command) {
        return this.$message.error('请选择需要发送的指令！')
      }
      this.btnLoading = true
      let params = null
      if (this.cmdType === 'text') {
        params = this.cmdParams && this.cmdParams.map((e) => e.value)
      } else if (this.cmdType === 'list') {
        params = this.params && [this.params]
      }
      const data = {
        imei: this.imei,
        params,
        type: this.command,
      }
      this.$api.device
        .sendCommand(data)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('发送指令成功！')
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
.s_raido {
  .el-radio {
    display: block;
    margin-top: 15px;
  }
}
</style>
