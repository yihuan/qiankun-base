<template>
  <div class="gantt-milestone-nodes">
    <template v-for="k in Object.keys(dayNodesMap)">
      <template v-if="dayNodesMap[k].multiple">
        <MilestoneOverlapNode
          :key="k"
          :object-id="objectId"
          :object-type="objectType"
          :data="dayNodesMap[k]"
          :show-title="showTitle"
          :milestone-update="milestoneUpdate"
        />
      </template>
      <template v-else>
        <MilestoneNode
          :key="k"
          :object-id="objectId"
          :object-type="objectType"
          :data="dayNodesMap[k].nodes[0]"
          :show-title="showTitle"
          :milestone-update="milestoneUpdate"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { OBJECT_TYPE, MILESTONE_STATE } from '@/constants/gantt.const'
import MilestoneNode from './MilestoneNode.vue'
import MilestoneOverlapNode from './MilestoneOverlapNode.vue'

const props = defineProps({
  objectId: Number,
  objectType: {
    type: Number,
    validator: (value) => Object.values(OBJECT_TYPE).includes(value)
  },
  disabled: Boolean,
  showTitle: {
    type: Boolean
  },
  /**
   * Format:
   * [{
   *  id: Number;
   *  status: Number;
   *  title: String;
   *  endDate: String;
   *  left: Number; // Distance to left
   * }]
   */
  milestones: {
    type: Array,
    required: true,
    default: () => []
  },
  // milestone-update event for extended component
  milestoneUpdate: {
    type: Function,
    default: () => {}
  }
})

const dayNodesMap = computed(() => {
  return props.milestones.reduce((ret, curr) => {
    const { endDate, status, left } = curr
    const [dayDate] = endDate.split(' ')
    if (!ret[dayDate]) {
      ret[dayDate] = {
        state: status,
        nodes: [curr],
        multiple: false,
        left: left
      }
    } else {
      if (ret[dayDate].state !== status) {
        ret[dayDate].state = MILESTONE_STATE.NOT_STARTED
      }
      ret[dayDate].nodes.push(curr)
      ret[dayDate].multiple = true
    }
    return ret
  }, {})
})
</script>

<style lang="scss" scoped>
.gantt-milestone-nodes {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
