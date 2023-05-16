/**
 * 打开美事文档：https://docs.58corp.com/#/space/1450040995440820224
 */
export function useMeishi() {
  /**
   * 打开美事
   * @param {String} type - 类型，参考：TYPE in meishi.const.js
   * @param {String} optionStr
   */
  function openMeishi(type, optionStr) {
    window.gotoMeishi(type, optionStr)
  }

  return {
    openMeishi
  }
}
