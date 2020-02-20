<template>
  <el-card>
    <div class="z-table-control">
      <el-button type="primary" @click="handleCreate">新增</el-button>
    </div>
    <el-table :data="list" row-key="menuId" border v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="name" min-width="150" label="名称"> </el-table-column>
      <el-table-column prop="parentName" width="120" label="上级菜单">
        <span slot-scope="scope">
          {{ scope.row.parentName || '-' }}
        </span>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <z-icon :icon="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序号"> </el-table-column>
      <el-table-column prop="url" width="150" label="菜单URL" show-overflow-tooltip>
        <span slot-scope="scope">
          {{ scope.row.url || '-' }}
        </span>
      </el-table-column>
      <el-table-column prop="perms" width="150" label="授权标识" show-overflow-tooltip>
        <span slot-scope="scope">
          {{ scope.row.perms || '-' }}
        </span>
      </el-table-column>
      <el-table-column fixed="right" align="center" width="110" label="操作">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleEdit(scope.row.menuId)">修改</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="danger" @click="handleDelete(scope.row.menuId)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <menu-form :dialogVisible="dialogVisible" :dialogType="dialogType" :menuId="currentId" @close="handleClose"></menu-form>
  </el-card>
</template>

<script>
export default {
  components: {
    MenuForm: () => import('./Form'),
  },
  mounted() {
    this.getList()
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listSelections: [],
      dialogVisible: false,
      dialogType: 'save',
      currentId: null,
    }
  },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.$api.system
        .getMenuList()
        .then((res) => {
          this.list = this.$extra.treeDataTranslate(res, 'menuId')
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 新增 / 修改
    addOrUpdateHandle() {
      this.dialogVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
    },
    // 删除
    handleDelete(id) {
      this.$confirm('确定菜单进行删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.system.deleteMenu(id).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('删除菜单成功！')
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => {})
    },
    handleCreate() {
      this.dialogType = 'save'
      this.dialogVisible = true
    },
    handleEdit(id) {
      this.dialogType = 'update'
      this.currentId = id
      this.dialogVisible = true
    },
    handleClose(update) {
      this.dialogVisible = false
      this.currentId = null
      update && this.getList()
    },
  },
}
</script>

<style></style>
