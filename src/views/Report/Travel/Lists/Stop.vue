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
      <el-row :gutter="20">
        <el-col :sm="12" :md="8" class="z-filter-item">
          <div class="label">最小停留分钟</div>
          <el-input v-model.trim="listQuery.minParkTime" placeholder="请输入时间（分）" style="width:300px;"></el-input>
        </el-col>
      </el-row>
      <div class="z-filter-button-zone">
        <el-button type="primary" @click="handleFilter">筛选</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <!-- <el-divider content-position="left">停留详单</el-divider> -->
    <el-table :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize) || list" v-loading.body="listLoading" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="deviceId" label="设备名称" width="200" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="170" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="170" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="duration" label="停留时间" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ handletimeStamp(scope.row.startTime, scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="protocol" label="经纬度" min-width="150" show-overflow-tooltip>
        <span slot-scope="scope"> {{ scope.row.latitude }},{{ scope.row.longitude }} </span>
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
        minParkTime: 5,
        withStop: true,
        withPos: false,
        withTrip: false
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
            let stops = res.data.stops
            stops.map(async (e) => {
              const location = this.$trans.wgs2bd(e.longitude, e.latitude)
              const address = await this.$trans.bd2address(location[0], location[1])
              e.address = address
            })
            this.list = stops
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
    handletimeStamp(startTime, endTime) {
      const stopTime = this.$datetime.intervalTime(startTime, endTime)
      return stopTime
    },
  },
}
</script>
