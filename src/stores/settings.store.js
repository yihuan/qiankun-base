import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      orgs: [], // 一级组织机构
      currentLine: 0,
      lines: [], // 业务线列表
      current: {}, // 当前业务线关联信息
      item: {
        search: ''
      },
      businessSearch: '',
      auth: {},
      templateAddColumn: false,
      addWorkflowState: false,
      saveContent: false,
      saveContentLoading: false
    }
  }
})
