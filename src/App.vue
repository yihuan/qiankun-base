<template>
  <div v-show="baseVisible" id="baseApp">
    <router-view />
    <TipsDrawer v-model="tipsVisible" />
    <NpsView />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, computed } from 'vue'
import TipsDrawer from '@/components/common/TipsDrawer.vue'
import NpsView from './components/common/NpsView.vue'
import { showTip } from '@/request/apis/tip.api'
import { useTimeoutFn } from '@vueuse/core'

import { isMobile } from '@/utils/client.util'

const tipsRunInMins = 10 * 60 * 1000 // 10 mins
const tipsVisible = ref(false)

const baseVisible = computed(() => {
  return !isMobile
})

const { stop } = useTimeoutFn(() => {
  showTip().then((res) => {
    tipsVisible.value = !!res?.data
  })
}, tipsRunInMins)

onBeforeUnmount(stop)
</script>

<style lang="scss">
#baseApp {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: $font-size;
}
</style>
