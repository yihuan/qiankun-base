/**ici 相关接口 */
import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

export default {
  // 获取登录用户
  getCurrentUser(params) {
    return getRequest({
      url: urls.user.getCurrentUser,
      params
    })
  },
  getUserAuth(params) {
    return postBodyRequest({
      url: urls.user.userAuth,
      params: params
    })
  },

  /**
   * 获取值班列表
   * @returns {Promise}
   */
  getDutyMembers() {
    return getRequest({
      url: urls.user.dutyMembers
    })
  }
}
