<template>
  <el-drawer
    custom-class="ee-base__drawer"
    :visible.sync="visible"
    :direction="direction"
    :destroy-on-close="true"
    :show-close="showClose"
    :wrapper-closable="wrapperClosable"
    :modal="modal"
    :append-to-body="appendToBody"
    :size="size"
    :before-close="beforeClose"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  direction: String,
  modal: Boolean,
  showClose: Boolean,
  wrapperClosable: Boolean,
  appendToBody: Boolean,
  size: {
    type: String,
    default: '600px'
  },
  beforeClose: {
    type: Function,
    default: () => {}
  }
})

const visible = ref(false)
watch(
  () => props.visible,
  (val) => {
    visible.value = val
  }
)
</script>

<style lang="scss">
.el-drawer__wrapper .el-drawer__container .ee-base__drawer {
  &.el-drawer {
    padding-left: 0px;
    box-shadow: 0 8px 10px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .el-drawer__header {
      padding: 14px 24px;
      padding-bottom: 0;
      margin-bottom: 32px;
      border: none;
      box-shadow: none;
    }
    .el-drawer__body {
      box-shadow: none;
      padding: 0px;
    }
  }
}
</style>
