import { loadSubMicroApps } from '@/utils/app.util'
import { routes } from '@/router'
import Store from '@/stores'
import { SUB_APPS } from '@/constants/app.const'

const routerBaseMap = {}

const microApps = loadSubMicroApps(routes).map((r, i) => {
  let routerBase =
    process.env.BASE_URL +
    `${r.parent ? r.parent + '/' : ''}` +
    r.path.substring(0, r.path.length - 1) +
    (r.isMain ? '' : r.subapp + '/') // 添加是否为主菜单

  if (!routerBaseMap[r.subapp]) {
    routerBaseMap[r.subapp] = {}
  }
  routerBaseMap[r.subapp][r.subappCategory || 'default'] = routerBase

  const entry = SUB_APPS[r.subapp.toUpperCase()].domain
  return {
    key: r.subapp.toUpperCase(),
    name: 'sub-' + r.subapp + i,
    entry: entry,
    activeUrl: entry,
    activeRule: routerBase
  }
})

const apps = microApps.map((item) => {
  return {
    ...item,
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      version: '2.0',
      iconfont: 'iconfont', // 字体图标的class
      useParentStore: Store, // 下发 store
      urlBase: item.activeUrl,
      routerBaseMap: routerBaseMap,
      routerBase: item.activeRule, // 下发基础路由
      ibasePublicPath: process.env.BASE_URL
    }
  }
})
export default apps
