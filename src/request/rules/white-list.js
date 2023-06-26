import urls from '../urls'

const isProd = process.env.NODE_ENV === 'production'

// 不需要走拦截器的url
export const RESPONSE_WHITE_LIST = [
  ...Object.values(urls.ci).filter((url) =>
    isProd ? url.includes('/ci/') : url.includes('ci.domain.com')
  ),
  'product/list'
]
