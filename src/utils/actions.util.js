import { initGlobalState } from 'qiankun'

function emptyAction() {
  // 设置一个actions实例
  // 提示当前使用的是空 Action
  console.warn('Current execute action is empty!') // eslint-disable-line
}

class Actions {
  store = null
  actions = {
    initGlobalState,
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  }

  // 初始化 action
  initGlobalState(state) {
    this.actions = initGlobalState({ ...state })
  }

  setGlobalState(state) {
    this.actions.setGlobalState(state)
  }

  onGlobalStateChange(state) {
    const { key, value } = state
    console.info('ibase state changes:', key, value) // eslint-disable-line
  }
}

const action = new Actions()
export default action
