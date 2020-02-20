<template>
  <el-card>
    <!-- <div class="z-table-control">
      <el-tabs v-model="activeTab" @tab-click="handleSelectTab">
        <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.label" :name="tab.name"></el-tab-pane>
      </el-tabs>
    </div> -->
    <transition name="fade" mode="out-in" appear>
      <component :is="currentComponent"></component>
    </transition>
  </el-card>
</template>

<script>
export default {
  components: {
    AllList: () => import('./Lists/All'),
    TelList: () => import('./Lists/Tel'),
    RechargeList: () => import('./Lists/Recharge'),
  },
  data() {
    return {
      currentComponent: 'all-list',
      activeTab: 'all',
      tabs: [
        {
          label: '全部报警',
          name: 'all',
        },
        {
          label: '电话报警',
          name: 'tel',
        },
        {
          label: '充值记录',
          name: 'recharge',
        },
      ],
    }
  },
  methods: {
    handleSelectTab(e) {
      this.currentComponent = `${e.name}-list`
    },
  },
}
</script>
