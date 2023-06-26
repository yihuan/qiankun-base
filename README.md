# qiankun基座项目

qiankun基座项目，通过 [`qiankun`](https://qiankun.umijs.org/zh/guide) 加载其他子项目

## 项目启动

### 本地开发

- 包管理工具：yarn（建议，远程打包机器也是用的yarn）
- Node 版本：14.19.2
- 本地安装：`yarn` or `yarn install`
- 本地删除重新安装：`yarn reinstall`
- 本地启动：`yarn start`
- 编译打包：`yarn build`
- Lint：`yarn lint`

### 子应用配置

菜单或页面中需要加载子应用页面的配置

- 在 `app.const.js` 中 `SUB_APPS` 中配置子应用详细信息

  ```js
  // key: 唯一值，区分子应用，路由配置需要
  // domain: 子应用域名
  // shortPath: 短路径名称
  export const SUB_APPS = freeze({
    WORK: freeze({
      key: 'work',
      domain: isProd
        ? `${origin}/work/`                // 远程环境配置
        : 'http://localdomain.com:8001/work/', // 本地配置
      shortPath: 'w'
    })
  }
  ```

- 在路由 `router/index.js` 中配置路由

  ```js
  // router/index.js
  {
    name: 'HomeWork',
    path: SUB_APPS.WORK.shortPath,
    component: () => import('@/views/HomeWork.vue')
  }
  ```

  在需要插入子应用页面的地方引入 `SubAppEntry`

  ```html
  // HomeWork.vue
  <template>
    <SubAppEntry />
  </template>
  <script setup>
  import SubAppEntry from '@/components/common/SubAppEntry.vue'
  </script>
  ```

  路由页面中指定位置引入子应用可参考[这里](https://qiankun.umijs.org/zh/faq#%E5%A6%82%E4%BD%95%E5%9C%A8%E4%B8%BB%E5%BA%94%E7%94%A8%E7%9A%84%E6%9F%90%E4%B8%AA%E8%B7%AF%E7%94%B1%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%BE%AE%E5%BA%94%E7%94%A8)

### 后端接口域名配置

`api.js` 中的 `BASE_URL` 定义。

```js
export const BASE_URL = isProd
  ? window.location.origin + '/work/'                   // 线上
  : window.location.protocol + '//localdomain.com/work/' // 本地
```

## 开发规范及示例文档

- [开发规范及相关](./docs/dev.md)
- [Vue3 基础语法使用示例](./docs/vue3syntax.md)
- [Vue3 语法快速上手（与 Vue 2 对比用法）](./docs/vue3easystart.md)
- [Pinia 用法示例](./docs/pinia.md)
- [代码提交规范](./docs/commit.md)
- [公用组件](./docs/components.md)
- [公用Hooks(Composables)](./docs/hooks.md)
