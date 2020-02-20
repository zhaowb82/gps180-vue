<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="请输入角色名称查询" v-model="listQuery.roleName" style="width: 260px;float:right;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.roleName)"></el-button>
      </el-input>
      <el-button type="primary" @click="handleCreate">新增</el-button>
      <el-button type="danger" @click="handleDelete()" :disabled="listSelections.length <= 0">批量删除</el-button>
    </div>
    <el-table :data="list" border v-loading="listLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"> </el-table-column>
      <el-table-column prop="roleId" width="80" label="ID"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="createTime" width="180" label="创建时间"> </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleEdit(scope.row.roleId)">修改</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="danger" @click="handleDelete(scope.row.roleId)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <role-form :dialogVisible="dialogVisible" :dialogType="dialogType" :roleId="currentId" @close="handleClose"></role-form>
  </el-card>
</template>

<script>
export default {
  components: {
    RoleForm: () => import('./Form'),
  },
  mounted() {
    this.getList()
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        roleName: '',
      },
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
        .getRoleList(this.listQuery)
        .then((res) => {
          if (res && res.code === 0) {
            this.list = res.data.list
            this.total = res.data.totalCount
          } else {
            this.list = []
            this.total = 0
          }
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.listSelections = val
    },
    // 删除
    handleDelete(id) {
      const data = {
        roleIds: id
          ? [id]
          : this.listSelections.map((item) => {
              return item.roleId
            }),
      }
      this.$confirm(`确定对[id=${data.roleIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.system.deleteRole(data.roleIds).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('删除角色成功！')
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
