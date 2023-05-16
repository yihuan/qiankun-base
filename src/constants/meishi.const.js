const freeze = Object.freeze

export const TYPE = freeze({
  PERSON: 'person', // 单聊会话
  GROUP: 'group', // 群聊会话
  APP: 'app', // 应用
  MESSAGE_CARD: 'sendMessageCard' // 转发弹窗并转发动态卡片
})
