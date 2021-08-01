<template>
  <gs-modal
    v-model="show"
    title="修改密码"
    @cancel="close"
    @confirm="confirm"
  >
    <gs-form
      ref="editPwForm"
      :model="editPwForm"
      :rules="editPwFormRules"
      label-position="top"
    >
      <gs-form-item
        label="原密码"
        prop="oriPw"
      >
        <gs-input
          v-model="editPwForm.oriPw"
          type="password"
          placeholder="请输入原密码"
        />
      </gs-form-item>

      <gs-form-item
        label="新密码"
        prop="newPw"
      >
        <gs-input
          v-model="editPwForm.newPw"
          type="password"
          placeholder="请输入新密码"
        />
      </gs-form-item>

      <gs-form-item
        label="重复新密码"
        prop="resetPw"
      >
        <gs-input
          v-model="editPwForm.resetPw"
          type="password"
          placeholder="请再次输入新密码"
        />
      </gs-form-item>
    </gs-form>
  </gs-modal>
</template>

<script lang='ts'>
import UserService from '@/service/userManageService'
import StoreService from '@/service/storeService'
import LoginService from '@/service/loginService'
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'

@Component
export default class UserLoginEditModal extends Vue {
  // 多个验证关系
  oriPwValidator = (rules: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('原密码不为空'))
    }
    else {
      callback()
    }
  }
  newPwValidator = (rules: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('新密码不能为空'))
    }
    else {
      callback()
    }
  }
  resetPwValidator = (rules: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('重置密码不能为空'))
    } else if (value !== this.editPwForm.newPw) {
      callback(new Error('与新密码不一致'))
    } else {
      callback()
    }
  }

  @Prop({ default: false }) readonly vis!: boolean

  @Ref('editPwForm') readonly refEditPwForm: any
  
  public editPwForm: any = {}
  public editPwFormRules: any = {
    oriPw: [
      { required: true, trigger: 'blur,change', validator: this.oriPwValidator }
    ],
    newPw: [
      { required: true, trigger: 'blur,change', validator: this.newPwValidator }
    ],
    resetPw: [
      { required: true, trigger: 'blur,change', validator: this.resetPwValidator }
    ]
  }
  get show(){
    return this.vis
  }
  confirm() {
    this.refEditPwForm.validate((valid: any) => {
      if (!valid) {
        return false
      }
      else {
        let payload = {
          oldPw: encodeURIComponent(this.editPwForm.oriPw),
          newPw: encodeURIComponent(this.editPwForm.newPw)
        }
        UserService.editPw(payload).then(res => {
          if (!(res as any).code) {
            this.close()
            this.$Message.success('修改密码成功', 2)
            this.toLogin()
          } else {
            this.$Message.error((res as any).msg, 2)
          }
        })
      }
    })
  }
  close() {
    this.refEditPwForm.resetFields()
    this.$emit('closeEditPwModel')
  }
  toLogin() {
    let token = StoreService.getToken()
    if (token) {
      LoginService.ctrlLogout().then(() => {
        StoreService.clearAll()
        this.$router.push({ path: '/login' })
      })
    } else {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
