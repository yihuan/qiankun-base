<template>
  <div id="subapp-viewport" />
</template>

<script setup>
import { onMounted } from 'vue'
import { start } from 'qiankun'
import { ALLOW_COOKIE_SUB_APPS } from '@/constants/app.const'

onMounted(() => {
  if (!window.qiankunStarted) {
    window.qiankunStarted = true
    start({
      prefetch: false,
      fetch(url, ...args) {
        // 指定的微应用允许携带 cookie
        if (
          process.env.NODE_ENV === 'production' &&
          ALLOW_COOKIE_SUB_APPS.some((path) => url.includes(path))
        ) {
          return window.fetch(url, {
            ...args,
            mode: 'cors',
            credentials: 'include'
          })
        }

        return window.fetch(url, ...args)
      }
    })
  }
})
</script>

<style lang="scss">
#subapp-viewport {
  // position: relative;
  // z-index: 1;
  width: 100%;
  height: calc(100% - $header-height);

  & > div {
    height: 100%;
    overflow-y: auto;
  }
  // irepo样式
  .irepo-wrapper {
    .el-table {
      tr th {
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
      }
    }
    a {
      text-decoration: none;
    }
  }
}
</style>
