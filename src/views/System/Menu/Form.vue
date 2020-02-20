<template>
  <el-dialog :title="dialogType === 'save' ? '添加菜单' : '编辑菜单'" custom-class="z-dialog" :visible="dialogVisible" width="500px" @close="handleClose" destroy-on-close>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(type, index) in typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="typeList[form.type] + '名称'" prop="name">
        <el-input v-model="form.name" :placeholder="typeList[form.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
          <el-tree :data="menuListTree" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false"> </el-tree>
        </el-popover>
        <el-input v-model="form.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type !== 2" label="路由" prop="url">
        <el-input v-model="form.url" placeholder="路由"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type !== 0" label="授权标识" prop="perms">
        <el-input v-model="form.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="form.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.type !== 2" label="菜单图标" prop="icon">
        <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
          <div class="mod-menu__icon-inner">
            <div class="mod-menu__icon-list">
              <el-button v-for="(item, index) in iconList" :key="index" @click="iconActiveHandle(item)" :class="{ 'is-active': item === form.icon }">
                <z-icon :icon="item"></z-icon>
              </el-button>
            </div>
          </div>
        </el-popover>
        <el-input v-model="form.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSumit">{{ dialogType === 'save' ? '添加' : '保存' }}</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Icon from '@/components/zIcon/getNameList'
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
    menuId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    dialogVisible(value) {
      value && this.init()
    },
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      if (this.form.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        menuId: null,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        list: null,
      },
      typeList: ['目录', '菜单', '按钮'],
      menuListTree: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      iconList: [],
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        parentName: [{ required: true, message: '上级菜单不能为空', trigger: 'change' }],
        url: [{ validator: validateUrl, trigger: 'blur' }],
      },
    }
  },
  methods: {
    async init() {
      try {
        const menu = await this.$api.system.getSelectMenuList()
        if (menu && menu.code === 0) {
          this.menuListTree = this.$extra.treeDataTranslate(menu.data, 'menuId')
        }
        this.iconList = Icon.getNameList()
        if (this.menuId) {
          const detail = await this.$api.system.getMenuDetail(this.menuId)
          if (detail && detail.code === 0) {
            this.form = { ...detail.data }
          }
          this.menuListTreeSetCurrentNode()
        } else {
          this.menuListTreeSetCurrentNode()
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSumit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.system.saveMenu(this.dialogType, this.form).then((res) => {
            if (res.code === 0) {
              const action = this.dialogType === 'save' ? '添加' : '编辑'
              this.$message.success(`${action}菜单成功！`)
              this.$store.dispatch('GetUserMenuPermission')
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
        menuId: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
      }
      this.$emit('close', update)
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data) {
      this.form.parentId = data.menuId
      this.form.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.form.parentId)
      this.form.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.form.icon = iconName
    },
  },
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
