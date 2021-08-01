<template>
  <gs-modal
    v-model="showDialog"
    class="copy-data-wrap text-modal"
    width="450px"
    confirm-text="删除"
    title="提示"
    @confirm="submit"
  >
    <div v-loading="isLoading">
      <div :style="{fontSize:'12px',color:'#666'}">
        确定删除 "{{ item.data?item.data.name:'' }}" ?
      </div>
    </div>
  </gs-modal>
</template>

<script>
export default {
  props: ['isShow', 'item'],
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.isShow
      },
      set() {
        this.closeDialog()
      }
    }
  },
  methods: {
    // 提交数据
    submit() {
      this.isLoading = true
      this.$emit('deleteGroup', this.item.data.id)
    },
    // 关闭当前对话框
    closeDialog(reload = false) {
      this.isLoading = false
      this.$emit('closeDialog', {
        type: 'delete',
        reload,
        value: false
      })
    }
  }
}
</script>
