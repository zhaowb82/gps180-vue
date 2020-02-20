<template>
  <el-container class="height" style="background-color: #f2f3f4;">
    <el-aside class="hidden-xs-only" style="width: 240px;">
      <el-menu :default-active="$route.path" class="height" @select="handleRouter">
        <template v-for="(menu, index) in menus">
          <el-menu-item :key="index" :index="menu.path">
            <z-icon :icon="menu.icon" style="margin-right:10px;padding-top:2px;"></z-icon>
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-main>
      <transition name="fade" mode="out-in" appear>
        <router-view></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['menuList']),
    menus() {
      const menus = [
        // {
        //   title: '设备类型',
        //   icon: 'el-icon-menu',
        //   path: '/system/deviceType',
        // }
      ]
      const path = '/' + this.$route.path.split('/')[1]
      this.menuList.map((e) => {
        if (e.url === path) {
          e.list.map((c) => {
            menus.push({
              title: c.name,
              icon: c.icon,
              path: c.url,
            })
          })
        }
      })
      return menus
    },
  },
  methods: {
    handleRouter(e) {
      if (e.substring(0, 4) === 'http') {
        window.open(e, '_blank')
      } else {
        this.$router.push(e)
      }
    },
  },
}
</script>
