<template>
  <div class="milestone-overlap-node">
    <PopoverInfo popper-class="overlap-node-pop" :trigger="trigger">
      <div class="day-nodes">
        <MilestoneNode
          v-for="(m, index) in nodes"
          :key="m.id"
          :object-id="objectId"
          :object-type="objectType"
          :data="m"
          :index="index + 1"
          trigger="click"
          :show-title="showTitle"
          :milestone-update="milestoneUpdate"
        />
      </div>
      <template #reference>
        <div class="node-content" :style="{ left: data.left + 'px' }">
          <template v-if="data.state === MILESTONE_STATE.COMPLETED">
            <i
              class="iconfont icon-icon-28-wanchenglichengbei icon-completed"
            />
          </template>
          <template v-else>
            <i
              class="iconfont icon-icon-28-weiwanchenglichengbei icon-uncompleted"
            />
          </template>
          <span class="node-badge">{{ nodesCount }}</span>
        </div>
      </template>
    </PopoverInfo>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PopoverInfo from '@/components/common/PopoverInfo.vue'
import { MILESTONE_STATE, OBJECT_TYPE } from '@/constants/gantt.const'
import MilestoneNode from '@/components/gantt/components/MilestoneNode.vue'
import { TRIGGERS } from '@/constants/elementui.const'

const props = defineProps({
  trigger: {
    type: String,
    default: 'hover',
    validator: (val) => TRIGGERS.includes(val)
  },
  objectId: {
    type: Number,
    required: true
  },
  objectType: {
    type: Number,
    required: true,
    validator: (value) => Object.values(OBJECT_TYPE).includes(value)
  },
  /**
   * {
   *  state: Number;
   *  left: Number;
   *  nodes: Array[Node];
   *  multiple: Boolean; // not useful here
   * }
   * Node:
   * {
   *  id: Number;
   *  status: Number;
   *  title: String;
   *  endDate: String;
   *  left: Number;
   * }
   */
  data: {
    type: Object,
    required: true
  },
  showTitle: {
    type: Boolean
  },
  milestoneUpdate: {
    type: Function,
    default: () => {}
  }
})

const nodes = computed(() => {
  // Do not need left for overlapped nodes as its postion is changed to static
  return props.data?.nodes?.map((node) => ({
    id: node.id,
    status: node.status,
    title: node.title,
    endDate: node.endDate
  }))
})
const nodesCount = computed(() => nodes.value.length)
</script>

<style lang="scss" scoped>
.milestone-overlap-node {
  display: flex;
  align-items: center;
  position: relative;

  .node-content {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    cursor: pointer;

    .iconfont {
      font-size: 32px;

      &.icon-completed {
        color: $primary-color;
      }

      &.icon-uncompleted {
        color: $font-hint-color;
      }
    }

    .node-badge {
      position: absolute;
      top: -2px;
      left: 16px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      color: #ffffff;
      background-color: $primary-color;
    }
  }
}
</style>

<style lang="scss">
.overlap-node-pop {
  min-width: 40px;
  padding: 0;

  .day-nodes {
    padding: $base-gap;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: 200px;

    .milestone-node {
      .node-content {
        position: static;
      }
    }
  }
}
</style>
