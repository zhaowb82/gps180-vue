<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="用户名／用户操作" v-model="listQuery.key" clearable style="width: 260px;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.key)"></el-button>
      </el-input>
    </div>
    <el-table :data="list" border v-loading.body="listLoading">
      <el-table-column prop="id" label="ID" width="80"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="operation" label="用户操作"> </el-table-column>
      <el-table-column prop="method" label="请求方法" width="150" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="params" label="请求参数" width="150" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column prop="time" label="执行时长(毫秒)"> </el-table-column>
      <el-table-column prop="ip" label="IP地址"> </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="180"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="60px">
        <template slot-scope="scope">
          <el-link type="danger" @click="handleDelete(scope.row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total" 
        :current-page="listQuery.pageNum" 
        @current-change="handleCurrentChange" 
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        hide-on-single-page>
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  mounted() {
    this.init()
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        key: '',
      },
    }
  },
  methods: {
    async init() {
      try {
        this.getList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getList() {
      this.listLoading = true
      const result = await this.$api.system.getLogList(this.listQuery)
      this.list = result.data.list
      this.total = result.data.totalCount
      this.listLoading = false
    },
    handleCurrentChange(e) {
      this.listQuery.pageNum = e
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleFilter(e) {
      this.listQuery.imei = e
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleDelete(id) {
      this.$api.system.deleteLog(id).then((res) => {
        if (res.code === 0) {
          this.init()
          this.$message.success('删除成功！')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

<style></style>
