<template>
  <el-popover
    v-model="visible"
    :placement="placement"
    :popper-class="popperClasses"
    :title="title"
    :width="width"
    :trigger="trigger"
    :visible-arrow="visibleArrow"
    :disabled="disabled"
    :content="content"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    @show="handleShow"
    @hide="handleHide"
  >
    <slot v-if="!!$slots.title" name="title" />
    <slot />
    <template #reference>
      <slot name="reference" />
    </template>
  </el-popover>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { TRIGGERS } from '@/constants/elementui.const'

const props = defineProps({
  value: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  popperClass: {
    type: String
  },
  title: {
    type: String
  },
  placement: {
    type: String,
    default: 'bottom'
  },
  visibleArrow: {
    type: Boolean,
    default: false
  },
  content: {
    type: String
  },
  width: {
    type: [String, Number]
  },
  openDelay: {
    type: Number
  },
  closeDelay: {
    type: Number,
    default: 200
  },
  trigger: {
    type: String,
    default: 'click',
    validator: (val) => TRIGGERS.includes(val)
  }
})
const emit = defineEmits(['input', 'show', 'hide', 'visible'])

const visible = ref(false)

const popperClasses = computed(() => {
  return `popover-info ${props.popperClass || ''}`
})

watchEffect(() => {
  visible.value = props.value
})

function handleShow() {
  emit('input', true)
  emit('visible', true)
  emit('show')
}

function handleHide() {
  emit('input', false)
  emit('visible', false)
  emit('hide')
}

function show() {
  visible.value = true
}

function hide() {
  visible.value = false
}

defineExpose({
  show,
  hide
})
</script>

<style lang="scss"></style>
