<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  // watch: {
  //   '$store.getters.showLoading'(value) {
  //     if (value) {
  //       this.loading = this.$loading({
  //         lock: true,
  //         text: 'Loading',
  //         spinner: 'el-icon-loading',
  //         background: 'rgba(0, 0, 0, 0.7)',
  //       })
  //     } else {
  //       this.loading.close()
  //     }
  //   },
  // },
  data() {
    return {
      loading: false,
    }
  }
}
</script>

<style lang="scss">
/*Loader*/
.preloader-it {
  background: #ffffff;
  position: fixed;
  z-index: 10001;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.loader-pendulums {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  margin: 0 auto;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 4rem;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 0.1em solid #e1e1e1;
  &:before,
  &:after {
    content: '';
    width: 1em;
    height: 1em;
    left: -0.1em;
    top: -0.1em;
    padding: 0.1em;
    display: block;
    border-radius: 50%;
    position: absolute;
    -webkit-transform-origin: center center;
    transform-origin: center center;
    border: 0.1em solid;
    border-color: #f1f1f1 transparent transparent transparent;
    -webkit-animation: pendulum infinite 2s cubic-bezier(0.3, 1.65, 0.7, -0.65);
    animation: pendulum infinite 2s cubic-bezier(0.3, 1.65, 0.7, -0.65);
  }
  &:before {
    border-color: #555555 transparent transparent transparent;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
    -webkit-animation-name: pendulum2;
    animation-name: pendulum2;
  }
}

@-webkit-keyframes pendulum {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

@keyframes pendulum {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
@-webkit-keyframes pendulum2 {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(520deg);
  }
}
@keyframes pendulum2 {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(520deg);
  }
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
.height {
  height: calc(100vh - 60px);
}
</style>
