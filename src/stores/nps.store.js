import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNpsStore = defineStore('nps', () => {
  const delay = ref(0)
  const scene = ref('')

  return { delay, scene }
})
