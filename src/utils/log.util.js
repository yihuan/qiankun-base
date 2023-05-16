const projectName = require('../../package.json').name

export function warn(msg) {
  // eslint-disable-next-line
  console.warn(`[${projectName} warn]: ${msg}`)
}

export function error(msg) {
  throw new Error(`[${projectName} error]: ${msg}`)
}

export function info(...msg) {
  // eslint-disable-next-line
  console.info(...msg)
}
