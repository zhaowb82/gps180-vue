<template>
  <el-dialog :title="dialogType === 'save' ? '添加用户' : '编辑用户'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form size="small" ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="所属公司">
        <el-select v-model="form.deptId" placeholder="请选择公司" ref="selectDept">
          <el-option :value="form.deptId" :label="deptName" style="height: auto;padding:0;">
            <el-tree :data="tree" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': dialogType === 'save' }">
        <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !form.id }">
        <el-input v-model="form.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="form.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="数据权限">
        <el-select v-model="form.dataScopeType" placeholder="请选择">
          <el-option v-for="(scope, index) in dataScopes" :key="index" :label="scope.name" :value="scope.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="多点登录" size="mini" prop="status">
        <el-switch v-model="form.multilogin" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSumit">{{ this.dialogType === 'save' ? '添加' : '更新' }}</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
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
    userId: {
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
    const validatePassword = (rule, value, callback) => {
      if (this.dialogType === 'save' && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    // const validateComfirmPassword = (rule, value, callback) => {
    //   if (!this.form.id && !/\S/.test(value)) {
    //     callback(new Error('确认密码不能为空'))
    //   } else if (this.form.password !== value) {
    //     callback(new Error('确认密码与密码输入不一致'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateEmail = (rule, value, callback) => {
      if (!value || value == '') {
        callback()
      } else if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      dataScopes: [],
      form: {
        userId: null,
        deptId: null,
        dataScopeType: null,
        username: '',
        password: '',
        // comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1,
        multilogin: false,
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        // comfirmPassword: [{ validator: validateComfirmPassword, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        email: [
          // { required: false, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      roleList: [],
      deptName: null,
      deptList: []
    }
  },
  // computed: {
  //   rules() {
  //     const validatePassword = (rule, value, callback) => {
  //       if (!this.form.id && !/\S/.test(value)) {
  //         callback(new Error('密码不能为空'))
  //       } else {
  //         callback()
  //       }
  //     }
  //     // const validateComfirmPassword = (rule, value, callback) => {
  //     //   if (!this.form.id && !/\S/.test(value)) {
  //     //     callback(new Error('确认密码不能为空'))
  //     //   } else if (this.form.password !== value) {
  //     //     callback(new Error('确认密码与密码输入不一致'))
  //     //   } else {
  //     //     callback()
  //     //   }
  //     // }
  //     const validateEmail = (rule, value, callback) => {
  //       if (value == '') {
  //         callback()
  //       } else if (!isEmail(value)) {
  //         callback(new Error('邮箱格式错误'))
  //       } else {
  //         callback()
  //       }
  //     }
  //     const validateMobile = (rule, value, callback) => {
  //       if (!isMobile(value)) {
  //         callback(new Error('手机号格式错误'))
  //       } else {
  //         callback()
  //       }
  //     }
  //     let rules = {
  //       username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  //       // comfirmPassword: [{ validator: validateComfirmPassword, trigger: 'blur' }],
  //       password = [{ validator: validatePassword, trigger: 'blur' }],
  //       email: [
  //         // { required: false, message: '邮箱不能为空', trigger: 'blur' },
  //         { validator: validateEmail, trigger: 'blur' },
  //       ],
  //       mobile: [
  //         { required: true, message: '手机号不能为空', trigger: 'blur' },
  //         { validator: validateMobile, trigger: 'blur' },
  //       ],
  //     }
  //     if (this.dialogType === 'save') {
  //       rules.password = [{ validator: validatePassword, trigger: 'blur' }]
  //     }
  //     return rules
  //   },
  // },
  methods: {
    async init() {
      try {
        const role = await this.$api.system.getSelectRole()
        if (role && role.code === 0) {
          this.roleList = role.data
        }
        const dept = await this.$api.manage.getDepts()
        if (dept && dept.code === 0) {
          this.deptList = dept.data
          this.tree = this.$extra.treeDataTranslate(dept.data, 'deptId')
        }
        const ds = await this.$api.system.getDataScopes()
        if (ds && ds.code === 0) {
          this.dataScopes = ds.data
        }
        if (this.userId) {
          const userInfo = await this.$api.system.getUserDetail(this.userId)
          if (userInfo && userInfo.code === 0) {
            this.form.userId = userInfo.data.userId
            this.form.username = userInfo.data.username
            this.form.salt = userInfo.data.salt
            this.form.email = userInfo.data.email
            this.form.mobile = userInfo.data.mobile
            this.form.roleIdList = userInfo.data.roleIdList
            this.form.status = userInfo.data.status
            this.form.deptId = userInfo.data.deptId
            this.form.dataScopeType = userInfo.data.dataScopeType
            this.form.multilogin = userInfo.data.multilogin
          }
          if (this.deptList.length > 0) {
            this.deptList.map(e => {
              if (e.deptId === userInfo.data.deptId) {
                this.deptName = e.name
              }
            })
          }
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // delete this.form.comfirmPassword
          this.$api.system.saveUser(this.dialogType, this.form).then((res) => {
            if (res && res.code === 0) {
              const action = this.dialogType === 'save' ? '添加' : '编辑'
              this.$message.success(`${action}用户成功！`)
              this.handleClose(true)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    handleClose(update = false) {
      this.$refs.form.clearValidate()
      this.form = {
        userId: null,
        deptId: null,
        dataScopeType: null,
        username: '',
        password: '',
        // comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1,
        multilogin: false,
      }
      this.$emit('close', update)
    },
    handleNodeClick(node) {
      this.form.deptId = node.deptId
      this.deptName = node.name
      this.$refs.selectDept.blur()
    },
  },
}
</script>
