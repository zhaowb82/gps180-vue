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
          <el-date-picker v-model="dataRange" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width:380px;"> </el-date-picker>
        </el-col>
      </el-row>
      <div class="z-filter-button-zone">
        <el-button type="primary" @click="handleFilter">筛选</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <!-- <el-divider content-position="left">里程详单</el-divider> -->
    <el-table :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize) || list" v-loading.body="listLoading" border>
      <el-table-column type="index" align="center" fixed="left" width="50"></el-table-column>
      <el-table-column prop="deviceId" fixed="left" label="设备名称" width="150"> </el-table-column>
      <el-table-column prop="startTime" label="里程开始时间"> </el-table-column>
      <el-table-column prop="endTime" label="里程结束时间"> </el-table-column>
      <el-table-column prop="startDistance" label="起始里程(米)"> </el-table-column>
      <el-table-column prop="endDistance" label="结束里程(米)"> </el-table-column>
      <el-table-column prop="distance" label="总里程(米)">
        <!-- <template slot-scope="scope">
          {{scope.row.endDistance - scope.row.startOdometer}}
        </template> -->
      </el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" @current-change="pageNum = $event" :current-page="pageNum" :page-sizes="[10, 20, 30, 50, 100]" :page-size="pageSize" layout="total, prev, pager, next" :total="list.length" background hide-on-single-page></el-pagination>
    </div>
  </div>
</template>

<script>
import date from '@/mixins/date'
export default {
  mixins: [date],
  watch: {
    dataRange(value) {
      if (value) {
        this.listQuery.startTime = value[0]
        this.listQuery.endTime = value[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
  },
  data() {
    return {
      list: [],
      listQuery: {
        imei: '',
        startTime: '',
        endTime: '',
        withStop: false,
        withPos: false,
        withTrip: true,
      },
      listLoading: false,
      total: 0,
      dataRange: [],
      devices: [],
      pageSize: 10,
      pageNum: 1,
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$api.report
        .getTravelInfoList(this.listQuery)
        .then((res) => {
          if (res.code === 0) {
            this.list = res.data.trips
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => (this.listLoading = false))
    },
    getDeviceList(imei) {
      if (imei.length >= 3) {
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
      if (this.listQuery.imei === '') {
        this.$message.warning('请选择查询设备！')
        return
      } else if (this.listQuery.startTime === '' && this.listQuery.endTime === '') {
        this.$message.warning('请选择查询时间范围！')
        return
      } else {
        this.getList()
      }
    },
    handleReset() {
      this.listQuery = {
        imei: '',
        startTime: '',
        endTime: '',
      }
      this.getList()
    },
  },
}
</script>
