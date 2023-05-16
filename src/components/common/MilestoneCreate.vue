<template>
  <PopoverInfo
    v-model="show"
    popper-class="milestone-create"
    width="320px"
    @show="handleShow"
  >
    <template #title>
      <div class="create-title">{{ title }}</div>
    </template>
    <el-form
      ref="form"
      :model="milestone"
      :rules="rules"
      class="ee-form"
      label-position="top"
    >
      <el-form-item label="名称" prop="title">
        <el-input
          v-model="milestone[titleProp]"
          size="mini"
          maxlength="50"
          placeholder="请输入名称"
        />
      </el-form-item>
      <el-form-item label="预计完成" prop="planEndDate">
        <el-date-picker
          v-model="milestone[endDateProp]"
          placeholder="请选择日期"
          size="mini"
          type="datetime"
          :value-format="dateFormat"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="milestone[descProp]"
          placeholder="请输入描述"
          type="textarea"
          :rows="4"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button size="mini" @click="show = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="handleCreate"
        >
          创建
        </el-button>
      </el-form-item>
    </el-form>
    <template #reference>
      <slot name="reference">
        <el-button
          size="mini"
          icon="el-icon-circle-plus-outline"
          :disabled="disabled"
        >
          创建里程碑
        </el-button>
      </slot>
    </template>
  </PopoverInfo>
</template>

<script setup>
import { reactive, ref } from 'vue'
import PopoverInfo from '@/components/common/PopoverInfo.vue'
import Message from 'element-ui/lib/message'
import { MILESTONE_STATE, OBJECT_TYPE } from '@/constants/gantt.const'

const props = defineProps({
  title: {
    type: String,
    default: '创建里程碑'
  },
  disabled: {
    type: Boolean
  },
  objectId: {
    type: Number
  },
  objectType: {
    type: Number,
    validator: (value) => Object.values(OBJECT_TYPE).includes(value)
  },
  dataProps: {
    type: Object,
    default: () => ({
      status: 'status',
      title: 'title',
      endDate: 'planEndDate',
      desc: 'description'
    })
  },
  createMilestone: {
    type: Function,
    default: () => {}
  }
})
const emit = defineEmits(['change'])

const statusProp = props.dataProps.status || 'status'
const titleProp = props.dataProps.title || 'title'
const endDateProp = props.dataProps.endDate || 'planEndDate'
const descProp = props.dataProps.desc || 'description'

const show = ref(false)
const loading = ref(false)
const milestone = reactive({
  objectId: props.objectId,
  objectType: props.objectType,
  [statusProp]: MILESTONE_STATE.NOT_STARTED,
  [titleProp]: '',
  [endDateProp]: '',
  [descProp]: ''
})
const form = ref(null)
const rules = {
  [titleProp]: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  [endDateProp]: [
    { required: true, message: '请选择计划结束时间', trigger: 'blur' }
  ]
}
const dateFormat = 'yyyy-MM-dd HH:mm:ss'

function handleShow() {
  form.value.resetFields()
}

function handleCreate() {
  form.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await props.createMilestone(milestone)
        Message.success('创建成功')
        milestone[titleProp] = ''
        milestone[endDateProp] = ''
        milestone[descProp] = ''
        show.value = false
        emit('change')
      } catch (err) {
        console.error('CreateMilestoneError:', err.message)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss">
.milestone-create {
  .create-title {
    font-size: 14px;
    font-weight: 600;
    color: $font-color;
    margin-bottom: $base-gap * 4;
  }

  .el-form {
    .el-form-item {
      .el-form-item__label {
        height: 24px;
        line-height: 24px;
        font-size: 14px;
      }
    }
  }
}
</style>
