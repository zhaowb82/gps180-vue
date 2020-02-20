<template>
  <el-dialog :title="dialogType === 'save' ? '添加角色' : '编辑角色'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" :current-node-key="keys" show-checkbox> </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="handleSumit">添加</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
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
    roleId: {
      type: Number,
      default: null,
    },
  },
  watch: {
    dialogVisible(value) {
      value && this.init()
    },
    keys(value) {
      console.log(value)
    },
  },
  data() {
    return {
      form: {
        roleId: null,
        roleName: '',
        remark: '',
        menuIdList: [],
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      },
      keys: null,
      btnLoading: false,
    }
  },
  computed: {
    ...mapGetters('menuList'),
  },
  methods: {
    async init() {
      try {
        const list = await this.$api.system.getMenuList()
        this.menuList = this.$extra.treeDataTranslate(list, 'menuId')
        if (this.roleId) {
          const roleInfo = await this.$api.system.getRoleDetail(this.roleId)
          if (roleInfo && roleInfo.code === 0) {
            this.form.roleId = roleInfo.data.roleId
            this.form.roleName = roleInfo.data.roleName
            this.form.remark = roleInfo.data.remark
            this.form.menuIdList = roleInfo.data.menuIdList
            // this.$refs.menuListTree.setCheckedKeys(roleInfo.data.menuIdList)
            // tree回显节点半选解决方案
            roleInfo.data.menuIdList.forEach((n, i) => {
              var node = this.$refs.menuListTree.getNode(n)
              console.log(i + '-' + n + ':' + node.isLeaf, 'isLeaf')
              if (node.isLeaf) {
                this.$refs.menuListTree.setChecked(node, true)
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
          this.btnLoading = true
          // this.form.menuIdList = this.$refs.menuListTree.getCheckedKeys()
          this.form.menuIdList = [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
          this.$api.system.saveRole(this.dialogType, this.form)
            .then((res) => {
              if (res.code === 0) {
                const action = this.dialogType === 'save' ? '添加' : '编辑'
                this.$message.success(`${action}角色成功！`)
                this.handleClose(true)
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleClose(update = false) {
      this.form = {
        roleId: null,
        roleName: '',
        remark: '',
        menuIdList: [],
      }
      this.$emit('close', update)
    },
  },
}
</script>
