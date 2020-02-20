<template>
  <el-dialog :title="dialogType ==='create'?'添加设备类型':'编辑设备类型'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="产品名称">
        <el-input v-model="form.deviceDesc"></el-input>
      </el-form-item>
      <el-form-item label="产品厂商" prop="manufacturer">
        <el-input v-model.trim="form.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="产品型号" prop="device_model">
        <el-input v-model.trim="form.deviceModel"></el-input>
      </el-form-item>
      <el-form-item label="协议">
        <el-select v-model="form.protocol" placeholder="请选择协议" style="width: 100%;">
          <el-option v-for="(protocol, index) in protocolList" :key="index" :label="protocol" :value="protocol">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备号正则">
        <el-input v-model="form.reg"></el-input>
      </el-form-item>
      <el-form-item label="产品类型" prop="device_type">
        <el-radio-group v-model="form.deviceType">
          <el-radio label="0">有线</el-radio>
          <el-radio label="1">无线</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="支持命令">
        <el-input v-model.trim="form.commandType"></el-input>
      </el-form-item> -->
      <el-form-item label="支持功能" prop="functions">
        <!-- <el-checkbox-group v-model="form.functions">
          <el-checkbox label="0">录音</el-checkbox>
          <el-checkbox label="1">摄像头</el-checkbox>
        </el-checkbox-group> -->
        <el-checkbox-group v-model="form.functions">
          <el-checkbox v-for="(func, index) in Object.keys(funcsList)" :key="index" :label="func">
            {{ funcsList[func] }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSumit">{{ this.dialogType ==='create'?'添加':'更新' }}</el-button>
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
    typeInfo: {
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
      form: {
        manufacturer: '', // 厂商
        deviceModel: '', // 产品型号
        protocol: '', // 协议
        deviceType: '0', // 产品类型
        commandType: '0', // 支持命令
        functions: [], // 支持功能
        deviceDesc: '', // 描述
        reg: '' // 设备号正则
      },
      rules: {
        typename: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur',
          },
        ],
        typecode: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
          },
        ],
      },
      protocolList: [],
      funcsList: {}
    }
  },
  methods: {
    async init() {
      try {
        const protocol = await this.$api.system.getProtocol()
        this.protocolList = protocol.data
        const funcs = await this.$api.system.getAllFuncs()
        // console.log(funcs.data, '111')
        // this.funcsList = funcs.data.entries()
        this.funcsList = funcs.data
        if (this.dialogType === 'edit' && this.typeInfo) {
          this.form = {
            ...this.typeInfo,
            functions: this.typeInfo.functions || []
          }
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(this.form.functions, '111')
          var apiau
          if (this.dialogType === 'create') {
            apiau = this.$api.system.addDeviceType(this.form)
          } else {
            apiau = this.$api.system.updateDeviceType(this.form)
          }
          apiau.then((res) => {
            if (res.code === 0) {
              const action = this.dialogType === 'create' ? '添加' : '编辑'
              this.$message.success(`${action}设备类型成功！`)
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
        manufacturer: '', // 厂商
        deviceModel: '', // 产品型号
        protocol: '', // 协议
        deviceType: '0', // 产品类型
        commandType: '0', // 支持命令
        functions: [], // 支持功能
        deviceDesc: '', // 描述
        reg: '' // 设备号正则
      }
      this.$emit('close', update)
    },
  },
}
</script>