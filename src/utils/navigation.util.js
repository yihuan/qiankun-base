/**
 * 打开新页面
 * @param {Router} router - 当前路由对象，this.$router
 * @param {Location} routerInfo - 跳转路由信息
 */
export function openNewTab(router, routerInfo) {
  const { href } = router.resolve(routerInfo)
  window.open(href, '_blank')
}
