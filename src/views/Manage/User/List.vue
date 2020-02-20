<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="请输入用户名查询" v-model="listQuery.username" style="width: 260px;float:right;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.username)"></el-button>
      </el-input>
      <el-button type="primary" @click="handleCreate">新增</el-button>
      <el-button type="danger" @click="deleteHandle()" :disabled="listSelections.length <= 0">批量删除</el-button>
      <el-button type="primary" @click="handleAllUser()">全部用户</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <!-- <el-tree :data="tree" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree> -->
        <el-table :data="tree" v-loading="deptsLoading" row-key="deptId" default-expand-all :highlight-current-row="true" :show-header="false" style="width: 100%;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @row-click="handleSelectRow">
          <!-- <el-table-column type="index" width="50"> </el-table-column> -->
          <!-- <el-table-column prop="createUserId" label="所属客户"> </el-table-column> -->
          <el-table-column prop="name" label="公司名"> </el-table-column>
          <!-- <el-table-column prop="maxUserNum" label="最大用户数"> </el-table-column>
          <el-table-column prop="maxDeviceNum" label="最大设备数"> </el-table-column>
          <el-table-column prop="orderNum" label="排序"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.delFlag" :disabled="scope.row.deptId === 1" active-color="#409EFF" inactive-color="#F56C6C" @change="changeEnabled(scope.row, scope.row.delFlag)" />
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="createTime" label="创建时间"> </el-table-column> -->

          <!-- <el-table-column label="操作" align="right" fixed="right" min-width="150px">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleCreate(scope.row.deptId)">添加</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="handleEdit(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="handleDelete(scope.row.deptId)">删除</el-link>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
      <el-col :span="18">
        <el-table :data="list" border v-loading="listLoading" @selection-change="selectionChangeHandle" @sort-change='sortChangeHandle' style="width: 100%;">
          <el-table-column type="selection" align="center" width="50"> </el-table-column>
          <!-- <el-table-column prop="userId" width="80" label="ID"> </el-table-column> -->
          <el-table-column prop="username" label="用户名" sortable='custom' show-overflow-tooltip>
            <span slot-scope="scope">
              {{ scope.row.username || '-' }}
            </span>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
            <span slot-scope="scope">
              {{ scope.row.email || '-' }}
            </span>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" show-overflow-tooltip>
            <span slot-scope="scope">
              {{ scope.row.mobile || '-' }}
            </span>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable='custom' show-overflow-tooltip>
            <span slot-scope="scope">
              {{ scope.row.createTime || '-' }}
            </span>
          </el-table-column>
          <el-table-column prop="status" width="80" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" width="180" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" size="small" @click="handleEdit(scope.row.userId)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" size="small" @click="deleteHandle(scope.row.userId)">删除</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type='success' @click="handleResetPwd(scope.row.userId)">重置密码</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="listQuery.pageNum" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100]" hide-on-single-page>
      </el-pagination>
    </div>
    <user-form :dialogVisible="dialogVisible" :dialogType="dialogType" :userId="currentId" @close="handleClose"></user-form>
  </el-card>
</template>

<script>
export default {
  components: {
    UserForm: () => import('./Form'),
  },
  mounted() {
    this.getDeptList()
    this.getList()
  },
  data() {
    return {
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      list: [],
      total: 0,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        sort: null,
        order: null,
        username: null,
        deptId: null,
      },
      deptsLoading: false,
      listLoading: false,
      listSelections: [],
      dialogVisible: false,
      dialogType: 'create',
      currentId: null,
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$api.system.getUserList(this.listQuery).then((res) => {
        if (res && res.code === 0) {
          this.list = res.data.list
          this.total = res.data.totalCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    getDeptList() {
      this.deptsLoading = true
      this.$api.manage.getDepts().then((res) => {
        if (res.code === 0) {
          this.tree = this.$extra.treeDataTranslate(res.data, 'deptId')
        } else {
          this.$message.error(res.msg)
        }
        this.deptsLoading = false
      })
    },
    // 每页数
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 当前页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.listSelections = val
    },
    sortChangeHandle(column) {
      var prop = column.prop
      var order = column.order === 'descending' ? 'DESC' : 'ASC'
      this.listQuery.sort = prop
      this.listQuery.order = order
      this.getList()
      // console.log(column + '---' + prop + '---' + order)
    },
    // 删除
    deleteHandle(id) {
      const data = {
        userIds: id
          ? [id]
          : this.listSelections.map((item) => {
            return item.userId
          }),
      }
      this.$confirm(`确定对[id=${data.userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.system.deleteUser(data).then((res) => {
            if (res && res.code === 0) {
              this.$message.success('删除用户成功！')
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => { })
    },
    handleResetPwd(userId) {
      this.$api.system.resetUserPwd({ userId }).then((res) => {
        if (res.code === 0) {
          this.$message.success('新密码：' + res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
      this.currentId = null
      this.dialogVisible = false
      update && this.getList()
    },
    // handleNodeClick() {
    // },
    handleAllUser() {
      this.listQuery.deptId = null
      this.handleFilter()
    },
    handleSelectRow(row) {
      this.listQuery.deptId = row.deptId
      this.handleFilter()
    },
  },
}
</script>

<style></style>
