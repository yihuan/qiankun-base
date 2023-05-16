import { readonly } from 'vue'
import { useNpsStore } from '@/stores/nps.store'

export function useNps() {
  const npsStore = useNpsStore()
  const SCENE = {
    NEW_VERSION: 4, // 进入新版
    WORK_ITEM_NEW: 11, // 新建工作项
    WORK_ITEM_DETAIL_CLOSE: 12, // 关闭工作项详情
    WORK_ITEM_SEARCH: 13 // 搜索工作项
  }

  /**
   * 显示调研弹框
   * @param {String} scene - 场景值（自定义）
   * @param {Number} delay - 延迟时间，单位：秒（多少秒后显示）
   */
  function showSurvey(scene, delay = 0) {
    npsStore.$patch({
      scene,
      delay
    })
  }

  function cancelSurvey() {
    npsStore.$patch({
      delay: 0,
      scene: ''
    })
  }

  return {
    SCENE: readonly(SCENE),
    showSurvey,
    cancelSurvey
  }
}
