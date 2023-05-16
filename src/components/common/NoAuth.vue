<!--
 * @Author: chenxuejiao01
 * @Date: 2022-12-14 16:24:12
 * @LastEditTime: 2022-12-14 22:03:34
 * @Description: 无权限提示页面
-->
<template>
  <div class="forbidden">
    <div class="fbd__content">
      <img src="@/assets/images/noauth.png" />
      <p class="tips mb_base">
        <em class="msg">
          {{ resultJson.msg }}
          <a
            v-if="resultJson.goToUrl"
            :href="`/base2${resultJson.goToUrl}`"
            class="apply-auth mr_base-half"
            target="_blank"
          >
            申请权限
          </a>
          <template v-if="resultJson.authMen && resultJson.authMen.length > 0">
            或联系以下管理员
          </template>
        </em>
      </p>
      <p class="tips ellipsis">
        <ee-meishi-card
          v-for="user in resultJson.authMen"
          :key="user.value"
          class="person"
          :user-name="user.value"
          :user-label="user.label"
        >
          {{ user.label }}
        </ee-meishi-card>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EeMeishiCard from '@/components/common/EeMeishiCard'

import { _updateUrlParams, getParamsFromUrl } from '@/utils/lib.util'
import { userApi } from '@/request/api'
const props = defineProps({
  token: {
    type: [String, Number]
  }
})
const resultJson = ref({
  msg: '暂无权限',
  authMen: '',
  remark: ''
})

const getDetails = (token) => {
  userApi
    .getAuthMsg({
      token: token
    })
    .then((res) => {
      resultJson.value = {
        ...res.data.authMsg
      }
      _updateUrlParams({
        token: ''
      })
    })
}

onMounted(() => {
  if (props.token) {
    this.getDetails(props.token)
  } else {
    let token = getParamsFromUrl('token')
    token && this.getDetails(token)
  }
})
</script>

<style lang="scss" scoped>
.forbidden {
  position: relative;
  height: 100%;
  min-height: 40vh;
  background: #fff;
  .fbd__content {
    display: inline-block;
    position: absolute;
    height: 50%;
    max-width: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -80%);
  }

  img {
    display: block;
    height: 100%;
    margin: 0 auto;
  }
  .tips {
    font-size: 14px;
    line-height: 1.5em;
    text-align: center;
    .msg {
      color: #b0b0b0;
      .apply-auth {
        text-decoration: underline;
        color: #0364ff;
      }
    }
    .person {
      color: #0364ff;
    }
  }
}
</style>
