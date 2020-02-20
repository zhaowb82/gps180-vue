<template>
  <el-card>
    <div class="z-table-control">
      <el-tabs v-model="activeTab" @tab-click="handleSelectTab">
        <el-tab-pane v-for="(tab, index) in tabs" :key="index" :label="tab.label" :name="tab.name"></el-tab-pane>
      </el-tabs>
    </div>
    <transition name="fade" mode="out-in" appear>
      <component :is="currentComponent"></component>
    </transition>
  </el-card>
</template>

<script>
export default {
  components: {
    CommandList: () => import('./Lists/Command'),
    LocationList: () => import('./Lists/Location'),
    StopList: () => import('./Lists/Stop'),
    AccList: () => import('./Lists/Acc'),
    VoiceList: () => import('./Lists/Voice'),
    MileageList: () => import('./Lists/Mileage'),
  },
  data() {
    return {
      currentComponent: 'command-list',
      activeTab: 'command',
      tabs: [
        {
          label: '命令报表',
          name: 'command',
        },
        {
          label: '位置报表',
          name: 'location',
        },
        {
          label: '里程详单',
          name: 'mileage',
        },
        {
          label: '停留详单',
          name: 'stop',
        },
        // {
        //   label: 'ACC报表',
        //   name: 'acc',
        // },
        // {
        //   label: '语音报表',
        //   name: 'voice',
        // },
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
