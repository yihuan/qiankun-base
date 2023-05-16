import { defineStore } from 'pinia'
import actions from '@/utils/actions.util'

export const useProjectStore = defineStore('project', {
  state: () => {
    return {
      curProject: {
        id: '',
        name: '',
        bizId: '',
        // TODO: workaround to fix project setting refreshing issue because of
        // TODO: the key in router-view of ProjectDetails
        changed: false
      },
      projectSet: {
        id: 0,
        name: ''
      }
    }
  },
  actions: {
    updateProject(project) {
      this.curProject = {
        ...this.curProject,
        ...project
      }

      actions.setGlobalState({
        project: {
          id: project.id,
          bizId: project.bizId,
          changed: project.changed
        }
      })
    },

    updateProjectSet(ps) {
      this.projectSet = {
        ...this.projectSet,
        ...ps
      }

      actions.setGlobalState({
        projectSet: { id: ps.id, name: ps.name }
      })
    }
  }
})
