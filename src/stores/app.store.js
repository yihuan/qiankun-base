import { defineStore } from 'pinia'
import actions from '@/utils/actions.util'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      iwork: {
        menuFilter: {
          path: '',
          crossBiz: '0',
          viewType: '1'
        }
      },
      ione: { orgName: '', bspId: '', orgId: '' },
      ici: {
        user: {
          rightData: {}
        },
        applist: [],
        newFlowWinOpen: false,
        selectedApp: {}
      },
      subappLoading: false
    }
  },
  actions: {
    saveIworkMenuFilter(filter) {
      this.iwork.menuFilter = filter
    },
    updateIoneInfo(options) {
      this.ione = {
        ...this.ione,
        ...options
      }
      actions.setGlobalState({
        ione: {
          orgName: this.ione.orgName,
          bspId: this.ione.bspId,
          orgId: this.ione.orgId
        }
      })
    },
    updateIciInfo(options) {
      this.ici = {
        ...this.ici,
        ...options
      }
    }
  }
})
