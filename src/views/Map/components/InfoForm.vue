<template>
  <el-dialog title="编辑设备" :visible="dialogVisible" width="300px" @close="handleClose" append-to-body destroy-on-close>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="设备名称">
        <el-input v-model.trim="form.plateNo"></el-input>
      </el-form-item>
      <el-form-item label="设备序号">
        <el-input disabled v-model.trim="form.imei"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
        value && this.getDeviceDetail()
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        imei: '',
        plateNo: '',
        remark: null
      }
    }
  },
  computed: {
    ...mapGetters(['currentDevice'])
  },
  methods: {
    ...mapActions(['setAllDeviceList', 'setCurrentDevice']),
    getDeviceDetail() {
      this.$api.device.getDeviceDetail(this.imei).then(res => {
        if (res.code === 0) {
          this.form = {
            imei: this.imei,
            plateNo: res.data.plateNo,
            remark: res.data.remark
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit() {
      this.$api.device.saveDeviceDetail(this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('更新设备信息成功！')
          this.setAllDeviceList() // TODO 更新一个
          const device = this.currentDevice
          device.plateNo = this.form.plateNo
          device.remark = this.form.remark
          this.setCurrentDevice(device)
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
