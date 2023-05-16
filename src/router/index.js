import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HomeWorkspace from '@/views/workspace/WorkspacePanel.vue'
import { SUB_APPS } from '@/constants/app.const'

function getSubAppsList(name, isMain) {
  const subApps = []
  Object.keys(SUB_APPS).forEach((key) => {
    let subapp = SUB_APPS[key]
    subApps.push({
      name: `${name}-${subapp.shortPath}`,
      path: `${subapp.shortPath}/*`,
      subapp: subapp.key,
      isMain: isMain,
      component: () =>
        import(/* webpackChunkName: "subentry" */ '@/views/HomeIwork.vue')
    })
  })
  return subApps
}

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    redirect: { name: 'HomeWorkspace' },
    children: [
      {
        name: 'HomeWorkspace',
        path: 'workspace',
        component: HomeWorkspace
      },
      {
        name: 'HomeIwork',
        path: SUB_APPS.IWORK.shortPath,
        component: () =>
          import(/* webpackChunkName: "subentry" */ '@/views/HomeIwork.vue')
      },
    ].concat(getSubAppsList('HomeIworkSubapp', true))
  },
  {
    path: '/demo',
    name: 'demo',
    component: () =>
      import(/* webpackChunkName: "demo" */ '@/views/demo/DemoEntry.vue'),
    children: [
      {
        path: 'draggable',
        name: 'DraggableDemo',
        component: () =>
          import(
            /* webpackChunkName: "demo" */ '@/views/demo/DraggableDemo.vue'
          )
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
