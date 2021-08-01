<template>
  <gs-modal
    v-model="showDialog"
    :title="isEdit?'修改':'新建' + '租户'"
    width="477px"
    class="custom-style custom-add-tenant-dialog"
  >
    <div slot="footer">
      <gs-button @click="showDialog = false">
        取消
      </gs-button>
      <gs-button
        type="primary"
        @click="submit"
      >
        确定
      </gs-button>
    </div>
    <gs-form
      ref="formRef"
      v-loading=" loading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="top"
    >
      <gs-form-item
        label="租户名称"
        prop="name"
      >
        <gs-input
          v-model="formData.name"
          :disabled="isEdit"
          placeholder="请输入租户名称"
        />
      </gs-form-item>
      <gs-form-item
        label="负责人"
        prop="admin_login_name"
      >
        <user-selection
          v-if="showDialog"
          :name="formData.admin_login_name"
          placeholder="请输入负责人邮箱"
          @inputChange="inputChange"
        />
      </gs-form-item>
      <gs-form-item label="描述">
        <gs-textarea
          v-model="formData.description"
          autosize
          placeholder="对租户进行描述"
        />
      </gs-form-item>
      <gs-form-item
        v-show="!isEdit"
        label="配置默认角色"
      >
        <span class="label-desc">引用租户 :</span>
        <gs-select
          v-model="formData.quote_tenant_code"
          class="drop-down-select"
        >
          <gs-option
            v-for="item in tenantOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </gs-select>
      </gs-form-item>
    </gs-form>
  </gs-modal>
</template>
<script lang='ts'>
import service from '@/service/tenantService'
import UserSelection from '@/components/public/userSelection.vue'
import { Component, Prop, Watch, Ref, Vue,PropSync } from 'vue-property-decorator'
@Component({
  components:{
    UserSelection
  }
})
export default class TenantInfo extends Vue{
  @PropSync('isShow',{type:Boolean}) showDialog: boolean
  @Prop({default:'add'}) readonly type: string
  @Prop({default:{}}) readonly item: any
  @Ref('formRef') readonly refFormRef: any
  loading: boolean = false
  successTips: any = {
    add: '新建成功',
    edit: '修改成功'
  }
  formData: any = {
    name: '',
    description: '',
    'admin_login_name': '',
    'quote_tenant_code': ''
  }
  formRules: any = {
    name: [
      {
        required: true,
        trigger: 'blur',
        validator(rule, v, cb) {
          if (!v) {
            cb(new Error('请输入租户名称'))
          } else {
            cb()
          }
        }
      }
    ],
    'admin_login_name': [
      {
        required: true,
        trigger: 'blur',
        validator: (rules, value, callback) => {
          if (!value) {
            callback(new Error('负责人邮箱不能为空'))
          } else {
            callback()
          }
          //   // eslint-disable-next-line no-useless-escape
          // } else if (/^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)) {
          //   callback()
          // } else {
          //   callback(new Error('邮箱格式错误'))
          // }
        }
      }
    ]
  }
  tenantOptions: Array<any> = []
  // showDialog: {
  //   get() {
  //     return this.isShow
  //   },
  //   set() {
  //     this.closeDialog()
  //   }
  // },
  get isEdit() {
    return this.type === 'edit'
  }
  @Watch('showDialog')
  showDialogChange(n: any){
    if (n) {
      this.formData = {
        name: this.item.name,
        description: this.item.description,
        'quote_tenant_code': this.item.code,
        'admin_login_name': this.item.admin_login_name
      }
      if (!this.isEdit) {
        this.getTenantDropMenu() // 获取下拉菜单
      }
    }
  }
    // 校验通过
  submit() {
    this.refFormRef.validate((valid) => {
      if (!valid) {
        return false
      } else {
        let type = this.type // 当前对话框类型
        this.loading = true
        let requestPromise: any = {}
        if (type === 'add') { // 新增租户
          let params = {
            step1: { ...this.formData },
            step2: []
          }
          requestPromise = service.addTenant(params)// 新增
        } else {  // 修改租户
          let params = {
            step1: {
              code: this.formData.quote_tenant_code,
              name: this.formData.name,
              description: this.formData.description,
              'admin_login_name': this.formData.admin_login_name
            },
            step2: []
          }
          requestPromise = service.addTenant(params)// 修改
        }
        requestPromise.then((res: any) => {
          if (res.code === 0) {
              // 提示信息和关闭对话框
            this.$Message.success(this.successTips[type], 2)
            this.closeDialog(true)
          } else {
            this.$Message.error(res.msg, 2)
          }
        }).catch(err => {
          this.$Message.error(err.msg, 2)
        }).finally(() => {
          this.loading = false
        })
      }
    })
  }
    /**
     * 初始化引用的租户名称下拉列表
     */
  getTenantDropMenu() {
    service.getTenantDownLists().then((res: any) => {
      if (res.code === 0) {
        let isInit = false
        let formatOptions: Array<any> = []
        for (let val of res.data) {
          if (!isInit) {
            this.formData['quote_tenant_code'] = val.code
            isInit = true
          }
          formatOptions.push({
            label: val.name,
            value: val.code
          })
        }
        this.tenantOptions = formatOptions
      } else {
        this.$Message.error(res.msg, 2)
      }
    })
  }
    /**
     * 邮箱选择
     */
  inputChange(val: any) {
    this.formData['admin_login_name'] = val
  }
    // 关闭当前对话框
  closeDialog(reload = false) {
    this.refFormRef.clearValidate() // 清空验证
    this.$emit('closeDialog', {
      type: this.type,
      reload,
      value: false
    })
  }
}
</script>
