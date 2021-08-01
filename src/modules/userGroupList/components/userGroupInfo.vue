<template>
  <gs-modal
    v-model="showDialog"
    :title="label[info.type]"
    width="577px"
    class="custom-style add-edit-userinfo"
  >
    <div slot="footer">
       <gs-button type="primary" @click="submit">确定</gs-button>
      <gs-button @click="showDialog = false">取消</gs-button>
     
    </div>
    <gs-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="top"
    >
      <gs-form-item class="gs-hidden" label="用户组名称" prop="name">
        <gs-input v-model="formData.name" placeholder="请输入用户组名称" />
        <word-limit :max="20" :val="formData.name" />
      </gs-form-item>
      <gs-form-item label="描述" prop="description">
        <gs-textarea v-model="formData.description" placeholder="请输入用户组描述" />
        <word-limit :max="100" :val="formData.description" />
      </gs-form-item>
    </gs-form>
  </gs-modal>
</template>
<script>
import WordLimit from '@/components/public/wordLimit'
import service from '@/service/userGroupService'
export default {
  components: {
    WordLimit
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    let ValidatName = (rule, v, cb) => {
      if (!v) {
        cb(new Error('请输入用户组名称'))
      } else if (v.length > 20) {
        cb(new Error('用户组名称不得超过 20 个字符'))
      } else {
        let params = {
          id: this.item.id || -1,
          user_group_name: v
        }
        service.checkNameUnique(params).then(res => {
          if (res.code === 0) {
            if (res.data) {
              cb(new Error('此名称已存在'))
            } else {
              cb()
            }
          } else {
            this.$Message.error(res.msg)
          }
        }).catch(err => {
          this.$Message.error(err.msg)
        })
      }
    }
    return {
      loading: false,
      label: {
        add: '新建用户组',
        edit: '编辑用户组'
      },
      successTips: {
        add: '新建成功',
        edit: '修改成功'
      },
      formData: {
        name: '',
        description: ''
      },
      formRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: ValidatName
          }
        ],
        description: [
          {
            trigger: 'blur',
            validator (rule, v, cb) {
              if (v && v.length > 100) {
                cb(new Error('用户组描述不得超过 100 个字符'))
              } else {
                cb()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.info.show
      },
      set () {
        this.closeDialog()
      }
    }
  },
  watch: {
    showDialog (n) {
      if (n) {
        this.formData = { ...this.item }
      }
    }
  },
  methods: {
    submit () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false
        } else {
          let type = this.info.type // 当前对话框类型
          this.loading = true
          let requestPromise = {}
          if (type === 'add') {
            requestPromise = service.addUserGroup(this.formData)// 新增
          } else {
            requestPromise = service.updateUserGroup(this.formData)// 修改
          }
          requestPromise.then(res => {
            if (res.code === 0) {
              // 提示信息和关闭对话框
              this.$Message.success(this.successTips[type])
              this.closeDialog(true)
            } else {
              this.$Message.error(res.msg)
            }
          }).catch(err => {
            this.$Message.error(err.msg)
          }).finally(() => {
            this.loadding = false
          })
        }
      })
    },
    // 关闭当前对话框
    closeDialog (reload = false) {
      this.$refs.formRef.clearValidate() // 清空验证
      this.$emit('closeDialog', {
        type: 'show',
        reload,
        value: false
      })
    }
  }
}
</script>
<style scoped>
.gs-hidden{
  overflow: hidden;
}
</style>