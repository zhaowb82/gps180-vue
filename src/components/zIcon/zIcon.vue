<template>
  <svg :class="svgClass" :style="svgStyles" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'zIcon',
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: null,
    },
  },
  computed: {
    iconName() {
      return `#icon-icon-${this.icon}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    svgStyles() {
      const { color } = this
      let styles = {}

      color && (styles.color = color)
      return styles
    },
  },
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.z-icon-menu {
  width: 1.4em;
  height: 1.4em;
  vertical-align: -0.38em;
  margin-right: 16px;
}
.z-icon-total-panel {
  font-size: 28px;
}
</style>
