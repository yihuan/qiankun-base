const freeze = Object.freeze
const origin = window.location.origin
const host = window.location.host

export const isProd = process.env.NODE_ENV === 'production'

/**
 * 各子应用部署服务域名信息
 */
const PROD_DOMAIN_INFO = {
  'work.com': {
    work: 'https://work.com/'
  },
  'work-test.com': {
    work: 'https://work-test.cn/'
  },
  'work-dev.cn': {
    work: 'https://work-dev.cn/'
  }
}

/**
 * 子应用信息
 */
export const SUB_APPS = freeze({
  WORK: freeze({
    key: 'work',
    domain: isProd
      ? `${origin}/work/`
      : 'http://localdomain.com/work/',
    shortPath: 'w',
    title: 'work'
  }),
})

const subAppsList = []
Object.keys(SUB_APPS).forEach((key) => {
  subAppsList.push({ ...SUB_APPS[key] })
})
// 允许 Cookie 的子应用
export const ALLOW_COOKIE_SUB_APPS = freeze(subAppsList.map((it) => it.domain))
