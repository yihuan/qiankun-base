<template>
  <div id="simple_select">
    <el-popover
      ref="simpleSelectPopover"
      v-model="openStatus"
      popper-class="simple_select_popover"
      :placement="placement"
      :trigger="realTrigger"
      :disabled="readonly"
      :width="width"
      :open-delay="200"
      :close-delay="closeDelay"
      @show="showPopover"
      @hide="hidePopover"
    >
      <div
        v-clickoutside="handleClickoutside"
        class="popover-body"
        @mouseover="setCloseDelay"
      >
        <div class="select-popover__header">
          <el-input
            v-if="filterable"
            ref="eePersonSearchInput"
            v-model="searchKeywords"
            class="search-keywords_input"
            size="small"
            placeholder="请输入关键字"
            @input="inputChange"
          >
            <i
              slot="suffix"
              class="iconfont icon-icon-32-sousuo"
              @click="inputChange(searchKeywords)"
            ></i>
          </el-input>
        </div>
        <div class="select-popover__content">
          <slot name="group-title">
            <div v-if="filterable || searchKeywords" class="list-group">
              <span v-if="dropDowdMsg">
                {{ searchKeywords ? dropDowdMsg : '推荐选项' }}
              </span>
              <span v-else>{{ searchKeywords ? '搜索结果' : '推荐选项' }}</span>
              &middot;
              <span>{{ optionListView.length }}</span>
              <span
                v-if="selectedValueArr.length && clearMsg"
                class="clear-btn"
                @click="handleClear"
              >
                {{ clearMsg }}
              </span>
            </div>
          </slot>
          <ul
            v-if="optionListView && optionListView.length > 0"
            ref="optionList"
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="remote && infiniteScrollDisabled"
            class="option_list"
          >
            <li
              v-for="(opt, index) in optionListView"
              :key="index"
              :class="`list-item ${
                selectedValueArr &&
                selectedValueArr.indexOf(opt[prop.value]) !== -1
                  ? 'active'
                  : ''
              } ${multiple ? 'multiple-item' : ''} ${
                opt[prop.isChild] || opt.isChild ? 'child-li' : ''
              }  `"
              @click="changeChooseDebounce(opt)"
            >
              <slot :opt="opt" :prop="prop">
                <el-tooltip
                  :disabled="!optionShowTips"
                  effect="dark"
                  :content="optionTipsGenerator(opt)"
                >
                  <div class="list-item__left">
                    <img
                      v-if="opt.img"
                      class="list-item__image"
                      :src="opt.img"
                      alt="图标"
                    />
                    <div class="list-item__text">
                      <div
                        class="list-item__text__label ellipsis"
                        :title="opt[prop.label]"
                        v-html="
                          handleOptions ? handleOptions(opt) : opt[prop.label]
                        "
                      ></div>
                      <div
                        v-if="opt.extraInfo"
                        class="list-item__text__ext ellipsis"
                        :title="opt.extraInfo"
                      >
                        {{ opt.extraInfo }}
                      </div>
                    </div>
                  </div>
                  <div v-if="multiple" class="list-item__right">
                    <el-checkbox
                      :value="isChoose(opt)"
                      @change="changeChooseDebounce(opt)"
                    ></el-checkbox>
                  </div>
                  <div v-else class="list-item__right">
                    <i
                      v-if="isChoose(opt)"
                      class="iconfont icon-icon-64-xuanzhongrenyuan"
                    ></i>
                  </div>
                </el-tooltip>
              </slot>
            </li>
          </ul>
          <ul
            v-else-if="
              backfill &&
              !searchKeywords &&
              selectedOption &&
              selectedOption.length > 0
            "
            ref="optionList"
            class="option_list"
          >
            <li
              v-for="(opt, index) in selectedOption"
              :key="index"
              :class="`list-item active ${multiple ? 'multiple-item' : ''} ${
                opt[prop.isChild] || opt.isChild ? 'child-li' : ''
              }  `"
              @click="changeChooseDebounce(opt)"
            >
              <slot :opt="opt" :prop="prop">
                <span
                  :title="opt[prop.label]"
                  v-html="handleOptions ? handleOptions(opt) : opt[prop.label]"
                ></span>
                <i v-if="multiple" class="iconfont icon-zhengque"></i>
              </slot>
            </li>
          </ul>
          <p v-else v-loading="loading" class="no-option">无匹配数据</p>
        </div>
        <div v-if="multiple" class="select-popover__footer">
          <div class="select-popover__footer__left select-count-wrap">
            <span
              class="select-count"
              :class="{ 'border-right': !required && clearable }"
            >
              已选
              <span v-if="selectedOption.length > 0" class="count">
                {{ selectedOption.length }}
              </span>
              <span v-else>0</span>
              项
            </span>
          </div>
          <div class="select-popover__footer__right">
            <el-button size="small" @click="clearSelectedOption">
              重置
            </el-button>
            <el-button type="primary" size="small" @click="handleConfirm">
              确定
            </el-button>
          </div>
        </div>
      </div>

      <template slot="reference">
        <!-- 防止 clickoutside 触发 -->
        <div @mouseup="handleMouseUp">
          <!-- <div> -->
          <slot name="reference">
            <div
              class="select-opt-input"
              :class="[
                disabled === true || readonly === true ? 'disabled' : '',
                openStatus ? 'select-opt-input__opened' : '',
                'select-opt-input--' + size
              ]"
              @mouseover="mouseOverFn"
              @mouseout="setCloseDelay"
            >
              <div
                v-if="selectedOption && selectedOption.length"
                class="select-label ellipsis"
              >
                <slot name="label">
                  <template v-if="multiple && collapseTags">
                    <el-tooltip
                      :disabled="!showTooltip"
                      :content="
                        selectedOption.map((i) => i[prop.label]).join(',')
                      "
                      placement="top"
                      :effect="tooltipEffect"
                    >
                      <div class="select-label__list">
                        <el-tag
                          :closable="!disabled"
                          class="select-label__tags"
                          disable-transitions
                          @close="handleTagClick(selectedOption[0])"
                        >
                          <div class="select-label__tags-text ellipsis">
                            {{ selectedOption[0][prop.label] }}
                          </div>
                        </el-tag>
                        <el-tag
                          v-if="selectedOption.length > 1"
                          :closable="false"
                          disable-transitions
                        >
                          +{{ selectedOption.length - 1 }}
                        </el-tag>
                      </div>
                    </el-tooltip>
                  </template>
                  <template v-else-if="multiple">
                    <div class="select-label__list">
                      <el-tag
                        v-for="item in selectedOption"
                        :key="item[prop.label]"
                        :closable="!disabled"
                        class="select-label__tags"
                        disable-transitions
                        @close="handleTagClick(item)"
                      >
                        <div class="select-label__tags-text ellipsis">
                          {{ item[prop.label] }}
                        </div>
                      </el-tag>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      :class="
                        disabled === true || readonly === true
                          ? ''
                          : 'select-label__single'
                      "
                    >
                      {{ selectedOption[0][prop.label] }}
                    </span>
                  </template>
                </slot>
              </div>
              <span
                v-else
                class="no-label"
                :class="
                  disabled === true || readonly === true ? 'no-label-color' : ''
                "
              >
                {{ placeholder || `请选择${label || ''}` }}
              </span>
              <span class="icon-arrow" :class="{ 'icon-clearable': showClear }">
                <i
                  class="iconfont icon-icon-12-xialajiantou icon-arrow__down"
                  :class="
                    openStatus
                      ? 'icon-icon-12-xialajiantou--opened'
                      : 'icon-icon-12-xialajiantou--closed'
                  "
                />
                <i
                  v-if="showClear"
                  class="el-icon-circle-close icon-arrow__clear"
                  @click.stop="handleClear"
                />
              </span>
            </div>
          </slot>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'

import isObject from 'lodash/isObject'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import unionWith from 'lodash/unionWith'

export const PopperMixin = {
  props: {
    trigger: {
      //下拉框触发方式 click/focus/hover/manual/hoverClick--hover显示click隐藏
      type: String,
      default: 'click'
    }
  },
  computed: {
    realTrigger() {
      return this.trigger === 'hoverClick' ? 'click' : this.trigger
    }
  },
  data() {
    return {
      openStatus: false,
      closeDelay: 200
    }
  },
  methods: {
    setCloseDelay() {
      this.closeDelay = 200
    },
    mouseOverFn() {
      if (this.trigger === 'hoverClick') {
        this.openStatus = true
      }
      this.setCloseDelay()
    }
  }
}

export default {
  directives: {
    Clickoutside
  },
  mixins: [PopperMixin],
  model: {
    prop: 'choose',
    event: 'input'
  },
  props: {
    disabled: {
      //整个组件不可用状态
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      required: false
    },
    required: {
      //是否必选，不能为空
      type: Boolean,
      default: true
    },
    clearable: {
      // 是否显示清除按钮
      type: Boolean,
      default: false
    },
    filterable: {
      //是否可以搜索
      type: Boolean,
      default: true
    },
    placeholder: {
      //选择框没选项的时候提示信息
      type: String,
      default: ''
    },
    remote: {
      // 是否可以远程搜素（通过接口搜索）
      type: Boolean,
      default: false
    },
    remoteMethod: {
      type: Function
    },
    // loadImmediate: {
    //   type: Boolean,
    //   default: false
    // },
    // remoteUrl: {
    //   //搜索接口
    //   type: String,
    //   default: '',
    // },
    // remoteParams: {
    //   //搜索参数
    //   type: Object,
    //   default: () => {},
    // },
    keywordsParamsName: {
      //接口关键词参数的名称
      type: String,
      default: 'keywords'
    },
    prop: {
      //选项对应的键值
      type: Object,
      default: function () {
        return {
          label: 'label',
          value: 'value',
          isChild: 'isChild'
        }
      }
    },
    options: {
      //选项列表
      type: Array,
      default: () => []
    },
    choose: {
      //已选项
      type: [Array, Number, String],
      default: ''
    },
    handleOptions: Function, // 自定义下拉展示内容
    filterMethod: Function, //自定义搜索方法,
    placement: {
      //下拉框弹出位置 top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
      type: String,
      default: 'bottom-start'
    },
    trigger: {
      //下拉框触发方式 click/focus/hover/manual
      type: String,
      default: 'click'
    },
    multiple: {
      //是否可多选
      type: Boolean,
      default: false
    },
    multipleLimit: {
      //限制最多可以选择几项
      type: Number,
      default: 0
    },
    width: {
      type: [Number, String],
      default: '240'
    },
    tooltipEffect: {
      //气泡提示框的颜色，默认为白色
      type: String,
      default: 'light'
    },
    backfill: {
      //当下拉列表没内容的时候，是否需要回填已选项
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    virtual: Boolean,
    pageSize: {
      type: Number,
      default: 10
    },
    updateProps: {
      type: Object
    },
    infiniteScrollDisabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: function (value) {
        if (!value) return true
        return ['small', 'medium', 'mini'].indexOf(value) > -1
      }
    },
    beforeChoose: {
      type: Function,
      default: () => Promise.resolve()
    },
    afterChoose: {
      type: Function,
      default: () => Promise.resolve()
    },
    dropDowdMsg: {
      type: String,
      default: ''
    },
    clearMsg: {
      //显示迭代清空按钮
      type: String,
      default: ''
    },
    optionShowTips: {
      type: Boolean,
      default: false
    },
    optionTipsGenerator: {
      type: Function,
      default: () => ''
    }
  },
  data() {
    return {
      cacheSelectedOption: [],
      cacheInitData: null,
      afferentChooseType: 'objArray', // 判断传入的选中字段是什么类型 str('1,2'), strArray([1,2]), objArray([{label: '', value: ''}])
      loading: false,
      searchKeywords: '',
      selectedOption: [],
      selectedValueArr: [],
      optionList: [],
      searchTimer: null,
      optionListView: [],
      isClickHide: false,
      page: 1 // 分页加载
    }
  },
  computed: {
    showClear() {
      return this.clearable && this.choose?.length
    }
  },
  watch: {
    options(val) {
      this.optionList = val
    },
    choose: {
      handler(val) {
        this.afferentChooseType = this.getAfferentChooseType(val)
        this.getSelectOption()
      },
      deep: true
    },
    optionList(val) {
      this.setOptionList(val)
    }
  },
  created() {
    if (this.options && this.options.length > 0) {
      this.optionList = this.options
    }
    if (this.choose) {
      this.afferentChooseType = this.getAfferentChooseType(this.choose)
      this.getSelectOption()
    }
  },
  methods: {
    // 判断是否为选中状态，类型可能不一致，未使用indexOf includes
    isChoose(opt) {
      return this.selectedValueArr.some((it) => opt[this.prop.value] == it)
    },
    getAfferentChooseType(choose) {
      let chooseType = Object.prototype.toString.call(choose)
      let afferentChooseType = ''
      // if (this.remote) {
      //   this.afferentChooseType = 'objArray'
      // } else if (['[object String]', '[object Number]'].includes(chooseType)) {
      if (['[object String]', '[object Number]'].includes(chooseType)) {
        afferentChooseType = 'str'
      } else if (chooseType === '[object Array]') {
        if (!isObject(choose[0])) {
          afferentChooseType = 'strArray'
        } else {
          afferentChooseType = 'objArray'
        }
      } else {
        afferentChooseType = 'objArray'
      }
      return afferentChooseType
    },
    getSelectOption() {
      const selectedOptionCopy = cloneDeep(this.selectedOption || [])
      // const options = isEmpty(this.options) ? selectedOptionCopy : this.options
      // 合并下拉选项，处理选中不回显问题
      const options = unionWith(this.options, selectedOptionCopy, (a, b) => {
        return a[this.prop.value] === b[this.prop.value]
      })

      if (this.afferentChooseType === 'str') {
        let chooseArr = String(this.choose).split(',')
        this.selectedOption = options.filter((item) =>
          chooseArr.includes(String(item[this.prop.value]))
        )
      } else if (this.afferentChooseType === 'strArray') {
        let chooseArr = Array.isArray(this.choose)
          ? this.choose
          : String(this.choose).split(',')
        this.selectedOption = options.filter((item) =>
          chooseArr.includes(item[this.prop.value])
        )
      } else {
        this.selectedOption = this.choose.filter(
          (item) => item[this.prop.label] !== '' && item[this.prop.value] !== ''
        )
      }
      this.selectedValueArr = this.selectedOption.map(
        (item) => item[this.prop.value]
      )
    },
    showPopover() {
      this.cacheSelectedOption = JSON.parse(JSON.stringify(this.selectedOption))
      this.searchKeywords = ''
      this.searchOption('')
      this.$nextTick(() => {
        this.$refs.simpleSelectPopover.updatePopper() // 重新计算下拉框弹出的位置
        this.closeDelay = 5000
        this.$refs.eePersonSearchInput && this.$refs.eePersonSearchInput.focus()
      })
      !this.multiple &&
        this.$nextTick(() => {
          this.setScrollPos()
        })
      // 记录初始值
      this.cacheInitData = JSON.stringify(this.choose)
      this.$emit('popover-visible', true)
    },
    hidePopover() {
      // 点击其他地方关闭popover的时候，恢复之前的选项
      // if (!this.isClickHide) {
      //   let originalLen = this.choose.length
      //   let newOptionLen = this.selectedOption.length
      //   if (originalLen != newOptionLen) {
      //     this.selectedOption = JSON.parse(
      //       JSON.stringify(this.cacheSelectedOption)
      //     )
      //     this.selectedValueArr = this.cacheSelectedOption.map(
      //       (it) => it[this.prop.value]
      //     )
      //   } else {
      //     let chooseList = []
      //     if (this.afferentChooseType === 'str') {
      //       chooseList = String(this.choose).split(',')
      //     } else if (this.afferentChooseType === 'strArray') {
      //       chooseList = this.choose
      //     } else {
      //       chooseList = this.choose.map((item) => item[this.prop.value])
      //     }
      //     let isContain = this.selectedOption.some((item) => {
      //       return this.choose.includes(item[this.prop.value])
      //     })
      //     if (!isContain) {
      //       this.selectedOption = JSON.parse(
      //         JSON.stringify(this.cacheSelectedOption)
      //       )
      //       this.selectedValueArr = this.cacheSelectedOption.map(
      //         (it) => it[this.prop.value]
      //       )
      //     }
      //   }
      // }
      // modidied by wangyu94 2023-01-29 产品和交互确认过，点击空白既保存, 2023-02-01 确定按钮加回，改来改去的😡
      if (this.multiple && !this.isClickHide) {
        let isChanged = false

        let originalLen = this.choose.length
        let newOptionLen = this.selectedOption.length
        if (originalLen != newOptionLen) {
          isChanged = true
        } else {
          isChanged = this.selectedOption.some((item) => {
            return !this.choose.includes(item[this.prop.value])
          })
        }

        isChanged && this.updateChooseValue()
      }

      this.searchKeywords = ''
      this.optionList = this.options
      this.setOptionList(this.optionList)
      this.$refs.eePersonSearchInput && this.$refs.eePersonSearchInput.blur()
      this.validateSelect()
      this.loading = false
      //   下拉收起事件，当choose发生变化的时候才触发
      if (JSON.stringify(this.choose) != this.cacheInitData) {
        this.$emit('popover-visible', false)
      }
      this.isClickHide = false
    },
    setScrollPos() {
      const optionWrap = this.$refs.optionList
      if (!optionWrap) return
      const activeItem =
        optionWrap.getElementsByClassName('list-item active')[0]
      if (activeItem) {
        let otherHeight = 4
        if (this.filterable) {
          otherHeight += 41
        }
        if (!this.required && this.clearable) {
          otherHeight += 40
        }
        optionWrap.scrollTop = activeItem.offsetTop - otherHeight
      }
    },
    inputChange(val) {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }
      this.searchTimer = setTimeout(() => {
        this.searchOption(val.trim())
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }, 300)
    },
    searchOption(val) {
      if (this.remote) {
        // if (!this.remoteUrl) {
        //   this.$emit('remote-search', event)
        //   return false
        // } else {
        //   this.remoteMethod(val)
        // }
        // TODO: 远程搜索
        if (this.remoteMethod) {
          this.search(val)
        }
      } else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val)
      } else {
        this.filterOption(val)
      }
      this.$nextTick(() => {
        this.$refs.simpleSelectPopover.updatePopper() // 重新计算下拉框弹出的位置
        this.closeDelay = 5000
      })
    },
    // remoteMethod(val) {
    //   if (this.multiple) {
    //     if (
    //       this.remoteParams != undefined &&
    //       this.remoteParams.source != undefined &&
    //       this.remoteParams.source &&
    //       this.remoteParams.source === 'bugPool' &&
    //       val === ''
    //     )
    //       return
    //     if (
    //       this.remoteParams != undefined &&
    //       this.remoteParams.source != undefined &&
    //       this.remoteParams.source &&
    //       this.remoteParams.source === 'bugPool' &&
    //       val.indexOf("'") >= 0
    //     )
    //       return
    //   }
    //   let params = {
    //     [this.keywordsParamsName]: val,
    //   }
    //   Object.assign(params, this.remoteParams)
    //   this.loading = true
    //   this.postRequest({
    //     url: this.remoteUrl,
    //     params: params,
    //   })
    //     .then((res) => {
    //       this.$emit('remote-search', res)
    //       this.loading = false
    //       this.$nextTick(() => {
    //         this.$refs.simpleSelectPopover.updatePopper() // 重新计算下拉框弹出的位置
    //       })
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // },
    filterOption(val) {
      if (!/^\s*$/.test(val)) {
        this.optionList = this.options.filter(
          (item) => item[this.prop.label].indexOf(val) >= 0
        )
      } else {
        this.optionList = this.options
      }
      this.setOptionList(this.optionList)
    },
    changeChoose(opt) {
      let selectedOption = cloneDeep(this.selectedOption)
      let selectedValueArr = cloneDeep(this.selectedValueArr)
      if (!this.multiple) {
        // 如果是单选且非必填，再次点击了选中的值，需要清空
        console.log('required', this.required)
        let isExist = selectedValueArr.some((it) => opt[this.prop.value] == it)
        selectedOption = !this.required && isExist ? [] : [opt]
        this.openStatus = false
      } else {
        const valueArr = selectedOption.map((item) => item[this.prop.value])
        const index = valueArr.indexOf(opt[this.prop.value])
        if (index >= 0) {
          selectedOption.splice(index, 1)
        } else if (
          !this.multipleLimit ||
          (this.multipleLimit &&
            this.multipleLimit > 0 &&
            selectedOption.length < this.multipleLimit)
        ) {
          selectedOption.push(opt)
        }
      }
      selectedValueArr = selectedOption.map((item) => item[this.prop.value])
      const { emitChangeValue } = this.getEmitValue(selectedOption)
      return this.beforeChoose(emitChangeValue, selectedOption)
        .then(() => {
          this.selectedOption = selectedOption
          this.selectedValueArr = selectedValueArr

          if (!this.multiple) {
            this.updateChooseValue()
          }
        })
        .then(() => {
          return this.afterChoose(emitChangeValue, selectedOption)
        })
        .then(() => {})
    },
    // eslint-disable-next-line no-unused-vars
    changeChooseDebounce: debounce(function (opt) {
      this.changeChoose(opt)
    }, 80),
    validateSelect() {
      this.$emit('validateFn')
    },
    getEmitValue(selectedOption) {
      let emitVal = selectedOption.concat([])
      if (this.afferentChooseType === 'str') {
        emitVal = selectedOption.map((item) => item[this.prop.value]).join(',')
      }
      if (this.afferentChooseType === 'strArray') {
        emitVal = selectedOption.map((item) => item[this.prop.value])
      }
      // change 事件默认传递处理 emitVal，如果参数有updateProps, 则通过updateProps配置的key，value进行转换，然后传递对象出去
      const emitChangeValue = !isEmpty(this.updateProps)
        ? selectedOption.map((s) => {
            let o = { ...s }
            Object.keys(this.updateProps).reduce((acc, prop) => {
              const sProp = this.updateProps[prop]
              o[prop] = s[sProp] || o[prop]
              return acc
            }, o)
            return o
          })
        : emitVal

      return {
        emitVal,
        emitChangeValue
      }
    },
    updateChooseValue() {
      const { emitVal, emitChangeValue } = this.getEmitValue(
        this.selectedOption
      )
      this.$emit('input', emitVal)
      this.$emit('change', emitChangeValue)
    },
    clearSelectedOption() {
      this.selectedOption = []
      this.selectedValueArr = []
      // this.updateChooseValue()
    },
    handleConfirm() {
      this.isClickHide = true
      this.openStatus = false
      this.updateChooseValue()
    },
    handleTagClick(item) {
      this.changeChoose(item).then(() => {
        if (this.openStatus === false) {
          this.updateChooseValue()
        }
      })
    },
    search(val) {
      this.page = 1
      this.optionListView = []
      this.load(val)
    },
    loadMore() {
      return this.load(this.searchKeywords || '')
    },
    load(val) {
      if (this.virtual && !this.remote && this.optionListCopy.length) {
        this.optionListView.push(
          ...this.optionListCopy.splice(0, this.pageSize)
        )
      } else if (this.virtual && this.remote && this.remoteMethod) {
        this.remoteMethod({
          page: this.page,
          pageSize: this.pageSize,
          search: val
        }).then((res) => {
          if (this.page === 1) {
            !isEmpty(res) && (this.optionListView = res)
            this.page++
          } else if (!isEmpty(res)) {
            this.optionListView.push(...res)
            this.page++
          }
          this.$nextTick(() => {
            this.$refs.simpleSelectPopover.updatePopper() // 重新计算下拉框弹出的位置
            this.closeDelay = 5000
          })
        })
      }
    },
    setOptionList(list) {
      if (this.virtual) {
        this.optionListCopy = cloneDeep(list)
        this.optionListView =
          this.optionListCopy.length > this.pageSize
            ? this.optionListCopy.splice(0, this.pageSize)
            : this.optionListCopy
      } else {
        this.optionListView = list
      }
    },
    handleClickoutside() {
      this.openStatus && (this.openStatus = false)
    },
    handleClear() {
      const { emitVal, emitChangeValue } = this.getEmitValue([])
      this.openStatus = false
      this.$emit('input', emitVal)
      this.$emit('change', emitChangeValue)
    },
    handleMouseUp(e) {
      if (!this.readonly) {
        e.stopPropagation()
      }
    }
  }
}
</script>
<style lang="scss">
$input-height: 32px;
$input-line-height: 32px;
$size-mini-height: 28px;

.el-popper.simple_select_popover .popper__arrow {
  display: none;
}
.el-popper.simple_select_popover {
  max-width: 400px;
  height: auto;
  margin-top: $base-gap * 2 !important;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
  border: 0;
  padding: 0;

  .select-count-wrap {
    display: flex;
    align-items: center;
    height: 40px;
    // padding: 12px 16px;
    line-height: 16px;
    white-space: nowrap;
    .select-count {
      color: $sub-color;
      font-size: 12px;
      padding-right: $base-gap * 2;
      margin-right: $base-gap * 2;
      &.border-right {
        border-right: 1px solid #eeeeee;
      }
      .count {
        color: $font_sumary-color;
      }
    }
    .clear-btn {
      color: $primary-color;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .popover-body {
    font-size: 14px;
    color: #354052;
    width: auto;
    padding: $base-gap * 2 0 $base-gap * 3;
    .select-popover {
      &__header {
        margin-bottom: $base-gap * 2;
        padding: 0 $base-gap * 2;
        .search-keywords_input {
          background-color: #ffffff;
          border: 1px solid $color-line;
          border-radius: $base-border-radius;
          height: $input-height;
          line-height: $input-line-height;
          .el-input__inner {
            padding: 0 $base-gap * 2;
            height: 20px;
            line-height: 20px;
            background: rgba(255, 255, 255, 0.09);
            border: none;
            font-size: 12px;
            color: $primary-text-color;
            &:hover,
            &:focus {
              box-shadow: none;
            }
          }
          .el-input__suffix {
            .icon-icon-32-sousuo {
              font-size: 24px;
              color: $primary-text-color;
            }
            .el-input__icon {
              display: none;
            }
          }
        }
      }

      &__content {
        .list-group {
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          color: $font-color;
          text-align: left;
          padding: 0 $base-gap * 2;
          margin-bottom: $base-gap * 2;
          .clear-btn {
            float: right;
            color: #0364ff;
            cursor: pointer;
          }
        }
        .option_list {
          max-height: 320px;
          overflow-y: auto;

          .list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: $base-gap * 2;
            // height: auto;
            // line-height: 40px;
            line-height: 1;
            height: auto;
            position: relative;
            overflow: hidden;
            font-size: 14px;
            color: $font-color;
            cursor: pointer;
            &.active,
            &:hover {
              background: #f6f7fa;
              color: $primary-color;
            }
            &.multiple-item {
              // padding-right: $base-gap * 2 * 4;
            }
            &.child-li {
              padding-left: $base-gap * 2 * 5;
            }
            &__left {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: calc(100% - 30px);
            }
            &__right {
              width: 40px;
              flex: 0 0 30px;
              display: flex;
              align-content: center;
              justify-content: flex-end;
              .icon-icon-64-xuanzhongrenyuan {
                font-size: 20px;
                color: #0364ff;
              }
            }
            &__image {
              height: 28px;
              width: 28px;
              border-radius: 50%;
              margin-right: $base-gap * 2;
              flex: 0 0 28px;
            }

            &__text {
              width: 0;
              min-height: 24px;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;

              &__label {
                font-size: $font-size;
                color: $font-color;
                line-height: 20px;
              }

              &__ext {
                font-size: $font-size-small;
                color: $secondary-text-color;
                line-height: 16px;
                margin-top: $base-gap;
              }
            }

            .icon-zhengque {
              vertical-align: unset;
              font-size: 12px;
              position: absolute;
              right: $base-gap * 2 * 2;
            }
          }
        }
        .no-option {
          padding: $base-gap * 2 * 2 0 $base-gap * 2 * 2;
          font-size: 12px;
          text-align: center;
          color: #a9abba;
        }
      }

      &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $base-gap * 2;
        padding: 0 $base-gap * 2;
      }
    }
  }
}
#simple_select {
  .select-label,
  .no-label {
    max-width: calc(100% - $base-gap * 6);
    font-size: 14px;
    color: $font-hint-color;
    line-height: 20px;
    margin-right: $base-gap * 2;
    // color: $sub-color;
  }
  .icon-arrow {
    line-height: 0.5;

    &__clear {
      display: none;
      color: $icon-color;
      font-size: 16px;
    }
  }
  .icon-clearable {
    &:hover {
      .icon-arrow__down {
        display: none;
      }
      .icon-arrow__clear {
        display: inline;
      }
    }
  }
  .select-label {
    &__list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-bottom: -$base-gap;
      max-width: 100%;
    }
    &__tags {
      display: flex;
      align-items: center;
      height: 22px;
      line-height: 22px;
      margin-right: $base-gap;
      margin-bottom: $base-gap;
      max-width: 100%;
      border: none;
      background: $color-line;
      color: $primary-text-color;
      // &:hover {
      //   .el-icon-close {
      //     display: inline-block;
      //   }
      // }
      &-text {
      }
      .el-icon-close {
        // display: none;
        top: 0;
        color: $secondary-text-color;

        &:hover {
          background: none;
        }
      }
    }
    &__single {
      color: $font-color;
    }
    .more-btn {
      display: inline-block;
      padding: 4px 8px;
      background-color: #f5f7fa;
      border: 1px solid #cad2dd;
      border-radius: 2px;
      font-size: 12px;
      color: #a9abba;
      line-height: 12px;
      margin-left: 4px;
    }
  }
  .el-icon-caret-bottom {
    font-size: 8px;
    color: #c6c9ce;
  }
  .select-opt-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // height: $input-height;
    // line-height: $input-line-height;
    border: 1px solid $color-line;
    border-radius: $base-border-radius;
    // width: fit-content;
    max-width: 100%;
    padding: $base-gap $base-gap * 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all $duration ease-in;

    &--mini {
      font-size: $font-size-mini;
      min-height: 22px;
      line-height: 22px;
    }

    &--medium {
      font-size: $font-size-large;
    }

    &--small {
      font-size: $font-size-small;
    }

    .icon-icon-12-xialajiantou {
      color: $secondary-text-color;
      transition: transform $duration ease-in;
    }
    &:hover,
    &:focus,
    &__opened {
      border-color: $primary-color;
      .icon-icon-12-xialajiantou {
        color: $primary-text-color;
      }
    }
    &__opened {
      .icon-icon-12-xialajiantou {
        transform: rotate(-180deg);
      }
    }
    &.disabled {
      background-color: #f8f9fa !important;
      color: #ced4e0 !important;
      cursor: not-allowed !important;

      &:hover {
        .icon-icon-12-xialajiantou {
          color: $secondary-text-color;
        }
      }
      .no-label-color {
        color: #ced4e0 !important;
      }
    }
  }
}
</style>
