<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="请输入公司名查询" clearable v-model="key" style="float:right;width: 260px;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(key)"></el-button>
      </el-input>
      <el-button v-if="isAuth('sys:dept:save')" type="primary" @click="handleCreate(0)">添加客户公司</el-button>
      <!-- <el-select v-model="listQuery.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px"
         @change="crud.toQuery">
          <el-option v-for="item in enabledTypeOptions" :key="item.key" 
            :label="item.display_name" :value="item.key" />
      </el-select> -->
    </div>
    <el-table :data="list" v-loading="listLoading" row-key="deptId" default-expand-all border style="width: 100%;" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" width="200" label="公司名" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="maxUserNum" label="最大用户数" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="maxGroupNum" label="最大分组数" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="maxDeviceNum" label="最大设备数" show-overflow-tooltip> </el-table-column>
      <!-- <el-table-column prop="orderNum" label="排序"> </el-table-column> -->
      <el-table-column prop="status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" :disabled="scope.row.deptId === 1" active-color="#409EFF" inactive-color="#F56C6C" @change="changeEnabled(scope.row, scope.row.enable)" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip> </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="210px">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleCreate(scope.row.deptId)">添加下级公司</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary" @click="handleEdit(scope.row)">修改</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="danger" @click="handleDelete(scope.row.deptId)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <customer-form :dialogVisible="dialogVisible" :dialogType="dialogType" :dialogParentId="dialogParentId" :dialogEditData="dialogEditData" @close="handleClose">
    </customer-form>
  </el-card>
</template>

<script>
export default {
  components: {
    CustomerForm: () => import('./Form'),
  },
  mounted() {
    this.getList()
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      key: '',
      dialogVisible: false,
      dialogType: 'create',
      dialogParentId: 0,
      dialogEditData: null,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$api.manage.getDepts().then((res) => {
        if (res.code === 0) {
          this.list = this.$extra.treeDataTranslate(res.data, 'deptId')
        } else {
          this.$message.error(res.msg)
        }
      })
        .finally(() => {
          this.listLoading = false
        })
    },
    // 改变状态
    changeEnabled(data, val) {
      // "' + this.dict.label.dept_status[val] + '"
      var ex1 = val ? 'Enable' : 'Disable'
      this.$confirm('此操作将' + ex1 + data.name + '部门, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.manage.enableDept({ deptId: data.deptId, enable: val }).then(res => {
          if (res && res.code === 0) {
            this.$message.success('更新成功！')
          } else {
            data.enable = !data.enable
            this.$message.error(res.msg)
          }
        }).catch(err => {
          data.enable = !data.enable
          this.$message.error(err.msg)
        })
      }).catch(() => {
        data.enable = !data.enable
      })
    },
    handleCreate(id) {
      this.dialogType = 'create'
      this.dialogParentId = id
      this.dialogVisible = true
    },
    handleEdit(data) {
      this.dialogType = 'edit'
      this.dialogEditData = data
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确定删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$api.system.deleteDept(id).then((res) => {
          if (res && res.code === 0) {
            this.$message.success('删除成功！')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
        .catch(() => { })
    },
    handleClose(update) {
      this.dialogVisible = false
      update && this.getList()
    },
  },
}
</script>

<style></style>
