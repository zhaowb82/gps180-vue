<template>
  <el-dialog title="编辑围栏" :visible="dialogVisible" custom-class="z-map-dialog" :fullscreen="fullscreen" append-to-body @close="handleClose" destroy-on-close>
    <button type="button" class="el-dialog__headerbtn" style="margin-right: 30px;" @click="fullscreen = !fullscreen"><i class="el-dialog__close el-icon" :class="fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen'"></i></button>
    <div class="map-area">
      <baidu-map :center="center" :zoom="zoom" @ready="handler" :map-click="false" @click="handleClick" :scroll-wheel-zoom="true" class="dialog-map-view" :class="{'map-full':fullscreen}">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
        <!-- <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale> -->
        <bm-circle v-if="circleInfo" :center="circleInfo.center" :radius="circleInfo.radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCircleInfo" editing></bm-circle>
        <bm-polygon v-if="polygonPath.length>0" :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" editing @lineupdate="updatePolygonPath" />
      </baidu-map>
      <el-card class="tool-window" style="width: 300px;">
        <el-form label-width="70px">
          <el-form-item label="围栏名称">
            <el-input size="small" v-model="name" placeholder="请输入围栏名称"></el-input>
          </el-form-item>
          <el-form-item label="围栏样式">
            <el-radio-group v-model="drawType" size="small">
              <el-radio-button label="0">圆 形</el-radio-button>
              <el-radio-button label="1">多边形</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" size="small" @click="handleClear">清除图形</el-button>
            <el-button type="primary" size="small" @click="handleSave">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editFence: {
      type: Object,
      default() {
        return null
      }
    }
  },
  watch: {
    visible(value) {
      value && (this.dialogVisible = true)
    },
    drawType(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.circleInfo = null
        this.polygonPath = []
      }
    },
    editFence(value) {
      if (value) {
        this.name = value.name
        const area = this.areaFomart(value.area)
        console.log(area)
        if (area.type === 'CIRCLE') {
          this.drawType = '0'
          this.circleInfo = {
            center: area.path[0],
            radius: Number(area.path[1])
          }
          this.center = area.path[0]
          this.zoom = 12
        }
        if (area.type === 'POLYGON') {
          this.drawType = '1'
          this.polygonPath = area.path
          const center = this.getCenterPoint(area.path)
          console.log(center)
          this.center = center
          this.zoom = 12
        }
        // this.drawType = value.area.split(' ')[0] === 'CIRCLE' ? '0' : '1'
        // const
      } else {
        this.name = ''
        this.drawType = '0'
        this.circleInfo = null
        this.polygonPath = []
      }
    }
  },
  data() {
    return {
      center: '中国',
      zoom: 12,
      dialogVisible: false,
      fullscreen: false,
      name: '',
      drawType: '0',
      circleInfo: null,
      polygonPath: [],
      map: null
    }
  },
  methods: {
    handler(e) {
      this.map = e.map
    },
    handleSave() {
      if (!this.name) {
        this.$message.error('请输入围栏名称')
        return
      }
      if (!this.circleInfo && this.polygonPath.length === 0) {
        this.$message.error('请画出围栏范围')
        return
      }
      const data = {
        name: this.name,
        area: null,
        icon: ''
      }
      if (this.drawType === '0') {
        const center = this.circleInfo.center
        const radius = this.circleInfo.radius
        const p = this.$trans.bd2wgs(center.lng, center.lat)
        data.area = `CIRCLE (${p[1]} ${p[0]}, ${radius})`
        data.icon = 'el-icon-place'
      } else if (this.drawType === '1') {
        const path = this.polygonPath
        const pathArr = []
        path.forEach(item => {
          const p = this.$trans.bd2wgs(item.lng, item.lat)
          pathArr.push(`${p[1]} ${p[0]}`)
        })
        data.area = `POLYGON ((${pathArr.join(', ')}))`
        data.icon = 'el-icon-map-location'
      }
      if (this.editFence) {
        const postData = {
          ...this.editFence,
          name: data.name,
          area: data.area
        }
        this.$api.device.updateFence(postData).then(res => {
          if (res.code === 0) {
            this.$message.success('编辑围栏成功！')
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$api.device.saveFence(data).then(res => {
          if (res.code === 0) {
            this.$message.success('新增围栏成功！')
            this.handleClose()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 围栏数据转换
    areaFomart(area) {
      // eslint-disable-next-line
      const point = area.match(/[^\(\)]+(?=\))/g)[0].split(', ')
      if (area.match('CIRCLE')) {
        const p = this.$trans.wgs2bd(point[0].split(' ')[1], point[0].split(' ')[0])
        return {
          type: 'CIRCLE',
          path: [{ lng: p[0], lat: p[1] }, point[1]]
        }
      }
      if (area.match('POLYGON')) {
        const path = []
        point.forEach(item => {
          const p = this.$trans.wgs2bd(item.split(' ')[1], item.split(' ')[0])
          path.push({ lng: p[0], lat: p[1] })
        })
        return {
          type: 'POLYGON',
          path: path
        }
      }
    },
    // 获取多边形围栏中心点
    getCenterPoint(path) {
      let lng = 0.0
      let lat = 0.0

      for (let i = 0; i < path.length; i++) {
        lng = lng + parseFloat(path[i].lng)
        lat = lat + parseFloat(path[i].lat)
      }
      lng = lng / path.length
      lat = lat / path.length
      return { lng, lat }
    },
    handleClear() {
      this.map.clearOverlays()
      this.circleInfo = null
      this.polygonPath = []
    },
    handleClose() {
      this.map = null
      this.dialogVisible = false
      this.fullscreen = false
      this.$emit('close')
    },
    handleClick(e) {
      if (this.drawType === '0') {
        this.circleInfo = {
          center: e.point,
          radius: 5000
        }
      } else {
        this.polygonPath.push(e.point)
      }
    },
    updatePolygonPath(e) {
      this.polygonPath = e.target.getPath()
    },
    updateCircleInfo(e) {
      this.circleInfo.center = e.target.getCenter()
      this.circleInfo.radius = e.target.getRadius()
    }
  }
}
</script>

<style lang="scss">
</style>