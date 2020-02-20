<template>
  <el-dialog title="设备基本信息" :visible="dialogVisible" width="300px" @close="handleClose" append-to-body destroy-on-close>
    <el-row :gutter="10">
      <el-col :span="8" style="text-align: right;line-height: 24px;font-weight: bold;">
        <div>IMEI: </div>
        <div>所属客户: </div>
        <div>分组名称: </div>
        <div>设备协议: </div>
        <div>设备名称: </div>
        <div>厂商编号: </div>
        <div>终端型号: </div>
        <div>到期时间: </div>
        <div>手机号码: </div>
        <div>ICCID: </div>
      </el-col>
      <el-col :span="16" style="text-align: left;line-height: 24px;">
        <div>{{detail.imei || '-'}}</div>
        <div>{{detail.companyId || '-'}}</div>
        <div>{{detail.groupId || '-'}}</div>
        <div>{{detail.protocol || '-'}}</div>
        <div>{{detail.plateNo || '-'}}</div>
        <div>{{detail.productId || '-'}}</div>
        <div>{{detail.deviceType || '-'}}</div>
        <div>{{detail.simEndDate || '-'}}</div>
        <div>{{detail.sim || '-'}}</div>
        <div>{{detail.iccid || '-'}}</div>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button type="danger" @click="handleClose">关闭</el-button>
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
        !value && (this.detail = {
          detail: {
            imei: '',
            sim: '',
            iccid: '',
            simStartDate: null,
            simEndDate: '',
            protocol: '',
            productId: '',
            plateNo: '',
            deviceType: 0,
            carVin: null,
            driverName: null,
            companyId: '',
            groupId: '',
            canLogin: true,
            password: '',
            remark: null,
            status: 1,
            totalUp: null,
            isTest: false,
            crtUserId: '',
            crtTime: '',
            updateUserId: '',
            updateTime: ''
          }
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      detail: {
        imei: '',
        sim: '',
        iccid: '',
        simStartDate: null,
        simEndDate: '',
        protocol: '',
        productId: '',
        plateNo: '',
        deviceType: 0,
        carVin: null,
        driverName: null,
        companyId: '',
        groupId: '',
        canLogin: true,
        password: '',
        remark: null,
        status: 1,
        totalUp: null,
        isTest: false,
        crtUserId: '',
        crtTime: '',
        updateUserId: '',
        updateTime: ''
      }
    }
  },
  methods: {
    getDeviceDetail() {
      this.$api.device.getDeviceDetail(this.imei).then(res => {
        if (res.code === 0) {
          this.detail = res.data
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
