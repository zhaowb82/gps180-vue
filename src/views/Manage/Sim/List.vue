<template>
  <el-card>
    <!-- <div class="z-table-control">
      <el-button type="primary">添加用户</el-button>
    </div> -->
    <el-table :data="list" border>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="imei" label="设备号"> </el-table-column>
      <el-table-column prop="iccid" label="ICCID"> </el-table-column>
      <el-table-column prop="createTime" label="启用时间"> </el-table-column>
      <el-table-column prop="dataScopeType" label="到期时间"> </el-table-column>
      <el-table-column prop="mobile" label="本月流量总额"> </el-table-column>
      <el-table-column prop="multilogin" label="本月流量"> </el-table-column>
      <el-table-column prop="status" label="卡状态"> </el-table-column>
      <!-- <el-table-column label="操作" fixed="right" width="100px">
        <el-link type="primary">修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="danger">删除</el-link>
      </el-table-column> -->
    </el-table>
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
    }
  },
  methods: {
    async init() {
      // try {
      //   const users = await this.$api.manage.getUsers()
      //   this.list = users.data
      // } catch (error) {
      //   this.$message.error(error)
      // }
    },
  },
}
</script>

<style></style>
