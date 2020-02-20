<template>
  <el-card>
    <div class="z-table-control">
      <el-input placeholder="请输入设备号查询" v-model="listQuery.imei" style="width: 260px;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.imei)"></el-button>
      </el-input>
    </div>
    <el-table :data="list" border v-loading.body="listLoading">
      <el-table-column prop="imei" label="设备号"> </el-table-column>
      <el-table-column prop="recTime" label="录音时间"> </el-table-column>
      <el-table-column prop="fileSize" label="文件大小"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleDownload(scope.row)">下载</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="danger" @click="handleDelete(scope.row.id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :current-page="listQuery.pageNum" @current-change="handleCurrentChange" hide-on-single-page> </el-pagination>
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
        imei: '',
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
      const deviceRecs = await this.$api.manage.getDeviceRecs(this.listQuery)
      this.list = deviceRecs.data.list
      this.total = deviceRecs.data.totalCount
      this.listLoading = false
    },
    handleCurrentChange(e) {
      this.listQuery.pageNum = e
      this.getList()
    },
    handleFilter(e) {
      this.listQuery.imei = e
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleDownload(e) {
      const params = {
        id: e.id,
      }
      this.$api.manage.downloadRec(params).then((res) => {
        if (res) {
          const url = window.URL.createObjectURL(res)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          const name = `${e.imei} - ${e.recTime}.amr`
          link.setAttribute('download', name)

          document.body.appendChild(link)
          link.click()
        }
      })
    },
    handleDelete(id) {
      this.$api.manage.deleteRec(id).then((res) => {
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
