<template>
  <div class="home-view">
    <EeHeader />
    <Guide :visible="guideVisible" @close="handleGuideConfirm" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router/composables'

import EeHeader from '@/components/common/EeHeader.vue'
import Guide from '@/components/common/CommonGuide.vue'

import { workItemApi } from '@/request/api'

const route = useRoute()

const guideVisible = ref(false)

const isWorkSpace = computed(() => {
  return route.name === 'HomeWorkspace'
})

const handleGuideConfirm = () => {
  guideVisible.value = false

  workItemApi.confirmNoNavigation({
    type: 1
  })
}

onMounted(() => {
  // 获取是否展示新手引导, type 1是切换应用，2是到迭代计划. ibase 只有这一个地方用，写死吧
  if (isWorkSpace.value) {
    workItemApi
      .getNavigation({
        type: 1
      })
      .then((res) => {
        if (res.code === 200) {
          guideVisible.value = res.data
        }
      })
  }
})
</script>

<style lang="scss" scoped>
.home-view {
  height: 100%;
  overflow: hidden;
}
</style>
