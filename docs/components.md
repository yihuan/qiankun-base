# 项目中公用组件

## SettingsLayout

设置项目系统页面布局组件（用于项目字段等）

- 属性
  - value(v-model) {*Number*} - 选择的业务线
  - title {*String*} - 页面标题
  - page-size {*Number*} - 分页相关属性与分页组件相同，请参考下面分页组件说明
  - page-sizes {*String[]*}
  - current-page {*Number*}
  - total {*Number*}
- 事件
  - change - 业务线切换事件，返回当前选择业务线
  - size-change - 分页相关事件与分页组件相同，请参考下面分页组件说明
  - current-change
  - prev
  - next
- Slot
  - default - 默认 Slot 放页面内容

## BaseTable

表格组件

- 属性
  - loading {*Boolean*} - 加载状态
  - columns {*Object[]*} - 展示的列，格式：[{ name: String; key: String; slot: String}]，name：表头名称，key：对应的 data 数据的 key 值，slot：使用 slot 的名称
  - data {*Object[]*} - 数据
  - height {*String | Number*} - 高度
  - max-height {*String | Number*} - 最大高度
  - stripe {*Boolean*} - 是否为斑马纹 table
  - border {*Boolean*} - 是否带有纵向边框
  - show-header {*Boolean*} - 是否显示表头，默认为 true
  - row-key {*String|Function*} - 行数据的 key，与 el-table 同
  - sortable {*Boolean*} - 是否可拖动排序，打开会在第一列显示拖动图标
  - canSort {*Boolean*} - 是否有拖动排序权限（是否显示拖动按钮），默认为 true
  - notDragableIndices {*Number[]*} - 不可拖动排序行的 index 值数组
- 事件
  - cell-setting - 鼠标滑过设置按钮点击事件钮，返回值为当前行的值（`showActions: true`）
  - cell-del - 鼠标滑过删除按钮点击事件钮，返回值为当前行的值（`showActions: true`）
  - sort-update - 拖动后列表更新时间，返回值为列表更新后的值
  - cell-mouse-enter - 单元格 hover 进入时触发
  - cell-mouse-leave - 单元格 hover 退出时触发
- Slot
  - [key]Actions - columns 中定义的 key 加 Actions，可以添加自定义按钮（鼠标滑过显示），需要 `showActions: true`，如 key 值为 name，则 slot 名称为 nameActions
