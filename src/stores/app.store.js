import { defineStore } from 'pinia'
import actions from '@/utils/actions.util'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      oneApp: { orgName: '', orgId: '' },
      subappLoading: false
    }
  },
  actions: {
    updateOneAppnfo(options) {
      this.oneApp = {
        ...this.oneApp,
        ...options
      }
      actions.setGlobalState({
        oneApp: {
          orgName: this.oneApp.orgName,
          orgId: this.oneApp.orgId
        }
      })
    }
  }
})
