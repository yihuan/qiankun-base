<template>
  <el-drawer
    :visible.sync="visible"
    :size="drawerSize"
    custom-class="nps-view"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal="false"
    :wrapper-closable="false"
    @close="close"
  >
    <template #title>
      <span class="title">
        您愿意将
        <span class="project-name">xxx</span>
        的使用经验/体验分享推荐给身边的同事吗？
      </span>
    </template>
    <iframe
      class="nps-container"
      :src="url"
      width="101%"
      :height="iframeHeight"
    />
  </el-drawer>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { MutationType } from 'pinia'
import { Message } from '@/utils/message.util'
import { error } from '@/utils/log.util'
import thirdPartyApi from '@/request/apis/third-party.api'
import { useNpsStore } from '@/stores/nps.store'

const emit = defineEmits(['close'])

const drawerSize = '600px'
const iframeHeight = '335px'
const visible = ref(false)
const url = ref('')
const npsTimer = ref(null)
const npsStore = useNpsStore()

npsStore.$subscribe((mutation, state) => {
  if (mutation.type === MutationType.patchObject) {
    clearTimer()

    if (state.delay) {
      npsTimer.value = setTimeout(() => {
        getSurveyUrl(state.scene)
      }, Number(state.delay) * 1000)
    } else {
      if (state.scene) {
        getSurveyUrl(state.scene)
      }
    }
  }
})

onMounted(() => {
  window.addEventListener('message', (event) => {
    if (event.data.isSubmitted) {
      Message.success('成功提交问卷，感谢您的反馈')
      close()
    }
  })
})

onUnmounted(() => {
  clearTimer()
})

function clearTimer() {
  if (npsTimer.value) {
    clearTimeout(npsTimer.value)
    npsTimer.value = null
  }
}

function getSurveyUrl(scene) {
  thirdPartyApi
    .getNpsLink(scene)
    .then((res) => {
      const data = res.data
      if (data?.visible && data?.url) {
        url.value = data.url
        visible.value = true
      }
    })
    .catch((err) => {
      error(err)
      visible.value = false
    })
}

function close() {
  emit('close')
  visible.value = false
}
</script>

<style lang="scss">
:global(.nps-view.el-drawer__wrapper) {
  top: unset;
  left: unset;
  width: 675px;
  height: 375px;
}
:deep(.nps-view.el-drawer.rtl) {
  min-height: 240px;
  max-height: 350px;
  top: unset;
  right: 48px;
  bottom: $base-gap * 2;
  background-color: #e7f7ff;
  border-radius: 4px;

  .el-drawer__header {
    margin-bottom: $base-gap * 4;
    margin: 0;
    padding: $base-gap * 4;
    background-color: #ffffff;

    .title {
      color: $font-color;
      font-size: 14px;
      font-weight: 600;

      .project-name {
        color: $required-color;
      }
    }
  }

  .el-drawer__body {
    height: v-bind(iframeHeight);
    overflow: hidden;
    background-color: #ffffff;

    .nps-container {
      margin-top: -40px;
    }
  }
}
</style>
