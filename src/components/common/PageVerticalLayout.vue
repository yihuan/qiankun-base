<template>
  <div class="page-vertical-layout">
    <div class="page-header row-between">
      <div v-if="$slots.title" class="page-header__title-slot">
        <slot name="title" />
      </div>
      <div v-else class="page-header__title">{{ title }}</div>
      <div class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>
    <div id="pageContent" class="page-content">
      <slot />
    </div>
    <div v-if="$slots.footer" class="page-footer" :style="footerBorder">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, computed } from 'vue'
import debounce from 'lodash/debounce'
import variables from '@/assets/styles/var.scss'

const props = defineProps({
  title: {
    type: String
  },
  footerBorder: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['height-update'])

const observer = ref(null)

const footerBorder = computed(() => ({
  borderTop: props.footerBorder ? `1px solid ${variables.borderColor}` : 'none'
}))

const emitHeight = debounce((height) => {
  emit('height-update', height)
})

onMounted(() => {
  const contentDiv = document.getElementById('pageContent')
  observer.value = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const height = Math.floor(entry.contentRect.height)
      emitHeight(height)
    }
  })
  observer.value.observe(contentDiv)
})

onUnmounted(() => {
  observer.value.disconnect()
})
</script>

<style lang="scss" scoped>
$header-height: 80px;
$footer-height: 64px;

.page-vertical-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 $base-gap * 5 0 $base-gap * 5;

  .page-header {
    height: $header-height;

    .page-header__title {
      color: #1b1c1e;
      font-size: 20px;
      line-height: 26px;
    }

    .page-header__title-slot {
      display: flex;
      align-items: center;
      @extend .page-header__title;
    }

    .page-header__actions {
      display: flex;
      align-items: center;

      & > *:not(:last-child) {
        margin-right: $base-gap * 4;
      }
    }
  }

  .page-content {
    flex: 1;
    overflow: auto;
  }

  .page-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 $footer-height;
  }
}
</style>
