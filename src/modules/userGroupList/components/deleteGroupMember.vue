<template>
  <gs-modal v-model="showDialog" title="提示" class="custom-style" width="477px">
    <div v-loading="loadding">
      <div>确定移除“{{ item.name }}”？</div>
    </div>
    <div slot="footer">
      <gs-button @click="showDialog = false">取消</gs-button>
      <gs-button type="primary" @click="submit">删除</gs-button>
    </div>
  </gs-modal>
</template>

<script>
import service from '@/service/userGroupService'
export default {
  props: {
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    userGroupId: {
      type: Number,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      loadding: false
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.isShow
      },
      set () {
        this.closeDialog()
      }
    }
  },
  methods: {
    submit () {
      this.loadding = true
      let params = {
        user_id: this.item.id,
        user_group_id: this.userGroupId
      }
      service.deleteUserGroupMember(params).then(res => {
        if (res.code === 0) {
          // 提示信息和关闭对话框
          this.$Message.success('删除成功')
          this.closeDialog(true)
        } else {
          this.$Message.error(res.msg)
        }
      }).catch(err => {
        this.$Message.error(err.msg)
      }).finally(() => {
        this.loadding = false
      })
    },
    // 关闭当前对话框
    closeDialog (reload = false) {
      this.$emit('closeDialog', {
        type: 'delete',
        reload,
        value: false
      })
    }
  }
}
</script>
