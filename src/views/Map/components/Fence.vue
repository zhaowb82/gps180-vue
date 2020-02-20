<template>
  <div class="map-area">
    <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" :scroll-wheel-zoom="true" class="dialog-map-view" :class="{'map-full':$parent.fullscreen}">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
    </baidu-map>
    <el-card class="tool-window">
      <el-button>画区域</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: '中国',
      zoom: 10,
    }
  },
  methods: {
    handler() { }
  }
}
</script>

<style lang="scss">
</style>