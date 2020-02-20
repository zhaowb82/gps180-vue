<template>
  <el-container>
    <el-aside class="z-aside hidden-xs-only" style="padding: 0;">
      <device-list></device-list>
    </el-aside>
    <div class="hidden-sm-and-up"></div>
    <el-main style="padding: 0;">
      <map-area></map-area>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  watch: {
    dialogVisible(value) {
      !value && (this.fullscreen = false)
    }
  },
  components: {
    MapArea: () => import('./Map'),
    DeviceList: () => import('./DeviceList')
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['setAllDeviceList', 'setAllGroupList']),
    async init() {
      await this.setAllGroupList()
      await this.setAllDeviceList()
    }
  },
}
</script>