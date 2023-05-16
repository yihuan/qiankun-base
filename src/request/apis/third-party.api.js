import { getRequest } from '@/request/http'
import urls from '@/request/urls'

export default {
  getMeishiAuthCode(params) {
    return getRequest({
      url: urls.thirdParty.meishiAuthCode,
      params: params
    })
  },

  /**
   * 获取 nps 链接
   * @param {String} scene - 场景值
   * @returns {Promise}
   */
  getNpsLink(scene) {
    return getRequest({
      url: urls.thirdParty.npsLink,
      params: { scene }
    })
  }
}
