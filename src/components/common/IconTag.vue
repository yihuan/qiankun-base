<template>
  <el-tag class="icon-tag" @click="$emit('click')">
    <i :class="iconClasses"></i>
    <i class="icon-tag__text">{{ text }}</i>
  </el-tag>
</template>
<script>
export default {
  name: 'IconTag',
  props: {
    iconClass: {
      type: String
    },
    iconColor: {
      type: String,
      default: '#1B1C1E'
    },
    iconfont: {
      type: Boolean,
      default: true
    },
    text: {
      type: String
    }
  },
  emits: ['click'],
  computed: {
    iconClasses() {
      return [this.iconfont ? 'iconfont' : '', 'icon-tag__icon', this.iconClass]
    }
  }
}
</script>
<style lang="scss">
.icon-tag.el-tag {
  cursor: pointer;
  background-color: #ffffff;
  color: rgba(27, 28, 30, 1);
  border: 1px solid rgba(228, 231, 237, 1);
  border-radius: 4px;
  font-size: 0px;

  .icon-tag__icon {
    color: v-bind(iconColor) !important;
    vertical-align: middle;
  }

  .icon-tag__text {
    line-height: 30px;
    padding-left: 8px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    vertical-align: middle;
  }
}
</style>
