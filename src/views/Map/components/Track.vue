<template>
  <el-dialog title="设备跟踪" :visible="visible" top="5vh" custom-class="z-map-dialog" :fullscreen="fullscreen" @close="handleClose" append-to-body destroy-on-close>
    <button type="button" class="el-dialog__headerbtn" style="margin-right: 30px;" @click="handleDialogFullscreen"><i class="el-dialog__close el-icon" :class="fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'"></i></button>
    <div class="map-area" v-loading="listLoading">
      <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" :scroll-wheel-zoom="true" class="dialog-map-view" :class="{'map-full':fullscreen}">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
        <bm-marker v-if="currentPosition" :icon="icons.carIcon" :rotation="currentPosition.direction" :position="handleTransform(currentPosition.longitude, currentPosition.latitude)" :z-index="1">
        </bm-marker>
      </baidu-map>
      <el-card class="tool-window" style="width: 270px;text-align:center;">
        <div style="margin-bottom: 20px;">
          频率：<el-input-number v-model="rate" :precision="0" :min="1000" :max="10000" step-strictly :step="1000" style="width: 150px;"></el-input-number> 毫秒
        </div>
        <div>
          <el-button v-if="trackTimer" type="warning" @click="handleStop">停止</el-button>
          <el-button v-else type="primary" @click="handleTiming">开始</el-button>
        </div>
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    imei: {
      type: String,
      required: true
    },
    location: {
      type: Object,
      default: () => {
        return null
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    location: {
      handler(value) {
        this.center = value
      },
      immediate: true
    },
    rate() {
      if (this.trackTimer) {
        clearInterval(this.trackTimer)
        this.handleTiming()
      }
    }
  },
  data() {
    return {
      center: '中国',
      zoom: 18,
      listLoading: false,
      icons: {
        carIcon: {
          url: require('@/assets/images/car/car_blue.png'),
          size: {
            width: 20,
            height: 36,
          },
        },
        startIcon: {
          url: require('@/assets/images/car/start_icon.png'),
          size: {
            width: 25,
            height: 38,
          }
        },
        endIcon: {
          url: require('@/assets/images/car/end_icon.png'),
          size: {
            width: 25,
            height: 38,
          }
        },
      },
      polylinePath: [],
      trackTimer: null,
      rate: 5000,
      lstQueryTime: 0,
      currentPosition: null,
      fullscreen: false
    }
  },
  destroyed() {
    clearInterval(this.trackTimer)
  },
  methods: {
    handler() { },
    handleTiming() {
      this.trackTimer = setInterval(() => {
        this.getLastPositionByImei(this.lstQueryTime)
      }, this.rate)
    },
    handleStop() {
      clearInterval(this.trackTimer)
      this.trackTimer = null
    },
    handleDialogFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    handleTransform(lng, lat) {
      const location = this.$trans.wgs2bd(lng, lat)
      return {
        lng: location[0],
        lat: location[1],
      }
    },
    getLastPositionByImei(time) {
      const query = {
        deviceids: this.imei,
        lastQueryPositionTime: time,
      }
      this.$api.device.getLastPosition(query).then((res) => {
        if (res.code === 0 && res.data && res.data.length === 1) {
          const position = this.handleTransform(res.data[0].longitude, res.data[0].latitude)
          this.center = position
          this.currentPosition = res.data[0]
        }
      })
      this.lstQueryTime = this.$datetime.UTC()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
