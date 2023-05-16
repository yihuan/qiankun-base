import { defineStore } from 'pinia'
import actions from '@/utils/actions.util'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: '',
      name: '',
      img: ''
    }
  },
  actions: {
    updateUser(user) {
      this.id = user.id
      this.name = user.name
      this.img = user.img
      actions.setGlobalState({
        user: { ...user }
      })
    }
  }
})
