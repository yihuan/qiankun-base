import { defineStore } from 'pinia'
import { ref } from 'vue'
import actions from '@/utils/actions.util'

export const useIciStore = defineStore('ici', () => {
  const appName = ref('')
  // Flag to indicate if app is switched by manually selection
  const appSwitched = ref(false)
  const appFromSub = ref('')

  function updateAppInfo(name, switched = false) {
    appName.value = name
    actions.setGlobalState({
      sg: {
        appName: name,
        appSwitched: switched
      }
    })
  }

  return { appName, updateAppInfo, appFromSub, appSwitched }
})
