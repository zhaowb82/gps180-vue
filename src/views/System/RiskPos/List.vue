<template>
  <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" :scroll-wheel-zoom="true" class="bm-view">
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
    <bml-marker-clusterer :averageCenter="true">
      <bm-marker v-for="(marker, index) of markers" :key="index" 
              :icon="iconObj['online']" 
              :rotation="0" 
              :position="handleTransform(marker.longitude, marker.latitude)" 
              @click="handleClick(marker)">
        <bm-label :content="marker.imei" />
      </bm-marker>
    </bml-marker-clusterer>
    <!-- <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale> -->
  </baidu-map>
</template>

<script>
import { BmlMarkerClusterer } from 'vue-baidu-map'
export default {
  components: {
    BmlMarkerClusterer,
  },
  mounted() {
    this.init()
  },
  computed: {
    // ...mapGetters(['deviceList', 'lastP', 'currene']),
    markers() {
      let markers = this.riskPosList
      return markers
    },
  },
  data() {
    return {
      riskPosList: [],

      center: '中国',
      zoom: 5,
      iconObj: {
        online: {
          url: require('@/assets/images/car/car_blue.png'),
          size: {
            width: 20,
            height: 36,
          },
        },
        offline: {
          url: require('@/assets/images/car/car_gray.png'),
          size: {
            width: 20,
            height: 36,
          },
        }
      },
      mapStyle: {
        styleJson: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: {
              lightness: 10,
              saturation: -100,
            },
          },
        ],
      },
    }
  },
  methods: {
    async init() {
      try {
        const res = await this.$api.riskpos.getRiskPointList({})
        this.riskPosList = res.data
      } catch (error) {
        this.$message.error(error)
      }
    },
    handler({ map }) {
      this.map = map
    },
    handleTransform(lng, lat) { // 不用转
      return {
        lng,
        lat
      }
    },
  },
}
</script>

<style lang="scss">
.BMap_cpyCtrl {
  visibility: hidden !important;
}
.anchorBL {
  bottom: 0 !important;
}
.bm-view {
  width: 100%;
  height: calc(100vh - 60px);
  .info-window {
    font-size: 14px;
    ul {
      list-style: none;
      padding-left: 0;
    }
  }
}
.alarm-dialog {
  .el-dialog__body {
    padding: 0 20px 30px;
  }
}
.message-box {
  position: absolute;
  bottom: 5px;
  right: 300px;
}
.map-toolbar {
  position: absolute;
  bottom: 7px;
  right: 20px;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 定义blink类*/
.blink {
  color: teal;
  font-size: 18px;
  font-weight: bold;
  animation: blink 1s linear infinite;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 1s linear infinite;
  -moz-animation: blink 1s linear infinite;
  -ms-animation: blink 1s linear infinite;
  -o-animation: blink 1s linear infinite;
}
.z-fence-dialog {
  .el-dialog__body {
    padding: 10px 20px 30px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
}
.z-map-dialog {
  .el-dialog__header {
    padding: 20px;
  }
  .el-dialog__body {
    padding: 0;
    .map-area {
      box-shadow: inset 5em 1em #000000;
      position: relative;
      .tool-window {
        width: 200px;
        position: absolute;
        bottom: 20px;
        right: 20px;
        .button {
          font-size: 20px;
        }
        .step {
          font-size: 16px;
          padding-top: 13px;
        }
      }
    }
  }
  .dialog-map-view {
    width: 100%;
    height: 70vh;
    &.map-full {
      height: calc(100vh - 65px);
    }
  }
}
</style>