import qs from 'qs'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { RESPONSE_WHITE_LIST } from './rules'
import { error } from '@/utils/log.util'

const MSG_DURATION = 2500

axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const isProd = process.env.NODE_ENV === 'production'

export const BASE_URL = isProd
  ? window.location.origin + '/api-yunxiao-iwork2/'
  : window.location.protocol + '//ee-dev.58v5.cn/api-yunxiao-iwork2/'
export const ICI_API_URL = isProd
  ? window.location.origin + '/api-yunxiao-ici/'
  : 'https://ee.58v5.cn/api-yunxiao-ici/'
export const IWOR1_API_URL = isProd
  ? window.location.origin + '/api-yunxiao-iwork/'
  : window.location.protocol + '//iwork.58v5.cn/'

axios.interceptors.request.use(
  function (config) {
    const moreConfig = {
      crossDomain: true
    }
    config = Object.assign(config, moreConfig)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    if (RESPONSE_WHITE_LIST.find((url) => response.config.url.includes(url))) {
      return Promise.resolve(response)
    }

    if (response.status === 203) {
      ssoRedirect()
    }

    if (response.data.code === 200) {
      return Promise.resolve(response.data)
    } else if (response.data.code === 401 && response.data.authError) {
      window.location.href = `/base2/w/noauth?token=${response.data.token}`
      return
    } else if (response.data.code === 402) {
      MessageBox.alert(
        `<strong>您不属于项目成员，请进入项目列表页面，选择项目【<a href="${
          window.location.href.split('base2')[0] + 'base2' + response.data.data
        }">申请加入</a>】成为项目成员</strong>`,
        '友情提示',
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false
        }
      )
      return Promise.reject(response.data)
    } else {
      Message({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: response.data.msg,
        duration: MSG_DURATION
      })
      return Promise.reject(response.data.msg)
    }
  },
  (error) => {
    try {
      const statusCode = error.response && error.response.status
      if (statusCode) {
        switch (statusCode) {
          case 302: {
            ssoRedirect()
            break
          }
          case 401:
            break
          // 请求不存在
          case 404:
            Message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              message: '网络请求不存在',
              duration: MSG_DURATION
            })
            break
          case 500:
            Message({
              type: 'error',
              message: '服务器发生错误，请稍后再试',
              duration: MSG_DURATION
            })
            break
          default:
            Message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              message: error.response.data.message,
              duration: MSG_DURATION
            })
        }
        return Promise.reject(error.response)
      }
    } catch (error) {
      console.error('Error', error) // eslint-disable-line
    }
  }
)

function ssoRedirect() {
  const currentPath = document.location.href
    .replace('#', 'iwork-well')
    .replace('?', 'iwork-ques')
    .replace(/=/g, 'iwork-eqs')
    .replace(/&/g, 'iwork-and')
    .replace('http', 'iwork-hp')
  const redirectPage =
    BASE_URL + 'login/toL?fromUrl=' + encodeURIComponent(currentPath)
  location.href = redirectPage
}

const CancelToken = axios.CancelToken
const cancellableRequests = {}

export const postRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: qs.stringify(params),
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const postBodyRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const postFileRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }

  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'post',
    url: url + (tag ? `/${tag}` : ''),
    data: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    headers: {
      'Content-Type':
        'multipart/form-data; boundary=----WebKitFormBoundaryWnM976bAKhZRgF5D'
    }
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}

export const getRequest = ({
  url,
  tag = '',
  params = {},
  config = {},
  cancellable = false
}) => {
  if (cancellable && cancellableRequests[url]) {
    cancellableRequests[url]()
  }
  if (!url) {
    error('Request URL is required')
  }
  const defaultConfig = {
    method: 'get',
    params: params,
    cancelToken: new CancelToken(function executor(c) {
      if (cancellable) {
        cancellableRequests[url] = c
      }
    }),
    url: url + (tag ? `/${tag}` : '')
  }
  config = Object.assign(
    defaultConfig,
    {
      errorTip: false
    },
    config
  )
  return axios(config)
}
