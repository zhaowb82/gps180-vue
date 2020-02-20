<template>
  <el-dialog :title="dialogType === 'save' ? '添加设备' : '编辑设备'" :visible="visible" width="800px" @close="handleClose" destroy-on-close>
    <el-form :model="form" ref="form" :rules="rules" size="small" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属客户公司" prop="companyId">
            <el-select v-model="form.companyId" placeholder="请选择公司" style="width: 100%" collapse-tags ref="selectDept">
              <el-option :value="form.companyId" :label="deptName" style="height:auto;padding:0;">
                <el-tree :data="tree" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="productId">
            <el-select v-model="form.productId" style="width: 100%;">
              <el-option v-for="(type, index) in typeList" :key="index" :label="type.deviceDesc" :value="type.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="终身免费" prop="isfree">
            <el-input v-model="form.isfree"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="上报次数" prop="imei">
            <el-input v-model="form.imei"></el-input>
          </el-form-item> -->
          <el-form-item label="是否可用" prop="status">
            <el-select v-model="form.status" style="width: 100%;">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="允许登陆" prop="canLogin">
            <el-select v-model="form.canLogin" style="width: 100%;">
              <el-option label="允许" :value="1"></el-option>
              <el-option label="禁止" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType === 'save'" label="批量加设备">
            <el-checkbox v-model="isMultiple" size="medium"></el-checkbox>
          </el-form-item>
          <!-- <el-form-item label="监护账号" prop="driverName">
            <el-input v-model="form.driverName"></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属分组" prop="groupId">
            <el-select v-model="form.groupId" v-bind:disabled="disabledGroup" style="width: 100%;" ref="selectGroup">
              <el-option v-for="(group, index) in groupList" :key="index" :label="group.name" :value="group.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过期时间" prop="simEndDate">
            <el-date-picker v-model="form.simEndDate" type="date" placeholder="选择过期日期" value-format="timestamp" style="width: 100%;"> </el-date-picker>
          </el-form-item>
          <el-form-item label="上报次数" prop="totalUp">
            <el-input v-model="form.totalUp"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!isMultiple" :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备序号" prop="imei">
            <el-input v-model.trim="form.imei"></el-input>
          </el-form-item>
          <el-form-item label="ICCID" prop="iccid">
            <el-input v-model="form.iccid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="plateNo">
            <el-input v-model="form.plateNo"></el-input>
          </el-form-item>
          <el-form-item label="SIM" prop="sim">
            <el-input v-model="form.sim"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-else :gutter="20">
        <el-col :span="12">
          <el-form-item label="序号长度">
            <el-input-number v-model="imeiLength" controls-position="right" :min="15" :max="18"></el-input-number>
          </el-form-item>
          <el-form-item label="设备序号" prop="imeis">
            <el-input v-model.trim="form.imeis" @keyup.enter.native="form.imeis += '\n'" @blur="handleCheckBlur" :autosize="{ minRows: 2, maxRows: 12 }" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" label-width="0px">
            <el-input v-model="errorTips" disabled :autosize="{ minRows: 5, maxRows: 15 }" resize="none" type="textarea" class="errorTips" :class="{ hasError}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="btnLoading" @click="handleSubmit">{{ this.dialogType ==='save'?'添加':'更新' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
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
    device: {
      type: Object,
      default() {
        return null
      },
    },
    dialogType: {
      type: String,
      default: 'save',
    },
    dialogDeptId: {
      type: String,
      default: null,
    },
    dialogGroupId: {
      type: String,
      default: null,
    }
  },
  watch: {
    visible(value) {
      value && this.init()
    },
    device(value) {
      if (value) {
        this.form = {
          imei: value.imei,
          productId: value.productId,
          companyId: value.companyId,
          simEndDate: new Date(value.simEndDate).getTime(),
          canLogin: value.canLogin ? 1 : 0,
          status: value.status,
          plateNo: value.plateNo,
          password: '',
          sim: value.sim,
          groupId: value.groupId,
          totalUp: value.totalUp || 0,
          iccid: value.iccid,
        }
      }
    },
    isMultiple() {
      this.$refs.form.clearValidate()
    },
    imeiLength: {
      handler(value) {
        this.regExp = new RegExp(`^[a-z0-9a-z]{${value}}$`)
        this.form.imeis && this.handleCheckImeis(this.form.imeis)
      },
      immediate: true,
    },
    'form.imeis'(value) {
      value && this.handleCheckImeis(value)
    },
    groupList() {
      if (this.groupList && this.groupList.length > 0) {
        this.disabledGroup = false
      } else {
        this.disabledGroup = true
        this.form.groupId = ''
      }
    }
  },
  data() {
    return {
      isMultiple: false,
      imeiLength: 15,
      errorTips: '',
      regExp: null,
      form: {
        imei: '',
        imeis: '',
        productId: null,
        companyId: null,
        simEndDate: null,
        canLogin: 1,
        status: 1,
        plateNo: '',
        password: '',
        sim: null,
        groupId: '',
        totalUp: 0,
        iccid: null,
      },
      rules: {
        imei: [{ required: true, message: '设备序号不能为空', trigger: 'blur' }],
        productId: [{ required: true, message: '产品类型必须选择', trigger: 'blur' }],
        imeis: [{ required: true, message: '设备序号不能为空', trigger: 'blur' }],
      },
      btnLoading: false,
      deptList: [],
      groupList: [],
      typeList: [],
      hasError: false,
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      disabledGroup: true,
      deptName: null
    }
  },
  methods: {
    async init() {
      try {
        const deptList = await this.$api.manage.deptsSelect()
        const typeList = await this.$api.manage.getDeviceTypeList()
        if (deptList.code === 0) {
          this.deptList = deptList.data
          this.tree = this.$extra.treeDataTranslate(deptList.data, 'deptId')
        }
        if (typeList.code === 0) {
          this.typeList = typeList.data
        }
        if (this.dialogType === 'update' && this.device) {
          this.getGroupsData(this.device.companyId)
        }
        if (this.dialogType === 'save' && this.dialogDeptId && this.dialogGroupId) {
          this.form.companyId = this.dialogDeptId
          this.getGroupsData(this.form.companyId)
          console.log(this.dialogGroupId)
          this.form.groupId = this.dialogGroupId
        }
        if (this.device && deptList.data.length > 0) {
          deptList.data.map(e => {
            if (e.deptId == this.device.companyId) {
              this.deptName = e.name
            }
          })
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    getGroupsData(deptId) {
      this.$api.manage.getGroupsByDept(deptId).then((res) => {
        if (res.code === 0) {
          this.groupList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCheckImeis(imeis) {
      const list = imeis.indexOf('\n') ? imeis.split('\n') : [imeis]
      const total = `录入总数：${list[list.length - 1] ? list.length : list.length - 1}\n`
      const imeiList = `设备列表：\n${imeis}`
      let errorIndex = []
      list.map((e, index) => {
        if ((list.length > index + 1 || e.length >= this.imeiLength) && !this.regExp.test(e)) {
          errorIndex.push(index + 1)
        }
      })
      const errorMsg = `有误序号：${errorIndex.join(',')}\n错误原因：设备序号不是数字或者字母或者长度不一致\n`
      this.hasError = errorIndex.length > 0
      this.errorTips = (errorIndex.length > 0 ? errorMsg : '') + total + imeiList
    },
    handleCheckBlur() {
      const imeis = this.form.imeis
      if (imeis[imeis.length - 1].indexOf('\n')) { this.form.imeis += '\n' }
    },
    handleClose(update = false) {
      this.handleReset()
      this.$emit('close', update)
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const data = {
            productId: this.form.productId,
            companyId: this.form.companyId,
            simEndDate: this.form.simEndDate,
            canLogin: this.form.canLogin,
            status: this.form.status,
            password: this.form.password,
            groupId: this.form.groupId,
            totalUp: this.form.totalUp,
          }
          if (data.canLogin && !data.password) {
            data.password = '123456'
          }
          if (!this.isMultiple) {
            data.imei = this.form.imei
            data.plateNo = this.form.plateNo
            data.sim = this.form.sim
            data.iccid = this.form.iccid
            this.$api.device.saveDevice(this.dialogType, data)
              .then((res) => {
                if (res.code === 0) {
                  const action = this.dialogType === 'save' ? '添加' : '编辑'
                  this.$message.success(`${action}设备成功！`)
                  this.handleClose(true)
                } else {
                  this.$message.error(res.msg)
                }
              })
              .finally(() => (this.btnLoading = false))
          } else {
            if (this.hasError) {
              this.$message.error('当前设备序号列表有误，请更正后重新提交！')
              this.btnLoading = false
            } else {
              data.imeis = this.form.imeis.split('\n').filter((e) => e && e)
              this.$api.device.saveDevices(data)
                .then((res) => {
                  if (res.code === 0) {
                    this.$message.success('批量添加设备成功！')
                    this.handleClose(true)
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .finally(() => (this.btnLoading = false))
            }
          }
        }
      })
    },
    handleReset() {
      this.form = {
        imei: '',
        imeis: '',
        productId: null,
        companyId: null,
        simEndDate: null,
        canLogin: 1,
        status: 1,
        plateNo: '',
        password: '',
        sim: null,
        groupId: '',
        totalUp: 0,
        iccid: null,
      }
      this.deptList = []
      this.groupList = []
      this.typeList = []
      this.tree = []
    },
    handleNodeClick(node) {
      this.form.deptId = node.deptId
      this.deptName = node.name
      this.$refs.selectDept.blur()
      this.getGroupsData(this.form.deptId)
    },
  },
}
</script>

<style lang='scss'>
.errorTips {
  &.el-textarea.is-disabled {
    .el-textarea__inner {
      color: green;
    }
    &.hasError {
      .el-textarea__inner {
        color: red;
      }
    }
  }
}
</style>