- 其他
  - columns 中对象属性值
    - name {*String*} - 表头名称
    - key {*String*} - 对应数据中的 key 值
    - slot {*String*} - 使用 slot 的名称，如果设置，可以通过 slot 方式修改展示方式，如 slot 为 name，则是用方式如下：

      ```html
      <template #name="{ row }">{{ row.name }}</template>
      ````

    - tooltip {*Boolean*} - 内容过多是否省略号显示
    - headerSlot {*Boolean*} - 表头 slot，如为 `true` 则通过名为 `keyHeader` 的 `slot` 来制定，如：`nameHeader`
    - showActions {*Boolean*} - 是否显示操作按钮，如果配置了则在鼠标滑过当前行时在当前属性右侧展示操作按钮，默认为编辑和删除
    - width {*String*} - 与 `el-table Table-column` 列宽度属性一样
    - minWidth {*String*} - 与 `el-table Table-column` 列宽度属性一样

- 使用示例

  ```html
    <BaseTable :loading="loading" :columns="columns" :data="list" @cell-settings="handleSettings" @cell-del="handleDel">
      <template #name="{ row }"> <!-- name 使用 slot -->
        <h2>{{ row.name }}</h2>
      </template>
      <template #nameActions="{ row, index }"> <!-- 自定义操作按钮 slot -->
        <i
          class="iconfont icon-icon-16-bianjigongzuotai"
          @click="handleSettings(row, index)"
        ></i>
        <i
          class="iconfont icon-a-icon-16-fuzhi4x"
          @click="handleCopy(row)"
        ></i>
        <i
          class="iconfont icon-icon-16-shanchu"
          @click="handleDel(row)"
        ></i>
      </template>
    </BaseTable>
  ```

  ```js
  <script setup>
    import { ref } from 'vue'

    const loading = ref(false)
    const columns = [
      {
        name: '姓名',
        key: 'name',
        slot: 'name', // 使用 Slot
        showActions: true // 在 name 行后显示操作按钮
      },
      {
        name: '性别',
        key: 'gender'
      }
    ]
    const list = [
      {
        name: 'Sky',
        gender: 'M'
      },
      {
        name: 'Eve',
        gender: 'F'
      }
    ]

    function handleSettings(row) {}

    function handleDel(row) {}
  </script>
  ```

## 表单元素验证组件(*FormItemWrapper*)

处理自定义组件在 Element Form 中无法触发验证的问题

- 属性
  - validateEvent {*Boolean*} - 是否验证事件，默认为 true
- Slot
  - default
- 事件
  - change - 元素的 change 事件
  - blur - 元素的 blur 事件
- 示例
  - 第一种方式

    ```html
    <FormItemWrapper @change="handleMemberChange">
      <template #default="{ change, blur }">
        <BaseUser v-model="form.members" @change="change" @blur="blur" />
      </template>
    </FormItemWrapper>
    ```

    ```js
    function handleMemberChange(event) {
      // 包含的组件的真正的 change 事件
    }

    function handleMemberBlur(event) {
      // 包含的组件的真正的 blur 事件
    }
    ```

  - 第二种方式

    ```html
    <FormItemWrapper ref="memberRef ">
      <template #default="{ change, blur }">
        <BaseUser v-model="form.members" @change="change" @blur="blur" />
      </template>
    </FormItemWrapper>
    ```

    ```js
    const memberRef = ref(null)
    // 第一种方式
    function handleMemberChange(event) {
      // 包含的组件的真正的 change 事件
      memberRef.value.change(event) // 传入 change 后的值
    }

    function handleMemberBlur(event) {
      // 包含的组件的真正的 blur 事件
      memberRef.value.blur(event)
    }
    ```

## 分页组件（*BasePagination*）

分页组件

- 属性
  - pageSize {*Number*} - 每页条数，默认为10
  - pageSizes {*Number[]*} - 每页显示个数选择器的选项设置
  - currentPage {*Number*} - 当前页，默认为1
  - total {*Number*} - 总数
  - align {*String*} - 位置，分为左中右，值与 `text-align`相同：`left`, `center` 和 `right`

- 事件
  - size-change - 每页条数改变
  - current-change - 当前页改变
  - prev - 上一页
  - next - 下一页

- 使用示例

  ```js
  <BasePagination :total="total" page-size="pageSize" @size-change="handleSizeChange" />
  ```

## BaseSelect

下拉框组件

- 属性
  - disabled {*Boolean*}
  - showTooltip {*Boolean*}
  - label {*String*}
  - required {*Boolean*}
  - clearable {*Boolean*}
  - filterable {*Boolean*}
  - placeholder {*Boolean*}
  - remote {*Boolean*} - 是否可以远程搜索
  - remoteMethod {*Function*}
  - keywordsParamsName {*String*}
  - prop {*Object*} - 属性映射，默认值：`{ label: 'label', value: 'value' }`
  - options {*Array*} - 列表数据
  - choosen {*Array|Number|String*} - 已选项
  - filterMethod {*Function*} - 自定义搜索方法
  - placement {*String*} - 下拉列表位置
  - multiple {*Boolean*}
  - multipleLimit {*Number*}
  - trigger {*String*}
  - width {*String|Number*}
  - collapseTags {*Boolean*}

- 事件
  - popover-visible
  - change
  - validateFn

- 使用方法
  v-model 初始值为值数组，比如：['yaoyihuan', ...]

## BaseSimpleSelect

简单下拉框组件

- 属性
  - options {*Array*} 下拉框内容，数据为数组，格式为：`[{ label: '', value: '', icon: '' }]`。
  - buttons {*Array*} 下拉框下面按钮菜单，数据为数组，格式为：`[{ key: '', name: '', icon: '' }]`
  - disabled {*Boolean*} 禁用
  - disabledEffect {*Boolean*} 是否显示禁用效果，默认为是。如：背景颜色及鼠标为不允许操作。
  - trigger {*String*} 下拉框展示触发方式，如：click、hover等，与 `el-popover` 相同。默认是 click。
  - placeholder {*String*} 未选中时展示文字内容，默认为“请选择”。
  - visibleArrow {*Boolean*} 下拉框内容是否有箭头。
  - width {*String|Number*} 组件宽度。
  - loading {*Boolean*} 加载状态。
  - objectValue {*Boolean*} 是否返回选中值对象。

- 事件
  - change 切换选项值变化时触发事件
  - show 下拉框显示时触发事件
  - hide 下拉框隐藏时触发事件
  - button-click 按钮点击时间

## 代码示例

```html
<BaseSimpleSelect v-modal="sel" :options="options" :buttons="buttons" @button-click="handleButtonClick" />
```

```javascript
data() {
  return {
    sel: '',
    options: [
      {
        label: 'label1',
        value: '1'
      },
      {
        label: 'label2',
        value: '2'
      }
    ],
    buttons: [
      {
        key: 'new',
        name: '新建'
      },
      {
        key: 'edit',
        name: '编辑'
      }
    ]
  }
},
methods: {
  handleButtonClick(key) {
    if (key === 'new') {
      // Logic here
    }
  }
}
```

## BaseUser

  人员组件

- 属性
  - value(v-model) {Object[]} - 当前选中的用户（多选）
  - placeholder {String} - 占位符文字
- 事件
  - change - 人员选中后触发事件

## StateStagesSelect

  状态阶段下拉框组件

- 属性
  - value(v-model) {*String*} - 当前选中值
  - placeholder {*String*} - 占位符文字
  - min-width {*String*} - 最小宽度，默认为150px
- 事件
  - change - 人员选中后触发事件

## OrgStateStagesSelect

  业务线状态解决下拉框组件

- 属性
  - value(v-model) {*Object*} - 当前选中值
  - org-id {*Number*} - 业务线ID
  - placeholder {*String*} - 占位符文字
  - minWidth {*String*} - 最小宽度，默认为200px
- 事件
  - change - 人员选中后触发事件

## BaseDraggable

  拖拽组件，基于 `vuedraggable` 封装，包含基本的拖拽样式

- 属性
  - value(v-model) {*Array*} 当前拖拽数组
  - group {*String*} 分组
  - editable {*Boolean*} 是否可编辑

- Slot
  - Default 需要拖动的数组

- 代码示例

  ```html
  <BaseDraggable v-model="list" group="first">
    <div v-for="l in list" :key="l.id">
      {{ l.name }}
    </div>
  </BaseDraggable>
  ```
