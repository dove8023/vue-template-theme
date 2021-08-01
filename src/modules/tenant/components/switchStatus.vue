<template>
  <gs-modal
    v-model="showDialog"
    title="提示"
    class="custom-style"
    width="477px"
  >
    <div v-loading="loading">
      <div style="word-break: break-all;">
        确定{{ tenantStatus?'停用':'启用' }} “{{ item.name }}”？
      </div>
      <div
        v-show="tenantStatus"
        style="color: #cb4c5b;"
      >
        停用后，所有的用户将无法访问此租户，请谨慎操作！
      </div>
    </div>
    <div slot="footer">
      <gs-button @click="showDialog = false">
        取消
      </gs-button>
      <gs-button
        type="primary"
        @click="submit"
      >
        {{ tenantStatus?'停用':'启用' }}
      </gs-button>
    </div>
  </gs-modal>
</template>

<script>
import service from '@/service/tenantService'
export default {
  props: {
    isShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
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
    },
    tenantStatus() {
      return this.item.is_valid
    }
  },
  methods: {
    submit() {
      this.loading = true
      let tenantCode = this.item.code // 租户id
      let promiseServe = null
      if (this.tenantStatus) {
        // 当前是启用状态，停用租户
        promiseServe = service.stopTenant
      } else {
        promiseServe = service.enableTenant
      }
      promiseServe(tenantCode).then(res => {
        if (res.code === 0) {
          this.$Message.success(`${this.tenantStatus ? '停用' : '启用'}成功`)
          this.closeDialog(true)
        } else {
          this.$Message.error(res.msg)
        }
      }).catch(err => {
        this.$Message.error(err.msg)
      }).finally(() => {
        this.loading = false
      })
    },
    // 关闭当前对话框
    closeDialog(reload = false) {
      this.$emit('closeDialog', {
        type: 'switch',
        reload,
        value: false
      })
    }
  }
}
</script>
