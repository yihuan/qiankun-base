import { BASE_URL } from '@/request/http'

export default {
  getCurrentUser: BASE_URL + 'login/getCurrentUser',
  dutyMembers: BASE_URL + 'customer/get'
}
