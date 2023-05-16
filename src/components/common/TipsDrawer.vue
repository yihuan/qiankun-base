<template>
  <el-drawer
    :visible="visible"
    :size="drawerSize"
    custom-class="tips-drawer"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal="false"
    @close="handleClose"
  >
    <img class="img-working" :src="workingUrl" alt="Happey working" />
    <div class="content">
      <h2 class="content-title">亲爱的用户，您好：</h2>

      <div class="content-body">
        <div class="left">
          <div class="content-body__item">
            感谢您对新版xxx的使用和支持！ 如使用中遇到问题，辛苦您填写
            <span class="link" @click="handleFeedback">问题反馈</span>
            ，我们将第一时间联系您并尽快优化。
          </div>

          <div class="content-body__item">
            如对新版体验不畅可选择
            <BackToVersion
              type="link"
              :hide-info="true"
              @click="handleGoToOld"
            />
            进行使用。
          </div>

          <div class="content-body__item">
            我们会持续改进并完善平台体验，诚邀您体验新版！
          </div>
        </div>
        <img class="img-rocket" :src="rocketUrl" alt="Upgrading" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import BackToVersion from '@/components/BackToVersion.vue'
import { FEEDBACK_OPERATION } from '@/constants/common.const'
import { reportFeedback } from '@/request/apis/tip.api'

const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:visible', 'input', 'close'])

const drawerSize = '500px'
const workingUrl =
  'https://j1.58cdn.com.cn/arthurupload/teg/yunxiao/static/images/working.png'
const rocketUrl =
  'https://j1.58cdn.com.cn/arthurupload/teg/yunxiao/static/images/rocket.png'
const visible = ref(false)

watchEffect(() => {
  visible.value = props.value
})

function handleFeedback() {
  visible.value = false
  reportFeedback(FEEDBACK_OPERATION.FEEDBACK)
  window.open('https://survey.58.com/?id=1035423&hash=z411', '_blank')
}

function handleGoToOld() {
  visible.value = false
  reportFeedback(FEEDBACK_OPERATION.RETURN_OLD)
}

function handleClose() {
  visible.value = false
  emit('input', false)
  emit('close')
  reportFeedback(FEEDBACK_OPERATION.CLOSED)
}
</script>

<style lang="scss" scoped>
$img-working-width: 100px;
$img-rocket-width: 100px;

:global(.tips-drawer.el-drawer.rtl) {
  height: 250px;
  top: unset;
  right: 48px;
  bottom: $base-gap * 2;
  background-color: #e7f7ff;
}

:deep(.el-drawer__header) {
  margin-bottom: $base-gap * 2;
  padding: $base-gap * 2 0 0 0;
}

.img-working {
  width: $img-working-width;
  position: absolute;
  top: $base-gap * 2;
}

.content {
  position: relative;
  margin-left: $img-working-width;

  &-title {
    margin-bottom: $base-gap * 4;
  }

  &-body {
    display: flex;

    .left {
      position: relative;

      .content-body__item {
        font-size: 12px;
        line-height: 1.5;

        &:nth-of-type(2) {
          margin: $base-gap * 4 0;
        }

        .link {
          color: $primary-color;
          cursor: pointer;
        }
      }
    }
  }

  .img-rocket {
    width: $img-rocket-width;
  }
}
</style>
