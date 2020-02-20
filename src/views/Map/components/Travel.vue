<template>
  <el-dialog title="轨迹查看" :visible="visible" top="5vh" custom-class="z-map-dialog" :fullscreen="fullscreen" @close="handleClose" append-to-body destroy-on-close>
    <button type="button" class="el-dialog__headerbtn" style="margin-right: 30px;" @click="handleDialogFullscreen"><i class="el-dialog__close el-icon" :class="fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'"></i></button>
    <div class="map-area" v-loading="listLoading">
      <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" :scroll-wheel-zoom="true" class="dialog-map-view" :class="{'map-full':fullscreen}">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
        <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
        <bm-marker v-if="polylinePath.length>1" :position="polylinePath[0]" :offset="{width: 0, height: -19}" :icon="icons.startIcon"></bm-marker>
        <bm-marker v-if="polylinePath.length>0 && (polylinePath.length === list.length)" :position="polylinePath[list.length-1]" :offset="{width: 0, height: -19}" :icon="icons.endIcon"></bm-marker>
        <bm-marker v-if="polylinePath.length !== list.length" :icon="icons.carIcon" :rotation="currentPosition.course" :position="handleTransform(currentPosition.longitude, currentPosition.latitude)" :z-index="1">
        </bm-marker>
        <bm-polyline :path="polylinePath" stroke-color="teal" :stroke-opacity="0.7" :stroke-weight="5" stroke-style="dashed"></bm-polyline>
        <bm-polyline :path="travelPath" stroke-color="teal" :stroke-opacity="0.3" :stroke-weight="8"></bm-polyline>
      </baidu-map>
      <el-card class="tool-window" style="width: 300px;">
        <el-date-picker v-model="dateRange" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions" style="width: 170px;">
        </el-date-picker>
        <el-button style="margin-left:10px;" type="primary" @click="getList">查询</el-button>
        <div style="margin: 20px 0;">
          播放速度：<el-input-number v-model="playSpeed" :precision="0" :min="1000" :max="5000" step-strictly :step="1000" style="width: 150px;"></el-input-number> 毫秒
        </div>
        <div v-if="currentPosition" style="margin-bottom: 20px;">
          轨迹时间：{{currentPosition.deviceTime}}
        </div>
        <el-row :gutter="10" style="text-align:center;">
          <el-col :span="8">
            <el-button class="button" icon="el-icon-video-play" @click="handlePlay"></el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="button" icon="el-icon-video-pause" @click="handlePause"></el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="button" icon="el-icon-refresh" @click="handleRefresh"></el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="text-align:center;margin-top:20px;">
          <el-col :span="8">
            <el-button class="button" :disabled="currentStep === 0" icon="el-icon-d-arrow-left" @click="handlePrev"></el-button>
          </el-col>
          <el-col :span="8">
            <div class="step">{{list.length>0?currentStep+1:0}}/{{list.length}}</div>
          </el-col>
          <el-col :span="8">
            <el-button class="button" :disabled="(currentStep === list.length-1) || list.length === 0" icon="el-icon-d-arrow-right" @click="handleNext"></el-button>
          </el-col>
        </el-row>
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
    dateRange(value) {
      this.handleReset()
      if (value) {
        this.listQuery.startTime = `${value} 00:00:00`
        this.listQuery.endTime = `${value} 23:59:59`
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
    imei: {
      handler(value) {
        this.listQuery.imei = value
      },
      immediate: true
    },
    location: {
      handler(value) {
        this.center = value
      },
      immediate: true
    },
    currentPosition: {
      handler(value) {
        if (value) {
          const position = this.handleTransform(value.longitude, value.latitude)
          this.center = position
          this.polylinePath.push(position)
        }
      },
      deep: true
    }
  },
  data() {
    return {
      center: '中国',
      zoom: 18,
      dateRange: '',
      playSpeed: 1000,
      listQuery: {
        imei: '',
        startTime: '',
        endTime: '',
        withStop: false,
        withPos: true,
        withTrip: false
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      listLoading: false,
      list: [],
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
      currentStep: 0,
      currentPosition: null,
      stepInterval: null,
      polylinePath: [],
      travelPath: [],
      fullscreen: false
    }
  },
  methods: {
    handler() { },
    getList() {
      this.handleReset()
      if (!this.dateRange) {
        this.$message.warning('请先选择查询轨迹日期！')
        return
      }
      this.listLoading = true
      this.$api.report
        .getTravelInfoList(this.listQuery)
        .then((res) => {
          if (res.code === 0) {
            this.list = res.data.positions
            const positions = res.data.positions
            if (positions.length > 0) {
              this.list = positions
              this.currentPosition = positions[0]
              let travelPath = []
              positions.map(e => {
                const position = this.handleTransform(e.longitude, e.latitude)
                travelPath.push(position)
              })
              this.travelPath = travelPath
            } else {
              this.$message.warning('该日期设备没有轨迹！')
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        .finally(() => (this.listLoading = false))
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
    handlePlay() {
      const total = this.list.length - 1
      this.stepInterval = setInterval(() => {
        if (this.currentStep < total) {
          this.currentStep++
          this.currentPosition = this.list[this.currentStep]
        } else {
          this.handlePause()
        }
      }, this.playSpeed)
    },
    handlePause() {
      clearInterval(this.stepInterval)
    },
    handleRefresh() {
      this.currentStep = 0
      this.currentPosition = this.list[0]
      this.polylinePath.splice(0, this.polylinePath.length)
    },
    handlePrev() {
      const total = this.list.length - 1
      if (this.currentStep > 0 && this.currentStep <= total) {
        this.currentStep--
      }
      this.polylinePath.splice(this.currentStep, this.polylinePath.length)
      this.currentPosition = this.list[this.currentStep]
    },
    handleNext() {
      const total = this.list.length - 1
      if (this.currentStep < total) {
        this.currentStep++
      }
      this.currentPosition = this.list[this.currentStep]
    },
    handleReset() {
      this.list = []
      this.polylinePath = []
      this.travelPath = []
      this.center = this.location
      this.currentStep = 0
      this.stepInterval = null
      this.currentPosition = null
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>