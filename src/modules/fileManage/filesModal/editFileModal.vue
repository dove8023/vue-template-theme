<template>
  <gs-modal v-model="vis" :title="editModalTitle" @cancel="close" @confirm="confirm">
    <gs-form
      v-loading="isLoading"
      ref="editForm"
      :model="editFormData"
      label-width="80px"
      label-position="top"
    >
      <gs-form-item label="标题" prop="fileName">
        <p>{{ editFormData.fileName }}</p>
      </gs-form-item>

      <gs-form-item label="来源" prop="source">
        <gs-input v-model="editFormData.source" :placeholder="placeholder.input" />
      </gs-form-item>

      <gs-form-item label="作者" prop="author">
        <gs-input v-model="editFormData.author" :placeholder="placeholder.input" />
      </gs-form-item>

      <gs-form-item label="关键词" prop="docKeywords">
        <gs-input v-model="editFormData.docKeywords" :placeholder="placeholder.input" />
      </gs-form-item>

      <gs-form-item label="发表时间" prop="publishTime">
        <gs-date-picker
          v-model="editFormData.publishTime"
          :append-to-body="true"
          input-type="input"
          format="YYYY-MM-DD"
          style="width: 100%;"
          @change="change"
        />
      </gs-form-item>

      <gs-form-item label="分类" prop="fileCategory">
        <gs-input v-model="editFormData.fileCategory" :placeholder="placeholder.input" />
      </gs-form-item>

      <gs-form-item label="摘要" prop="fileAbstract">
        <gs-textarea v-model="editFormData.fileAbstract" :placeholder="placeholder.input" />
      </gs-form-item>
    </gs-form>
  </gs-modal>
</template>

<script>
import {deepCopy} from '@/utils/comUtils'
import moment from 'moment'

export default {
  props: {
    editFileVis: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      isLoading: false,
      vis: false,
      editModalTitle: '修改文档',
      placeholder: {
        input: '多个并列词以逗号分开',
        dateTime: '请选择日期'
      },
      editFormData: {}
    }
  },
  watch: {
    editData: function (n, old) {
      let data = deepCopy(this.editData)
      if (data.publishTimeStr) {
        data.publishTime = moment.utc(data.publishTimeStr, 'YYYY-MM-DD')
      }
      this.editFormData = data
    },
    editFileVis: function (n, o) {
      if (!n) {
        this.isLoading = false
      }
      this.vis = this.editFileVis
    }
  },
  methods: {
    close () {
      this.$emit('close', 'edit')
    },
    confirm () {
      this.isLoading = true
      let params = deepCopy(this.editFormData)
      console.log(params)
      if (params.publishTimeStr) {
        params.publishTime = params.publishTimeStr
      }
      this.$emit('editFileConfirm', params)
    },
    change (date) {
      console.log('设置时间')
      if (!date) {
        this.editFormData.publishTimeStr = ''
      } else {
        this.editFormData.publishTimeStr = date.format('YYYY-MM-DD HH:mm:SS')
      }
    }
  }
}
</script>

