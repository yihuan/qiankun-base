const freeze = Object.freeze
const origin = window.location.origin
const host = window.location.host

export const isProd = process.env.NODE_ENV === 'production'

/**
 * 各子应用部署服务域名信息
 */
const PROD_DOMAIN_INFO = {
  'ee.58corp.com': {
    work: 'https://ee-iwork.58corp.com/',
    ione: 'https://ee-ione.58corp.com/',
    ici: 'https://yici.58corp.com/base2/',
    efforg: 'https://ee-ieffect.58corp.com/fe-yunxiao-ieffect/',
    irepo: 'https://ee-irepo.58corp.com/',
    order: 'https://ee-order.58corp.com/',
    sg: 'https://ee.58corp.com/fe-yunxiao-sg/'
  },
  'ee.58v5.cn': {
    work: 'https://ee-iwork.58v5.cn/',
    ione: 'https://ee-ione.58v5.cn/',
    ici: 'https://yici.58v5.cn/base2/',
    efforg: 'https://ee-ieffect.58v5.cn/fe-yunxiao-ieffect/',
    irepo: 'https://irepo.58v5.cn/',
    order: 'https://ee-order.58corp.com/',
    sg: 'https://ee.58v5.cn/fe-yunxiao-sg/'
  },
  'ee-dev.58v5.cn': {
    work: 'https://ee-iwork.58v5.cn/',
    ione: 'https://ee-dev-ione.58v5.cn/',
    ici: 'https://yici.58v5.cn/base2/',
    efforg: 'https://ee-ieffect.58v5.cn/fe-yunxiao-ieffect/',
    irepo: 'https://irepo.58v5.cn/',
    order: 'https://ee-order.58v5.cn/',
    sg: 'https://ee-dev.58v5.cn/fe-yunxiao-sg/'
  }
}

/**
 * 子应用信息
 */
export const SUB_APPS = freeze({
  IWORK: freeze({
    key: 'iwork',
    domain: isProd
      ? `${origin}/fe-yunxiao-iwork2/`
      : 'http://lee.58v5.cn:5801/fe-yunxiao-iwork2/',
    shortPath: 'w',
    title: '项目协同'
  }),
  WORK: freeze({
    key: 'work',
    domain: isProd ? PROD_DOMAIN_INFO[host].work : 'http://unify.58v5.cn:8060/',
    shortPath: 'oc',
    title: '项目协同'
  }),
  ICI: freeze({
    key: 'ici',
    domain: isProd ? PROD_DOMAIN_INFO[host].ici : 'http://lee.58v5.cn:5503/',
    shortPath: 'c',
    title: '移动交付'
  }),
  IONE: freeze({
    key: 'ione',
    domain: isProd ? PROD_DOMAIN_INFO[host].ione : 'http://lee.58v5.cn:8081/',
    shortPath: 'o',
    title: '持续交付'
  }),
  MEASURE: freeze({
    key: 'measure',
    domain: isProd
      ? 'https://measure.58corp.com/'
      : 'http://measure.58corp.com/',
    shortPath: 'm',
    title: '度量'
  }),
  IREPO: freeze({
    key: 'irepo',
    domain: isProd ? PROD_DOMAIN_INFO[host].irepo : 'http://irepo.58v5.cn/',
    shortPath: 'irepo',
    title: '制品库'
  }),
  CR: freeze({
    key: 'cr',
    domain: isProd ? 'https://cr.58corp.com/' : 'http://cr.58corp.com/',
    shortPath: 'cr',
    title: 'codereview'
  }),
  ORDER: freeze({
    key: 'order',
    domain: isProd
      ? PROD_DOMAIN_INFO[host].order
      : 'http://unify.58v5.cn:8081/',
    shortPath: 't',
    title: '待办中心'
  }),
  EFFORG: freeze({
    key: 'efforg',
    domain: isProd
      ? PROD_DOMAIN_INFO[host].efforg
      : 'http://unify.58v5.cn:8082/',
    shortPath: 'eo',
    title: '组织效能'
  }),
  QUALITY: freeze({
    key: 'quality',
    domain: isProd
      ? 'https://quality.58corp.com/'
      : 'http://unify.58v5.cn:8002/',
    shortPath: 'q',
    title: '工程质量'
  }),
  SG: freeze({
    key: 'sg',
    domain: isProd
      ? PROD_DOMAIN_INFO[host].sg
      : 'http://lee.58v5.cn:5806/fe-yunxiao-sg/',
    shortPath: 'sg',
    title: '版本计划'
  })
})

const subAppsList = []
Object.keys(SUB_APPS).forEach((key) => {
  subAppsList.push({ ...SUB_APPS[key] })
})
// 允许 Cookie 的子应用
export const ALLOW_COOKIE_SUB_APPS = freeze(subAppsList.map((it) => it.domain))
