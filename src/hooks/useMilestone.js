import { isRef, ref, unref, watchEffect } from 'vue'
import milestoneApi from '@/request/apis/milestone.api'

export function useMilestone(objectId, objectType) {
  const milestones = ref([])
  const loading = ref(false)

  function getMilestones(params) {
    loading.value = true
    milestoneApi
      .getMilestones({ objectId: unref(objectId), objectType, ...params })
      .then((res) => {
        milestones.value = res?.data?.map((x) => ({
          ...x,
          endDate: x.planEndDate
        }))
      })
      .finally(() => {
        loading.value = false
      })
  }

  function createMilestone(params) {
    return milestoneApi.createMilestone({
      objectId: unref(objectId),
      objectType,
      ...params
    })
  }

  function getMilestoneDetail(id) {
    return milestoneApi.getMilestoneDetail(id)
  }

  function updateMilestone(params) {
    params.objectId = unref(objectId)
    params.objectType = objectType
    return milestoneApi.updateMilestone(params)
  }

  function deleteMilestone(id) {
    return milestoneApi.deleteMilestone(id)
  }

  function completeMilestone(params) {
    return milestoneApi.completeMilestone(params)
  }

  if (isRef(objectId)) {
    watchEffect(getMilestones)
  }

  return {
    milestones,
    getMilestones,
    createMilestone,
    updateMilestone,
    getMilestoneDetail,
    deleteMilestone,
    completeMilestone
  }
}
