import { getRequest, postBodyRequest } from '@/request/http'
import urls from '@/request/urls'

export default {
  /**
   * 里程碑列表
   * @param {Object} params
   * 参数格式：
   * {
   *  objectType: Number;
   *  objectId: Number;
   *  title: String;
   * }
   * @returns {Promise}
   */
  getMilestones(params) {
    return postBodyRequest({
      url: urls.milestone.milestones,
      params
    })
  },

  /**
   * 里程碑详情
   * @param {Number} id
   * @returns {Promise}
   */
  getMilestoneDetail(id) {
    return getRequest({
      url: urls.milestone.milestoneDetail,
      params: { id }
    })
  },

  /**
   * 创建里程碑
   * @param {Object} params
   * 参数格式：
   * {
   *  objectType: Number;
   *  objectId: Number;
   *  title: String;
   *  planEndDate: String; // format: YYYY-MM-DD HH:mm:ss
   *  description?: String;
   * }
   * @returns {Promise}
   */
  createMilestone(params) {
    return postBodyRequest({
      url: urls.milestone.createMilestone,
      params
    })
  },

  /**
   * 删除里程碑
   * @param {Number} id
   * @returns {Promise}
   */
  deleteMilestone(id) {
    return getRequest({
      url: urls.milestone.deleteMilestone,
      params: { id }
    })
  },

  /**
   * 更新里程碑
   * @param {Object} params
   * 参数格式：
   * {
   *  id: Number;
   *  objectType: Number;
   *  objectId: Number;
   *  title: String;
   *  planEndDate: String; // format: YYYY-MM-DD HH:mm:ss
   *  description?: String;
   * }
   * @returns {Promise}
   */
  updateMilestone(params) {
    return postBodyRequest({
      url: urls.milestone.updateMilestone,
      params
    })
  },

  /**
   * 完成里程碑
   * @param {Object} params
   * params foramt:
   * {
   *  id: Number;
   *  realEndDate: String; // format: YYYY-MM-DD HH:mm:ss
   * }
   * @returns {Promise}
   */
  completeMilestone(params) {
    return getRequest({
      url: urls.milestone.completeMilestone,
      params
    })
  }
}
