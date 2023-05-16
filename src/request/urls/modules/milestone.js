import { BASE_URL } from '@/request/http'

export default {
  milestones: BASE_URL + 'milestone/getList',
  milestoneDetail: BASE_URL + 'milestone/detail',
  createMilestone: BASE_URL + 'milestone/insert',
  deleteMilestone: BASE_URL + 'milestone/delete',
  updateMilestone: BASE_URL + 'milestone/update',
  completeMilestone: BASE_URL + 'milestone/completeMilestone'
}
