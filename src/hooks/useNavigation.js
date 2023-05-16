import { useRouter } from 'vue-router/composables'

/**
 * 路由导航相关
 */
export function useNavigation() {
  const router = useRouter()

  function openNewTab(routerInfo) {
    const routeData = router.resolve(routerInfo)
    window.open(routeData.href, '_blank')
  }

  return { openNewTab }
}
