<template>
  <gs-modal
    v-model="showDialog"
    title="添加成员"
    width="800px"
    class="custom-style add-usergroup-member-dialog"
  >
    <div slot="footer">
      <gs-button :disabled="submitDisabled" type="primary" @click="submit"
        >确定</gs-button
      >
      <gs-button @click="showDialog = false">取消</gs-button>
      
    </div>
    <member-select
      v-if="showDialog"
      :list="userList"
      @update="updateUserList"
    />
  </gs-modal>
</template>
<script>
import memberSelect from '@/components/public/memberSelect'
import service from '@/service/userGroupService'
export default {
  components: {
    memberSelect
  },
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
      loadding: false,
      originUserList: [], // 完整用户信息
      userList: [], // 处理给过滤器使用的用户列表
      emailList: [], // 当前选中的用户邮箱list
      submitDisabled: false
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
  watch: {
    showDialog (n) {
      if (n) {
        this.getUserList()
      }
    }
  },
  methods: {
    submit () {
      this.submitDisabled = true
      let idList = []
      // 过滤将邮箱转化为id
      for (let item of this.emailList) {
        for (let user of this.originUserList) {
          if (item === user.email || item === user.login_name) {
            idList.push(user.id)
          }
        }
      }
      let params = {
        user_list: idList,
        user_group_id: this.userGroupId
      }
      service.updateUserGroupMember(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('添加成功')
          this.closeDialog(true)
        } else {
          this.$Message.error(res.msg)
        }
      }).catch(err => {
        this.$Message.error(err.msg)
      }).finally(() => {
        this.submitDisabled = false
        this.loadding = false
      })
    },
    // 获取选择的用户成员列表
    updateUserList (row = []) {
      this.emailList = row.map(item => {
        return item.split('  ')[1]
      })
    },
    // 获取用户列表 ****
    getUserList () {
      let params = {
        pageNo: 1,
        pageSize: 10000,
        groupId: this.userGroupId
      }

      service.getUnselectMemberList(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          let userList = []
          if (res.data.records.length) {
            for (let item of res.data.records) {
              console.log(item)
              userList.push(`${item.name}  ${item.email || item.login_name}`)
              this.userList = userList
            }
          } else {
            this.userList = userList
          }
          this.originUserList = res.data.records
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
        type: 'add',
        reload,
        value: false
      })
    }
  }
}
</script>
