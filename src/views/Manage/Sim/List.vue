<template>
  <el-card>
    <!-- <div class="z-table-control">
      <el-button type="primary">添加用户</el-button>
    </div> -->
    <el-table :data="list" border v-loading.body="listLoading">
      <el-table-column type="index" width="50"> </el-table-column>
      <!-- <el-table-column prop="imei" label="设备号"> </el-table-column> -->
      <el-table-column prop="iccid" label="ICCID"> </el-table-column>
      <el-table-column prop="createTime" label="入库时间"> </el-table-column>
      <el-table-column prop="serviceStartTime" label="启用时间"> </el-table-column>
      <el-table-column prop="serviceEndTime" label="到期时间"> </el-table-column>
      <el-table-column prop="dayUsage" label="昨日流量(M)"> </el-table-column>
      <el-table-column prop="monthUsage" label="本月流量(M)"> </el-table-column>
      <!-- <el-table-column prop="status" label="卡状态"> </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-link type="primary" @click="handleGetInfo(scope.row.iccid)">详情</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary">发短信</el-link>
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
        iccid: '',
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
      try {
        const ds = await this.$api.manage.getSimCardInfos(this.listQuery)
        this.list = ds.data.list
        this.total = ds.data.totalCount
      } catch (error) {
        this.$message.error(error)
      }
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
    padDate(value) {
      return value < 10 ? '0' + value : value
    },
    formatDate(time) {
      let date = new Date(time*1000)
      // return this.$datetime.UTC(date) //, 'yyyy-MM-dd'
      // var date= new Date(value);
      var year = date.getFullYear()
      var month = this.padDate(date.getMonth() + 1)
      var day = this.padDate(date.getDate())
      var hours = this.padDate(date.getHours())
      var minutes = this.padDate(date.getMinutes())
      var seconds = this.padDate(date.getSeconds())
      return year + '-' + month +'-' + day + ' ' + hours + ':' +minutes +':' + seconds
    },
    handleGetInfo(id) {
      this.$api.manage.getSimCardInfo(id).then((res) => {
        if (res.code === 0) {
          // this.$message.success(message: res.data,)
          let d = res.data
          let r = 'iccid:' + d.iccid + '<br/>'
                 + 'msisdn:' + d.msisdn + '<br/>'
                 + 'imsi:' + d.imsi + '<br/>'
                 + '支持短信:' + d.support_sms + '<br/>'
                 + '短信端口:' + d.sp_code + '<br/>'
                 + '运营商:' + d.carrier + '<br/>'
                 + '卡状态:' + d.account_status + '<br/>'
                 + '是否激活:' + d.active + '<br/>'
                 + '总流量:' + d.data_plan + 'M<br/>'
                 + '当月用量:' + d.data_usage + 'M<br/>'
                 + '剩余流量:' + d.data_balance + '<br/>'
                 + '测试期已用流量:' + d.test_used_data_usage + '<br/>'
                 + '出库日期:' + this.formatDate(d.outbound_date) + '<br/>'
                 + '测试期起始日期:' + this.formatDate(d.test_valid_date) + '<br/>'
                 + '沉默期起始日期:' + this.formatDate(d.silent_valid_date) + '<br/>'
                 + '激活日期:' + this.formatDate(d.active_date) + '<br/>'
                 + '过期日期:' + this.formatDate(d.expiry_date) + '<br/>'
          this.$alert(r, '详情', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            // callback: action => {
            //   this.$message({
            //     type: 'info',
            //     message: `action: ${ action }`
            //   })
            // }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

<style></style>
