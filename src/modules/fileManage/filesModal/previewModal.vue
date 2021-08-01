<template>
  <gs-modal :title="title" v-model="visible" class="preview-modal" width="60%">
    <gs-loading v-if="isLoading" />
    <h3 class="preview-title">{{ fileDetails.title }}</h3>
    <gs-textarea
      ref="previewRef"
      v-model="content"
      :disabled="!isEdit"
      :min-height="390"
      placeholder="请输入内容"
      resize="none"
    />
    <div slot="footer">
      <gs-button
        v-if="!isEdit"
        :title="!allowEdit?'没有编辑权限':''"
        :disabled="!allowEdit"
        type="primary"
        @click="changeEdit(true)"
      >编辑</gs-button>
      <gs-button v-show="isEdit" @click="changeEdit(false)">取消编辑</gs-button>
      <gs-button v-show="isEdit" type="primary" @click="saveEdit">保存</gs-button>
    </div>
  </gs-modal>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    fileDetails: {
      type: Object,
      default () {
        return {}
      }
    },
    allowEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      title: '查看',
      isLoading: false,
      isEdit: false,
      content: ''
    }
  },
  computed: {
    visible: {
      get () {
        return this.isVisible
      },
      set () {
        this.close()
      }
    }
  },
  watch: {
    // 每次打开查看对话框，默认内容不可编辑
    visible (n) {
      if (n) {
        this.isEdit = false
        this.content = this.fileDetails.content
        this.$refs['previewRef'].scrollTop = 0
      }
    }
  },
  methods: {
    close () {
      this.$emit('close', 'preview')
    },
    changeEdit (status = false) {
      if (!status) {
        this.content = this.fileDetails.content
      }
      this.isEdit = status
    },
    saveEdit () {
      this.isLoading = true
      this.$emit('updateFileContent', this.fileDetails.fileId, this.content)
    }
  }
}
</script>
