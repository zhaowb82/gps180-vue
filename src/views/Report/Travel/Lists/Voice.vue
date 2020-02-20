<template>
  <div>
    <!-- <el-divider content-position="left">语音报表</el-divider> -->
    <el-table :data="list" border>
      <el-table-column prop="deviceModel" label="类型名称">
      </el-table-column>
      <el-table-column prop="protocol" label="通信协议">
      </el-table-column>
      <el-table-column prop="deviceDesc" label="备注">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <el-link type="primary">修改</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link type="danger">删除</el-link>
      </el-table-column>
    </el-table>
  </div>
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
        const deviceType = await this.$api.system.getProductByUser()
        const protocol = await this.$api.system.getProtocol()
        const command = await this.$api.system.getAllCommand()
        this.list = deviceType.data
        this.protocolList = protocol.data
        this.commandList = command.data
      } catch (error) {
        this.$message.error(error)
      }
    },
  },
}
</script>
