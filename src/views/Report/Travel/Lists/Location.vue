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
    <!-- <el-divider content-position="left">位置报表</el-divider> -->
    <el-table :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize) || list" v-loading.body="listLoading" border>
      <el-table-column type="index" align="center" fixed="left" width="50"></el-table-column>
      <el-table-column prop="imei" fixed="left" label="设备名称" width="150"> </el-table-column>
      <el-table-column prop="longitude" label="经度"> </el-table-column>
      <el-table-column prop="latitude" label="纬度"> </el-table-column>
      <el-table-column prop="course" label="方向"> </el-table-column>
      <el-table-column prop="speed" label="速度"> </el-table-column>
      <el-table-column prop="deviceTime" label="时间"> </el-table-column>
      <el-table-column prop="connectionStatus" label="状态"> </el-table-column>
      <el-table-column prop="accuracy" label="定位类型"> </el-table-column>
      <el-table-column prop="deviceDesc" label="地址"> </el-table-column>
      <!-- <el-table-column label="操作" fixed="right" width="100">
        <el-link type="primary">修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="danger">删除</el-link>
      </el-table-column> -->
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
        withPos: true,
        withTrip: false,
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
            this.list = res.data.positions
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
