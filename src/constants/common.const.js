const freeze = Object.freeze

export const LOCAL_STORAGE_ITEM = freeze({
  DEPARTMENT: 'department',
  BUSINESS_LINE: 'businessLine',
  ICI_SG_APP: 'iciSwiftGoApp' // iCi 速行项目选中的app
})

// EeSelect 下拉框值类型
export const SELECT_VALUE_TYPE = freeze({
  OBJECT_ARRAY: 'objArray', // 对象数组
  STRING_ARRAY: 'strArray', // 字符串数组
  STRING: 'str' // 字符串
})

/**
 * 用户反馈操作
 */
export const FEEDBACK_OPERATION = freeze({
  CLOSED: 1, // 关闭
  FEEDBACK: 2, // 问题反馈
  RETURN_OLD: 3 // 返回旧版
})

/**
 * 跳转到平台
 */
export const JUMP_TO_PLATFORM = freeze({
  OLD: 1, // 跳转到旧平台
  NEW: 2 // 跳转到新平台
})
