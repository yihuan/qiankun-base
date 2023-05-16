import { ref, unref } from 'vue'

/**
 * 分页相关方法
 * @param {Function} getList - 获取列表方法
 * @param {Object} options - 选项，fitlerOptions{Object}: 过滤条件， pageProp{Object}: 分页参数属性，默认为：pageNum 和 pageSize
 */
export function usePagination(
  getList = () => {},
  options = {
    defaultPageSize: 10,
    filterOptions: {},
    pageProps: { page: 'pageNum', pageSize: 'pageSize' }
  }
) {
  if (getList.length === 0) {
    throw new Error('获取列表方法未提供分页参数支持')
  }

  const { defaultPageSize, filterOptions, pageProps } = options

  const page = ref(1)
  const pageSize = ref(defaultPageSize || 10)
  const DEFAULT_PAGE = 1
  const DEFAULT_PAGE_SIZE = defaultPageSize || 10

  const pageProp = pageProps?.page || 'pageNum'
  const pageSizeProp = pageProps?.pageSize || 'pageSize'

  function handleSizeChange(size) {
    pageSize.value = size
    page.value = 1
    getList({
      ...unref(filterOptions),
      [pageProp]: 1,
      [pageSizeProp]: size
    })
  }

  function handleCurrentChange(pageNum) {
    page.value = pageNum
    getList({
      ...unref(filterOptions),
      [pageProp]: pageNum,
      [pageSizeProp]: pageSize.value
    })
  }

  function handlePrev(pageNum) {
    page.value = pageNum
    getList({
      ...unref(filterOptions),
      [pageProp]: pageNum,
      [pageSizeProp]: pageSize.value
    })
  }

  function handleNext(pageNum) {
    page.value = pageNum
    getList({
      ...unref(filterOptions),
      [pageProp]: pageNum,
      [pageSizeProp]: pageSize.value
    })
  }

  return {
    page,
    pageSize,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    handleSizeChange,
    handleCurrentChange,
    handlePrev,
    handleNext
  }
}
