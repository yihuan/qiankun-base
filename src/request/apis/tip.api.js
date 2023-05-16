import { getRequest } from '@/request/http'
import urls from '@/request/urls'

/**
 * 是否展示提示框
 * @returns {Promise}
 */
export function showTip() {
  return getRequest({
    url: urls.tip.showTip
  })
}

/**
 * 用户反馈
 * @param {String} - operate 操作，FEEDBACK_OPERATION in common.const.js
 * @returns {Promise}
 */
export function reportFeedback(operate) {
  return getRequest({
    url: urls.tip.userFeedback,
    params: { operate }
  })
}
