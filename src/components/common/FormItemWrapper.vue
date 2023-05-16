<template>
  <div class="form-item-wrapper">
    <slot :change="change" :blur="blur" />
  </div>
</template>

<script>
import emitter from 'element-ui/lib/mixins/emitter'

export default {
  mixins: [emitter],
  props: {
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    change(val) {
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val])
        this.$emit('change', val)
      }
    },
    blur(val) {
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [val])
        this.$emit('blur', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
