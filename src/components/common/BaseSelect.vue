<template>
  <el-select
    v-model="selected"
    :placeholder="placeholder"
    popper-class="base-select"
    :multiple="multiple"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    @change="handleChange"
  >
    <el-option
      v-for="o in options"
      :key="o[prop.value]"
      :label="o[prop.label]"
      :value="o[prop.value]"
    ></el-option>
  </el-select>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: String,
  multiple: Boolean,
  disabled: Boolean,
  clearable: Boolean,
  size: {
    type: String,
    default: 'mini'
  },
  prop: {
    type: Object,
    default: () => ({ label: 'label', value: 'value' })
  }
})
const emit = defineEmits(['input', 'change'])

const selected = ref('')

watchEffect(() => {
  selected.value =
    props.multiple === false && Array.isArray(props.value)
      ? props.value[0]
      : props.value
})

function handleChange(event) {
  emit('input', event)
  emit('change', event)
}
</script>

<style lang="scss">
.base-select {
  &.el-popper[x-placement^='bottom'] {
    margin-top: 0;
  }

  .popper__arrow {
    display: none;
  }
}
</style>
