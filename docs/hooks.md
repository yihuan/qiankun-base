# 公用 Hooks(Composables)方法

## useNavigation

  路由导航相关，提供在新页面打开的方法
  Vue2 使用`@/utils/navigation.util.js`

- 使用方法

  ```js
  import { useNavigation } from '@/hooks/useNavigation'

  const { openNewTab } = useNavigation()

  openNewTab({
    name: 'router-name',
    query: { ... },
    params: { ... }
  })
  ```

## useMesishi

  美事相关方法

- 使用方法

  ```js
  import { useMeishi } from '@/hooks/useMeishi'
  import { TYPE as MEISHI_TYPE } from '@/constants/meishi.const'

  const { openMeishi } = useMeishi()
  openMeishi(MEISHI_TYPE.PERSON, 'user_id')
  ```

## usePagination

  分页相关，包含分页信息及相关方法

- 参数
  - getList {*Function*} - 获取列表方法
  - options {*Object*} - 选项，fitlerOptions{Object}: 过滤条件， pageProp{Object}: 分页参数属性，默认为：pageNum 和 pageSize

- 使用方法

  ```html
  <BasePagination
    :current-page="page"
    :page-size="pageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @prev="handlePrev"
    @next="handleNext"
  />
  ```

  ```js
  import { usePagination } from '@/hooks/usePagination'
  import BasePagination from '@/components/common/BasePagination.vue'

  const {
    page,                 // 当前页：ref 类型
    pageSize,             // 每页条数：ref 类型
    DEFAULT_PAGE,         // 默认当前页：1
    DEFAULT_PAGE_SIZE,    // 默认每页条数：10
    handleCurrentChange,  // 页码切换方法
    handleNext,           // 下一页方法
    handlePrev,           // 上一页方法
    handleSizeChange      // 每页条数改变方法
  } = usePagination(getList, { pageProps: { page: 'currentPage', pageSize: 'pageSize'} })
  ```
