<template>
  <el-dialog :title="dialogType ==='create'?'添加客户':'编辑客户'" custom-class="z-dialog" :visible="dialogVisible" width="700px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="注册时间">
            <el-date-picker v-model="form.registerdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="企业联系人">
            <el-input v-model.trim="form.companyperson"></el-input>
          </el-form-item>
          <el-form-item label="24小时电话">
            <el-input v-model.trim="form.alldayphone"></el-input>
          </el-form-item>
          <el-form-item label="办公地址">
            <el-input v-model.trim="form.officeaddr"></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item label="组织机构编号" prop="orgcode">
            <el-input v-model.trim="form.orgcode"></el-input>
          </el-form-item>
          <el-form-item label="法人代表" prop="jurdcperson">
            <el-input v-model.trim="form.jurdcperson"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model.trim="form.companyphone"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="运营资质类别">
            <el-select v-model="form.type" placeholder="请选择运营资质类别" style="width: 100%;">
              <el-option label="1级资质" value="1"></el-option>
              <el-option label="2级资质" value="2"></el-option>
              <el-option label="3级资质" value="3"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="上级公司">
            <el-select v-model="form.parentName" placeholder="请选择公司" style="width: 200px" collapse-tags ref="selectDept">
              <el-option :value="form.parentId" style="height:auto;padding:0;">
                <el-tree :data="tree" :props="defaultProps" :default-expand-all="true" :highlight-current="true" @node-click="handleNodeClick"></el-tree>
                <!-- :node-key="props.label" -->
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="分组数量" prop="maxGroupNum">
            <el-input v-model.number="form.maxGroupNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户数量" prop="maxUserNum">
            <el-input v-model.number="form.maxUserNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备数量" prop="maxDeviceNum">
            <el-input v-model.number="form.maxDeviceNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea"></el-input>
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
    dialogParentId: {
      type: Number,
      default: null,
    },
    dialogEditData: {
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
      depts: [],
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      form: {
        parentId: null,
        parentName: '',
        name: '', //公司名称
        // orgcode: '', //机构编号
        // registerdate: '', //成立日期
        // jurdcperson: '', // 法人
        // companyperson: '', //企业联系人
        // companyphone: '', //企业联系电话
        // alldayphone: '', //24小时联系电话
        maxGroupNum: 0,
        maxUserNum: 0,
        maxDeviceNum: 0,
        // officeaddr: '', //工作地址
        remark: '', //备注
        // type: '', // 运营级别
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
    }
  },
  methods: {
    async init() {
      try {
        const dept = await this.$api.manage.getDepts()
        if (dept && dept.code === 0) {
          this.depts = dept.data
          this.tree = this.$extra.treeDataTranslate(dept.data, 'deptId')
        }
        // const deviceType = await this.$api.system.getProductByUser()
        // const commandType = await this.$api.system.getCommandType()
        // this.deviceTypeList = deviceType.data
        // this.commandTypeList = commandType.data
        if (this.dialogType === 'edit' && this.dialogEditData) {
          this.form = this.dialogEditData
          this.form.children = null
        }
        console.log(this.dialogParentId, 'dialogParentId')
        if (this.dialogType === 'create' && this.dialogParentId) {
          this.form.parentId = this.dialogParentId
        }
        if (this.form.parentId) {
          console.log(this.depts, 'this.depts')
          var arr = this.depts.find((o) => o.deptId == this.form.parentId)
          console.log(arr, 'arr')
          this.form.parentName = arr.name
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var api = null
          if (this.dialogType === 'create') {
            api = this.$api.manage.addDept(this.form)
          } else {
            api = this.$api.manage.updateDept(this.form)
          }
          api.then((res) => {
            if (res.code === 0) {
              this.$message.success('添加成功！')
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
        typecode: '',
        typename: '',
        functions: '',
        remark: '',
      }
      this.$emit('close', update)
    },
    handleNodeClick(node) {
      // console.log(node,'node')
      // if (node.children) {
      //   console.log(node,'node')
      // } else {
      this.form.parentId = node.deptId
      this.form.parentName = node.name
      this.$refs.selectDept.blur()
      // }
    }
  },
}
</script>