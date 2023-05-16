<template>
  <div class="simpleSelect">
    <el-select v-model="selected" :popper-append-to-body="false">
      <el-option
        v-for="item in selectList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        {{ item.label }}
        <!-- <span class="check">
          <el-checkbox :value="selected === item.value"></el-checkbox>
        </span> -->
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch, watchEffect } from 'vue'

const props = defineProps({
  //selectList：{label: 展示的字段名, value：字段值}
  selectList: {
    type: Array,
    default: () => []
  },
  selectedOption: {
    //已选项，不传默认选择第一项
    type: [Number, String]
  },
  width: {
    //宽度
    type: Number
  }
})
const emit = defineEmits(['templateChange'])

const { selectList } = toRefs(props)
const selected = ref()

const selectWidth = computed(() => props.width + 'px')

watchEffect(() => {
  if (props.selectedOption) {
    selected.value = props.selectedOption
  } else {
    selected.value = props.selectList[0].value
  }
})
watch(selected, () => {
  const selectedName = props.selectList.find(
    (cur) => cur.value === selected.value
  )
  emit('templateChange', selectedName)
})
</script>

<style lang="scss" scoped>
.simpleSelect :deep(.el-select) {
  width: v-bind('selectWidth');
  height: 32px;
  border: 1px solid rgba(228, 231, 237, 1);
  border-radius: 4px;
  margin-right: 12px;
  &:hover {
    border-color: #1564ff;
  }
  .el-input {
    .el-input__prefix {
      left: 12px;
    }
    .el-input__inner {
      border: none;
      margin: 0;
      height: 30px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      color: rgba(27, 28, 30, 1);
      text-align: center;
    }
    .el-input__icon {
      height: 40px; // 设置高度，icon元素恢复原来的高度，这时arror才能垂直居中
      position: relative;
      top: -5px; // 元素整体上移，需要自己调整，让箭头也居中
    }
    .el-icon-arrow-up {
      font-family: 'iconfont' !important;
      font-size: 12px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;

      &::before {
        content: '\e66f2';
      }
    }
  }
  .el-select-dropdown__list {
    width: 140px;
    .el-select-dropdown__item {
      padding: 0 8px;
    }
    .selected {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      color: rgba(27, 28, 30, 1);
    }
  }
}
.check {
  float: right;
}
</style>
