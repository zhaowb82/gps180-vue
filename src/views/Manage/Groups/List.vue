<template>
  <el-card>
    <div class="z-table-control">
      <el-button type="primary">添加分组</el-button>
    </div>
    <el-table :data="list" border>
      <el-table-column prop="name" label="分组名称"> </el-table-column>
      <el-table-column prop="crtUserId" label="用户数量"> </el-table-column>
      <el-table-column prop="devices" label="设备数量"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <el-link type="primary">修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="danger">删除</el-link>
      </el-table-column>
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
      try {
        const groups = await this.$api.manage.getAllGroups()
        this.list = groups.data
      } catch (error) {
        this.$message.error(error)
      }
    },
  },
}
</script>

<style></style>
