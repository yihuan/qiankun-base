import urls from '../urls'

const isProd = process.env.NODE_ENV === 'production'

// 不需要走拦截器的url
export const RESPONSE_WHITE_LIST = [
  ...Object.values(urls.ici).filter((url) =>
    isProd ? url.includes('/api-yunxiao-ici/') : url.includes('ysici.58v5.cn')
  ),
  'product/getOwnerProducts',
  'flowtemplate/getAutoFlowTemplateByPage',
  'v3/transfer/getUserFlg',
  'v3/transfer/getRedirectUrl',
  'sgschedule/getScheduleProdList'
]
