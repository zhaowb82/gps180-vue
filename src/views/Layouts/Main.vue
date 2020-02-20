<template>
  <el-container>
    <el-header style="padding: 0;">
      <z-header></z-header>
    </el-header>
    <el-main style="padding: 0;">
      <transition name="fade" mode="out-in" appear>
        <router-view v-loading="showLoading"></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    zHeader: () => import('@/views/Layouts/components/Header'),
  },
  computed: {
    ...mapGetters(['showLoading']),
  },
}
</script>

<style>
</style>