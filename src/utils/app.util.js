export function loadSubMicroApps(routes) {
  return (
    routes?.reduce((subapps, route) => {
      if (route?.children?.length) {
        const components = loadSubMicroApps(route.children)
        subapps.push(...components)
      }
      if (route.subapp) {
        subapps.push(route)
      }
      return subapps
    }, []) || []
  )
}

export function _debounce(fn, delay) {
  delay = delay || 200
  var timer
  return function () {
    var _this = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(_this, args)
    }, delay)
  }
}

export function _throttle(fn, interval) {
  var last
  var timer
  interval = interval || 200
  return function () {
    var _this = this
    var args = arguments
    var now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(_this, args)
      }, interval)
    } else {
      last = now
      fn.apply(_this, args)
    }
  }
}
