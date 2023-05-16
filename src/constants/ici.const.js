export const platforms = {
  0: { text: 'android' },
  1: { text: 'ios' },
  2: { text: 'minipro' }
}

export const status = {
  1: { text: '已启用' },
  0: { text: '未启用' }
}

const platformlist = Object.keys(platforms).map((key) => ({
  value: key,
  label: platforms[key].text
}))
const statuslist = Object.keys(status).map((key) => ({
  value: key,
  label: status[key].text
}))

export { platformlist, statuslist }
