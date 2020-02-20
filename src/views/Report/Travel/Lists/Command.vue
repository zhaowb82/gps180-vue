<template>
  <div class="z-table">
    <div class="z-filter-area">
      <el-row :gutter="20">
        <el-col :sm="12" :md="8" class="z-filter-item">
          <div class="label">选择设备</div>
          <el-select v-model="listQuery.imei" filterable remote :remote-method="getDeviceList" placeholder="请选择设备" style="width:300px;">
            <el-option v-for="(device, index) in devices" :key="index" :value="device">
              {{ device }}
            </el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :md="8" class="z-filter-item">
          <div class="label">选择时间</div>
          <el-date-picker v-model="dataRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width: 260px;"> </el-date-picker>
        </el-col>
      </el-row>
      <div class="z-filter-button-zone">
        <el-button type="primary" @click="handleFilter">筛选</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <el-table :data="list" v-loading.body="listLoading" border>
      <el-table-column type="index" label="编号" width="50"> </el-table-column>
      <el-table-column prop="imei" label="设备名称" width="150"> </el-table-column>
      <el-table-column prop="commandType" label="命令名称" width="250" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="executeTime" label="发送时间" width="150" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="commandBody" label="发送内容" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="feedbackResult" label="发送结果" width="80"> </el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :current-page="listQuery.pageNum" @current-change="handleCurrentChange" hide-on-single-page> </el-pagination>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import date from '@/mixins/date'
export default {
  mixins: [date],
  watch: {
    dataRange(value) {
      if (value) {
        this.listQuery.startDate = value[0]
        this.listQuery.endDate = value[1]
      } else {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      }
    },
  },
  data() {
    return {
      list: [],
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        // companyId: '',
        startDate: '',
        endDate: '',
        imei: '',
      },
      listLoading: false,
      total: 0,
      dataRange: [],
      devices: [],
    }
  },
  // computed: {
  //   ...mapGetters(['companyId']),
  // },
  methods: {
    async getList() {
      this.listLoading = true
      const commandLogs = await this.$api.report.getCommandLogs(this.listQuery)
      this.list = commandLogs.data.records
      this.total = commandLogs.data.total
      this.listLoading = false
    },
    getDeviceList(imei) {
      if (imei.length > 3) {
        const params = {
          imei,
        }
        this.$api.device.getDeviceListBySearch(params).then((res) => {
          if (res.code === 0) {
            this.devices = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        imei: '',
        startTime: '',
        endTime: '',
      }
      this.getList()
    },
    handleCurrentChange(e) {
      this.listQuery.pageNum = e
      this.getList()
    },
  },
}
</script>
