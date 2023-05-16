<template>
  <div
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    :class="`ee-editor ${isFixed ? 'toolbar-fix' : ''}`"
  >
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <Editor
      v-model="content"
      :tinymce-script-src="tinymceScriptSrc"
      :init="init"
      :plugins="plugins"
      :toolbar="toolbar"
      :disabled="disabled"
      :inline="inline"
      :tag-name="tagName"
      :output-format="outputFormat"
      @onInit="handleInit"
      @onKeyup="handleKeyup"
      @onChange="handleChange"
      @onBlur="handleBlur"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

import debounce from 'lodash/debounce'
import { v4 as uuidv4 } from 'uuid'

import { workApi } from '@/request/api'

const props = defineProps({
  value: {
    type: String
  },
  disabled: {
    type: Boolean
  },
  inline: {
    type: Boolean
  },
  tagName: {
    type: String
  },
  width: {
    type: [Number, String]
  },
  height: {
    type: [Number, String],
    default: document.body.clientHeight > 800 ? 440 : 307
  },
  menubar: {
    type: Boolean
  },
  statusbar: {
    type: Boolean
  },
  outputFormat: {
    type: String,
    default: 'html',
    validator: (val) => ['html', 'text'].includes(val)
  },
  isFixed: {
    type: String,
    default: ''
  },
  minHeight: {
    type: Number
  },
  maxHeight: {
    type: Number
  },
  autoSave: {
    type: Boolean,
    default: true
  },
  autoFocus: {
    type: Boolean,
    default: true
  },
  contentStyle: {
    type: String,
    default:
      'body, img,p {font-size: 14px; max-width: 100%} p{ line-height: 24px; margin: 0 }'
  },
  projectId: [Number, String],
  workBaseId: Number,
  workBaseType: Number,
  placeholder: String,
  supportAt: {
    type: Boolean,
    default: false
  },
  getAtOptions: {
    type: Function,
    // 格式固定， https://www.tiny.cloud/docs/ui-components/autocompleter/#autocompleteitem
    default: () => {
      return Promise.resolve([])
    }
  },
  atContentGenerator: {
    type: Function,
    default: () => {
      return ''
    }
  },
  atOptionSelectCallback: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['input', 'blur'])

const cdnDomain = 'https://j1.58cdn.com.cn'
const baseUrl = cdnDomain + '/arthurupload/teg/yunxiao/static/tinymce'
const tinymceScriptSrc =
  cdnDomain + '/arthurupload/teg/yunxiao/static/tinymce/tinymce.min.js'

const defaultUploadImage =
  'https://j1.58cdn.com.cn/git/ep-fe/lantaiGrayLevel/img/default_img.png'

const init = {
  width: props.width,
  height: props.height,
  menubar: props.menubar,
  statusbar: props.statusbar,
  auto_focus: props.autoFocus,
  branding: false,
  base_url: baseUrl,
  plugins: ['autoresize', 'autolink'],
  convert_urls: false, // 不转换url
  max_height: props.maxHeight,
  min_height: props.minHeight,
  placeholder: props.placeholder,
  content_style: props.contentStyle,
  paste_data_images: true,
  extended_valid_elements: 'img[*]', // 保留img上的所有属性，否则无法访问第三方图片， referrerpolicy="no-referrer"
  paste_enable_default_filters: false,
  paste_postprocess: (plugin, args) => {
    let imgNodes = args.node.querySelectorAll('img')
    const isExternalSrc = (url) => {
      const httpReg = /^((ht|f)tps?):\/\//
      const isHttpOrFtp = httpReg.test(url)

      if (isHttpOrFtp) {
        const isIntelnal = [
          '58cdn.com.cn',
          '58corp.com',
          '58v5.cn',
          '58.com'
        ].some((internalDomain) => url.includes(internalDomain))

        return !isIntelnal
      }

      return false
    }

    const isMeishiDocSrc = (url) => {
      if (!url) return false
      return url.includes('/page/attachment/alias/')
    }

    imgNodes.forEach((imgNode, index) => {
      let src = imgNode.src

      if (isMeishiDocSrc(src)) {
        // 补充或更换域名
        const url = new URL(src)
        url.port = 443
        url.protocol = 'https'
        url.host = 'docs.58corp.com'
        src = url.href

        imgNode.src = src
      }
      if (!isExternalSrc(src)) {
        return
      }
      imgNode.setAttribute('data-urlsrc', src)
      imgNode.src = defaultUploadImage
      imgNode.id = 'img_' + uuidv4()
    })
    try {
      const editorIframeEl = document.querySelector('iframe[id^="tiny-vue"]')
      const editorIframeDoc = editorIframeEl.contentWindow.document

      setTimeout(() => {
        // upload image
        imgNodes.forEach((imgNode) => {
          const urlSrc = imgNode.getAttribute('data-urlsrc')
          if (!urlSrc) {
            return
          }
          uploadImgByUrl(urlSrc).then((url) => {
            const id = imgNode.id

            const realNode = editorIframeDoc.querySelector('#' + id) // .getElementById(id)
            const realNodeUrlSrc = realNode.getAttribute('data-urlsrc')
            if (urlSrc === realNodeUrlSrc) {
              realNode.src = url
              realNode.setAttribute('data-mce-src', url)
            }
          })
        })
      }, 0)
    } catch (error) {
      console.error(error)
    }
  },
  images_upload_handler: (blobInfo, success, failure) => {
    const formData = new FormData()
    formData.append('file', blobInfo.blob())
    formData.append(
      'workId',
      props.workBaseId === undefined ? 0 : props.workBaseId
    )
    formData.append('workType', 0)
    workApi
      .uploadAttachments(formData)
      .then((res) => {
        if (res.code == 200) {
          success(res.data.url)
          return
        }
        failure('上传失败')
      })
      .catch(() => {
        failure('上传出错')
      })
  },
  entity_encoding: 'raw',
  // @ 功能
  setup: function (editor) {
    // 注册at自动填充
    if (props.supportAt) {
      const atOptionSelectHandle = function (autocompleteApi, rng, value) {
        let optionItem = JSON.parse(value) // 反序列化拿到选择的用户对象
        editor.selection.setRng(rng)
        editor.insertContent(props.atContentGenerator(optionItem) + ' ')
        props.atOptionSelectCallback(optionItem)
        autocompleteApi.hide()
      }

      editor.ui.registry.addAutocompleter('specialchars', {
        ch: '@',
        minChars: 0,
        columns: 1,
        height: 240,
        onAction: atOptionSelectHandle,
        fetch: (pattern) =>
          new Promise((resolve) => {
            debouncedFetch(pattern, resolve)
          })
      })
    }
  }
}
let debouncedFetch = debounce((pattern, resolve) => {
  return props.getAtOptions(pattern).then((res) => {
    resolve(res)
  })
}, 180)

const plugins = 'fullscreen lists link image table code wordcount code paste'
const toolbar = `fullscreen | undo redo | bold italic underline |
    forecolor backcolor | bullist numlist | link | table`

const content = ref(props.value)
const loading = ref(true)

watch(content, (val) => {
  emit('input', val)
})

watch(
  () => props.value,
  (val) => {
    content.value = val
  }
)

const handleInit = () => {
  loading.value = false
}

// eslint-disable-next-line
const handleKeyup = (event, editor) => {}

// eslint-disable-next-line
const handleChange = (event, editor) => {}
// eslint-disable-next-line
const handleBlur = (event, editor) => {
  emit('blur', content.value)
  if (props.autoSave) {
    workApi.addOrUpdateDraft({
      content: content.value,
      projectId: props.projectId,
      workBaseId: props.workBaseId,
      workBaseType: props.workBaseType
    })
  }
}

const uploadImgByUrl = (img) => {
  return workApi
    .uploadImgByUrl({
      imgUrl: img,
      workId: props.workBaseId || 0,
      workType: props.workBaseType
    })
    .then((res) => {
      if (res.code === 200) {
        return res.data.url
      }
    })
}
</script>

<style lang="scss">
::v-deep .img {
  width: 100% !important;
}
.tox.tox-silver-sink.tox-tinymce-aux {
  z-index: 9999 !important;
  .tox-notifications-container {
    display: none;
  }
}

.ee-editor {
  .tox.tox-tinymce {
    border: 1px solid $color-line;

    .tox-editor-container {
      .tox-editor-header {
        top: 10px;

        .tox-toolbar__primary {
          background: none;
          border-bottom: 1px solid $color-line;

          .tox-toolbar__group:not(:last-of-type) {
            border-right: 1px dashed #ccc;
          }
        }
      }
    }
  }
  &.toolbar-fix {
    .tox.tox-tinymce {
      .tox-editor-container {
        .tox-editor-header {
          position: fixed;
          z-index: 50;
          background: $color-white;
          top: 0;
          right: 0;
          left: calc(100% - 67.16%); // 抽屉的宽度
        }
      }
      &.tox-fullscreen {
        .tox-editor-header {
          position: fixed;
          z-index: 50;
          background: $color-white;
          top: 0 !important;
          right: 0 !important;
          left: 0 !important;
        }
      }
    }
  }
}
</style>
