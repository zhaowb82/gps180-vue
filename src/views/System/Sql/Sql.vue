<template>
  <el-card class="z-frame-area" style="height: 100%;">
    <iframe src="http://wibim.vicp.net:8089/api/druid/sql.html" frameborder="0" width="100%" height="100%"></iframe>
  </el-card>
</template>

<script>
export default {}
</script>

<style lang="scss">
.z-frame-area {
  width: 100%;
  height: 100%;
  .el-card__body {
    height: 100%;
  }
}
</style>
