<template>
  <draggable
    v-model="list"
    v-bind="options"
    @add="handleAdd"
    @remove="handleRemove"
    @update="handleUpdate"
    @choose="handleChoose"
    @unchoose="handleUnchoose"
    @sort="handleSort"
    @filter="handleFilter"
    @move="handleMove"
    @clone="handleClone"
    @start="handleStart"
    @end="handleEnd"
  >
    <transition-group v-if="transition" type="transition" name="flip-list">
      <slot />
    </transition-group>
    <template v-else>
      <slot />
    </template>
    <template #header>
      <slot name="header" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </draggable>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import { cloneDeep } from '@/utils/lodash.util'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  group: {
    type: [String, Object]
  },
  disabled: {
    type: Boolean,
    default: false
  },
  handle: {
    type: String
  },
  transition: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits([
  'input',
  'start',
  'end',
  'add',
  'remove',
  'update',
  'choose',
  'unchoose',
  'sort',
  'filter',
  'move',
  'clone'
])

const list = ref([])

const options = computed(() => ({
  animation: 200,
  ghostClass: 'ghost',
  disabled: props.disabled,
  handle: props.handle
}))

watchEffect(() => {
  list.value = props.value
})

// Element dragging started
function handleStart(event) {
  emit('start', event)
}

// Element dragging ended
function handleEnd(event) {
  const { oldIndex, newIndex } = event
  if (oldIndex != newIndex) {
    emit('input', cloneDeep(list.value))
    emit('end', event)
  }
}

// Element is dropped into t he list from another list
function handleAdd(event) {
  emit('add', event)
}

// Element is removed from the list into another list
function handleRemove(event) {
  emit('remove', event)
}

// Changed sorting within list
function handleUpdate(event) {
  emit('update', event)
}

// Element is chosen
function handleChoose(event) {
  emit('choose', event)
}

// Element is unchosen
function handleUnchoose(event) {
  emit('unchoose', event)
}

// Called by any changes to the list(add/update/remove)
function handleSort(event) {
  emit('sort', event)
}

// Attempt to drag a filtered element
function handleFilter(event) {
  emit('filter', event)
}

// Event when you move an item in the list or between lists
function handleMove(event) {
  emit('move', event)
}

// Called when creating a clone of element
function handleClone(event) {
  emit('clone', event)
}
</script>

<style lang="scss" scoped>
:deep(.flip-list-move) {
  transition: transform 0.5s;
}

:deep(.ghost) {
  opacity: 0.7;
  box-shadow: 3px 5px 5px 1px #c7c7c9;
}

:deep(.sortable-drag) {
  opacity: 0;
}
</style>
