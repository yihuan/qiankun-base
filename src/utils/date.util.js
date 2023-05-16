import dayjs from 'dayjs'
import { UNIT } from '@/constants/date.const'
const isSameOrBeforePlugin = require('dayjs/plugin/isSameOrBefore')
const isSameOrAfterPlugin = require('dayjs/plugin/isSameOrAfter')

dayjs.extend(isSameOrBeforePlugin)
dayjs.extend(isSameOrAfterPlugin)

/**
 * 格式化日期
 * Available formats:
 * https://day.js.org/docs/en/display/format
 * @param {Number|Date|String} date
 * @param {String} formatStr, 'timestamp' 返回时间戳
 * @returns {String}
 */
export function formatDate(date, formatStr = 'YYYY-MM-DD') {
  if (!date) return ''
  if (formatStr == 'timestamp') {
    return dayjs(date).valueOf()
  }
  return dayjs(date).format(formatStr)
}

/**
 * 是否第一个日期早于第二个日期
 * @param {Date|String} firstDate
 * @param {Date|String} secondDate
 * @param {String} unit - UNIT in date.const.js
 * @returns {Boolean}
 */
export function isBefore(firstDate, secondDate, unit = UNIT.SECOND) {
  return dayjs(firstDate).isBefore(secondDate, unit)
}

/**
 * 是否第一个日期晚于第二个日期
 * @param {Date|String} firstDate
 * @param {Date|String} secondDate
 * @param {String} unit - UNIT in date.const.js
 * @returns {Boolean}
 */
export function isAfter(firstDate, secondDate, unit = UNIT.SECOND) {
  return dayjs(firstDate).isAfter(secondDate, unit)
}

/**
 * 是否第一个日期等于第二个日期
 * @param {Date|String} firstDate
 * @param {Date|String} secondDate
 * @param {String} unit - UNIT in date.const.js
 * @returns {Boolean}
 */
export function isSame(firstDate, secondDate, unit = UNIT.SECOND) {
  return dayjs(firstDate).isSame(secondDate, unit)
}

/**
 * 是否第一个日期等于或早于第二个日期
 * @param {Date|String} firstDate
 * @param {Date|String} secondDate
 * @param {String} unit - UNIT in date.const.js
 * @returns {Boolean}
 */
export function isSameOrBefore(firstDate, secondDate, unit = UNIT.SECOND) {
  return dayjs(firstDate).isSameOrBefore(secondDate, unit)
}

/**
 * 是否第一个日期等于晚于第二个日期
 * @param {Date|String} firstDate
 * @param {Date|String} secondDate
 * @param {String} unit - UNIT in date.const.js
 * @returns {Boolean}
 */
export function isSameOrAfter(firstDate, secondDate, unit = UNIT.SECOND) {
  return dayjs(firstDate).isSameOrAfter(secondDate, unit)
}

/**
 * 根据单位获取不同的值
 * @param {String} unit - UNIT in date.const.js}
 * @param {Date|String} date - 日期
 * @returns {Number}
 */
export function get(unit, date = new Date()) {
  return dayjs(date).get(unit)
}
