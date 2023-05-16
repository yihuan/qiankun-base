export function localSave(key, value) {
  localStorage.setItem(key, value || '')
}

export function localRead(key) {
  return localStorage.getItem(key)
}

export function localRemove(key) {
  localStorage.removeItem(key)
}

export function debounce(fn, delay) {
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

export function throttle(fn, interval) {
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

// 更新当前 url 参数，但是不刷新页面
export function _updateUrlParams(params) {
  if (Object.prototype.toString.call(params) != '[object Object]') return

  // 如果传入的参数值是空的，默认去掉
  let emptyKeyArr = []
  let handleParams = {}
  for (let key in params) {
    if (!params[key]) emptyKeyArr.push(key)
    else handleParams[key] = params[key]
  }
  let queryMap = {}
  let queryStr = window.location.search
  if (queryStr && queryStr.indexOf('?') === 0) {
    queryStr = queryStr.substr(1)
    let queryArr = queryStr.split('&')
    queryArr.map((item) => {
      let itemArr = item.split('=')
      if (!emptyKeyArr.includes(itemArr[0])) {
        queryMap[itemArr[0]] = itemArr[1]
      }
    })
  }
  Object.assign(queryMap, handleParams)

  let newQueryArr = []
  for (let key in queryMap) {
    newQueryArr.push(`${key}=${queryMap[key]}`)
  }
  let newQueryStr = newQueryArr.join('&')
  let urlNoParams = window.location.origin + window.location.pathname
  history.replaceState(null, null, `${urlNoParams}?${newQueryStr}`)
}

// 从地址栏获取查询参数
export function getParamsFromUrl(paramsKey) {
  if (
    !paramsKey ||
    Object.prototype.toString.call(paramsKey) != '[object String]' ||
    window.location.search.indexOf(paramsKey) === -1
  )
    return

  let locationSearchStr = window.location.search
  let urlQueryMap = {}

  if (locationSearchStr && locationSearchStr.indexOf('?') === 0) {
    locationSearchStr = locationSearchStr.substr(1)

    let urlQuerySet =
      locationSearchStr.indexOf('&') != -1
        ? locationSearchStr.split('&')
        : [locationSearchStr]

    urlQueryMap = urlQuerySet.reduce((pre, cur) => {
      let query = cur.split('=')

      return { ...pre, [query[0]]: query[1] }
    }, {})
  }

  return urlQueryMap[paramsKey]
}
