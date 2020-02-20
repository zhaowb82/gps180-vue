<template>
  <div>
    <div class="z-table-control">
      <el-input placeholder="请输入车辆imei查询" v-model="listQuery.imei" style="width: 260px;">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter(listQuery.imei)"></el-button>
      </el-input>
    </div>
    <!-- <el-divider content-position="left">全部报警消息</el-divider> -->
    <el-table :data="list" v-loading.body="listLoading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="imei" label="设备名称">
        <span slot-scope="scope">{{scope.row.imei || '-'}}</span>
      </el-table-column>
      <el-table-column prop="occurTime" label="开始报警时间">
        <span slot-scope="scope">{{scope.row.occurTime || '-'}}</span>
      </el-table-column>
      <el-table-column prop="endTime" label="最后报警时间">
        <span slot-scope="scope">{{scope.row.endTime || '-'}}</span>
      </el-table-column>
      <el-table-column prop="type" label="报警信息">
        <span slot-scope="scope">{{switchAlarmType(scope.row.type)}}</span>
      </el-table-column>
      <el-table-column prop="occurNum" label="报警次数">
        <span slot-scope="scope">{{scope.row.occurNum || '-'}}</span>
      </el-table-column>
      <el-table-column prop="processStatus" label="是否处理">
        <span slot-scope="scope">{{scope.row.processStatus ? '已处理' : '未处理'}}</span>
      </el-table-column>
      <el-table-column prop="processUser" label="处理人">
        <span slot-scope="scope">{{scope.row.processUser || '-'}}</span>
      </el-table-column>
    </el-table>
    <div class="z-table-footer">
      <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :current-page="listQuery.pageNum" @current-change="handleCurrentChange" hide-on-single-page>
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
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
        // companyId: null,
        imei: '',
      },
    }
  },
  // computed: {
  //   ...mapGetters(['companyId']),
  // },
  methods: {
    async init() {
      try {
        // this.listQuery.companyId = this.companyId
        this.getList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getList() {
      this.listLoading = true
      const alarms = await this.$api.report.getAlarms(this.listQuery)
      this.list = alarms.data.list
      this.total = alarms.data.totalCount
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
    switchAlarmType(type) {
      switch (type) {
        case 'dismantle':
          return '拆除报警'
        case 'vibration':
          return '震动报警'
        case 'lightOn':
          return '感光报警'
        case 'dismantal':
          return '掉电报警'

        default:
          return '其它报警'
      }
    },
  },
}
</script>
