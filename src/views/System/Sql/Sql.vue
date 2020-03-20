<template>
  <el-card class="z-frame-area" style="height: 100%;">
    <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
  </el-card>
</template>

<script>
export default {
  mounted () {
    // console.log('111', window.location)
    this.url = window.location.protocol + '//' + window.location.host + '/api/druid/sql.html'
    console.log('222', this.url)
  },
  data() {
    return {
      url: '',
    }
  },
}
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
