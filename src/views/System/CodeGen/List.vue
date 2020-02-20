<template>
  <el-card>
    <el-input v-model.trim="param" placeholder="请输入参数" style="width:600px;"></el-input>
    <div class="z-table-control">
      <el-button type="primary" @click="handleGenerateCode">生成代码</el-button>
    </div>
    <div class="z-table-control">
      <el-input placeholder="请输入表名查询" v-model="listQuery.tableName" style="width: 260px;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
      </el-input>
    </div>
    <el-table :data="list" border v-loading="listLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" align="center" fixed="left" width="50" label="序号"></el-table-column>
      <el-table-column type="selection" align="center" width="50"> </el-table-column>
      <el-table-column prop="tableName" label="表名称"></el-table-column>
      <el-table-column prop="ENGINE" label="ENGINE"></el-table-column>
      <el-table-column prop="tableComment" label="表注释"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="listQuery.page" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100]" hide-on-single-page>
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
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
        tableName: '',
      },
      listLoading: false,
      listSelections: [],
      param: 'com.gps,api,gps180,admin@gps180.com',
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$api.codegen.getTableList(this.listQuery)
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 每页数
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.getList()
    },
    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.listSelections = val
    },
    handleGenerateCode() {
      var ids = this.listSelections.map((item) => {
            return item.tableName
          })
      this.$api.codegen.generateCode(ids.join(','), this.param).then((res) => {
        if (res) {
          const url = window.URL.createObjectURL(res)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          const name = `${this.param}.zip`
          link.setAttribute('download', name)

          document.body.appendChild(link)
          link.click()
        }
      })
    }
  }
}
</script>

<style>
</style>