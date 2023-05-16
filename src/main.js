import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { registerMicroApps } from 'qiankun'
import { info } from '@/utils/log.util'
import EeComponent from 'ee-component'

import router from './router'
import microApps from '@/utils/micro-app.util'
import action from '@/utils/actions.util'
import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'

import ElementUI from 'element-ui'
import filters from './filters'

import './assets/styles/reset.scss'
import './assets/styles/base.scss'
import './assets/styles/icon.css'

window.MainVue = Vue
delete window.Vue

window.MainVue.config.productionTip = false
window.MainVue.config.devtools =
  process.env.NODE_ENV !== 'production' ? true : false
// eslint-disable-next-line
window.MainVue.config.errorHandler = function (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    console.error('Error:', err)
  }
}

window.MainVue.use(ElementUI)
window.MainVue.use(EeComponent)
window.MainVue.use(filters)
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}

const pinia = createPinia()
window.MainVue.use(PiniaVuePlugin)

const mainVm = new window.MainVue({
  router,
  pinia,
  render: (h) => h(App)
}).$mount('#baseApp')

const store = useAppStore()
const userStore = useUserStore()

const lifeCycles = {
  beforeLoad: [
    (app) => {
      store.subappLoading = true
      window.__URL_BY_QIANKUN__ = app.activeUrl
      info(
        '%c before load',
        'background:#0f0 ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    }
  ], // 挂载前回调
  beforeMount: [
    (app) => {
      info(
        '%c before mount',
        'background:#f1f ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    }
  ],
  beforeUnmount: [
    (app) => {
      info(
        '%c before unmount',
        'background:#a7a ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    }
  ],
  // 卸载后回调
  afterUnmount: [
    (app) => {
      info(
        '%c after unmount',
        'background:#a7a ; padding: 1px; border-radius: 3px;  color: #fff',
        app
      )
    }
  ],
  afterMount: [
    () => {
      store.subappLoading = false
      const subAppInstanceKey = [
        '__QIANKUN_SUB_APP_IWORK__',
        '__QIANKUN_SUB_APP_IONE__',
        '__QIANKUN_SUB_APP_ICI__',
        '__QIANKUN_SUB_APP_IEFFECT__'
      ]
      subAppInstanceKey.forEach((key) => {
        if (window.proxy[key] && process.env.NODE_ENV === 'development') {
          mainVm.$children.push(window.proxy[key])
        }
      })
    }
  ]
}

action.initGlobalState({
  user: { id: userStore.id, name: userStore.name },
  ione: store.ione
})

registerMicroApps(microApps, lifeCycles)
