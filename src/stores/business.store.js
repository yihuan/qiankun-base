import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business', {
  state: () => {
    return {
      loading: false,
      igitInfo: {
        id: 0,
        bizName: '',
        igitAdmins: [],
        isGitSecondApprove: null,
        canEditIgitManagers: false
      },
      ioneInfo: {
        id: 0,
        bizName: '',
        ioneAdmins: [],
        isForceRelevancy: null,
        moreVersion: null,
        canEditIoneManagers: false
      }
    }
  }
})
