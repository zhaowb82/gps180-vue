<template>
  <el-dialog :title="dialogType === 'save' ? '添加分组' : '编辑分组'" :visible="visible" width="400px" @close="handleClose" destroy-on-close>
    <el-form :model="form" ref="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称(不能超过50个字符)"></el-input>
      </el-form-item>
      <el-form-item label="所属公司" prop="deptId">
        <el-select v-model="form.deptId" placeholder="请选择公司" style="width: 100%" collapse-tags ref="selectDept">
          <el-option :value="form.deptId" :label="deptName" style="height:auto;padding:0;">
            <el-tree :data="tree" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最短定位时间" prop="mintime">
        <el-input v-model="form.mintime" placeholder="车辆可设置定位间隔的下限(最短间隔)"></el-input>
      </el-form-item>
      <el-form-item label="最长定位时间" prop="maxtime">
        <el-input v-model="form.maxtime" placeholder="车辆可设置定位间隔的上限(最长间隔)"></el-input>
      </el-form-item>
      <el-form-item label="用户总数" prop="maxUserNum">
        <el-input v-model.number="form.maxUserNum" placeholder="可包含的监控员数量"></el-input>
      </el-form-item>
      <el-form-item label="设备总数" prop="maxDeviceNum">
        <el-input v-model.number="form.maxDeviceNum" placeholder="可包含的车辆数量"></el-input>
      </el-form-item>
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
    group: {
      type: Object,
      default() {
        return null
      },
    },
    dialogType: {
      type: String,
      default: 'save',
    }
  },
  watch: {
    visible(value) {
      value && this.getDeptList()
    },
    group(value) {
      if (value) {
        this.form = {
          id: value.id,
          deptId: value.deptId,
          name: value.name,
          mintime: value.mintime,
          maxtime: value.maxtime,
          maxUserNum: value.maxUserNum,
          maxDeviceNum: value.maxDeviceNum,
        }
        if (this.deptList.length > 0) {
          this.deptList.map(e => {
            if (e.deptId === value.deptId) {
              this.deptName = e.name
            }
          })
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
    }
  },
  data() {
    return {
      form: {
        name: '',
        deptId: null,
        mintime: 30,
        maxtime: 3600,
        maxUserNum: null,
        maxDeviceNum: null,
      },
      deptName: null,
      rules: {
        imei: [{ required: true, message: '设备序号不能为空', trigger: 'blur' }],
        productId: [{ required: true, message: '产品类型必须选择', trigger: 'blur' }],
        imeis: [{ required: true, message: '设备序号不能为空', trigger: 'blur' }],
      },
      btnLoading: false,
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      deptList: []
    }
  },
  methods: {
    getDeptList() {
      this.$api.manage.deptsSelect().then(res => {
        if (res.code === 0) {
          this.deptList = res.data
          this.tree = this.$extra.treeDataTranslate(res.data, 'deptId')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$api.manage
            .saveGroup(this.dialogType, this.form)
            .then((res) => {
              if (res.code === 0) {
                const action = this.dialogType === 'save' ? '添加' : '编辑'
                this.$message.success(`${action}分组成功！`)
                this.handleClose(true)
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => (this.btnLoading = false))
        }
      })
    },
    handleNodeClick(node) {
      this.form.deptId = node.deptId
      this.deptName = node.name
      this.$refs.selectDept.blur()
    },
    handleReset() {
      this.form = {
        name: '',
        mintime: 30,
        maxtime: 3600,
        maxUserNum: 100,
        maxDeviceNum: 1000,
      }
    },
    handleClose(update = false) {
      this.handleReset()
      this.$emit('close', update)
    },
  },
}
</script>
