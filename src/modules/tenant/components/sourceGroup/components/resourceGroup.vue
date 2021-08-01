<template>
  <gs-modal
    v-model="showDialog"
    :title="title"
    width="50%"
    @confirm="submit"
  >
    <gs-scrollbar
      v-loading="isLoading"
      :wrap-style="{ height: '100%' }"
    >
      <gs-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        label-width="150px"
      >
        <gs-form-item
          v-if="modalType === 'child'"
          label="所属层级"
        >
          <div class="level-text">
            {{ levelName }}
          </div>
        </gs-form-item>
        <gs-form-item
          label="资源组名称"
          prop="name"
        >
          <gs-input
            v-model="formData['name']"
            placeholder="填写资源组名称"
          />
          <word-limit
            :max="10"
            :val="formData['name']"
          />
        </gs-form-item>
        <gs-form-item
          label="编码"
          prop="code"
        >
          <gs-input
            v-model="formData['code']"
            :disabled="isEdit"
            placeholder="填写资源组名称"
          />
        </gs-form-item>
        <gs-form-item label="选择资源">
          <div class="resource-tree-container">
            <span>所有资源</span>
            <gs-trees
              ref="sourceTree"
              :data="allResource"
              :props="{ label: 'name' }"
              show-checkbox
              node-key="id"
            />
          </div>
        </gs-form-item>
      </gs-form>
    </gs-scrollbar>
  </gs-modal>
</template>

<script lang='ts'>
import WordLimit from "@/components/public/wordLimit.vue"
import { filterTreeKeys, trvalLevel } from "../method/resourceFuc.js"
import ResourceGroupService from "@/service/resourceGroupService" // 资源组 操作
import { Component, Prop, Watch, Ref, Vue } from 'vue-property-decorator'
@Component({
  components:{
    WordLimit
  }
})
export default class ResourceGroup extends Vue{
  @Prop({ default: false }) readonly isShow!: boolean
  @Prop({ default: {} }) readonly activeItem!: any
  @Prop({ default: 'add' }) readonly actionType!: string
  @Prop({ default: 1 }) readonly newSort!: number
  @Ref('sourceTree') readonly refSourceTree: any
  @Ref('formRef') readonly refFormRef: any
  isLoading: boolean = false
  formData: any = {}
  isEdit: boolean = false
  title: string = ""
  allResource: Array<any> = []
  levelName: string = ""
  modalType: string = ""
  defaultChecked: Array<any> = []
  formRules: any = {
    name: [
      {
        required: true,
        trigger: "blur",
        validator(rule, v, cb) {
          if (!v) {
            cb(new Error("请输入资源组名称"))
          } else if (v.length > 10) {
            cb(new Error("资源组名称不得超过 10 个字符"))
          }
          cb()
        }
      }
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        validator(rule, v, cb) {
          if (!v) {
            cb(new Error("请输入编码"))
          }
          cb()
        }
      }
    ]
  }
  get showDialog(){
    return this.isShow
  }
  // computed: {
  //   showDialog: {
  //     get() {
  //       return this.isShow
  //     },
  //     set() {
  //       this.closeDialog()
  //     }
  //   }
  // },
  @Watch('actionType')
  actionTypeChange(v: string){
    switch (v) {
      case "addRoot":
        this.modalType = "root"
        this.title = "新建资源组"
        this.isEdit = false
        break
      case "editRoot":
        this.modalType = "root"
        this.title = "编辑资源组"
        this.isEdit = true
        break
      case "addChild":
        this.modalType = "child"
        this.title = "新建子类"
        this.isEdit = false
        break
      case "editChild":
        this.modalType = "child"
        this.title = "编辑子类"
        this.isEdit = true
        break
      default:
        break
    }
  }
  @Watch('activeItem', { immediate: true, deep: true })
  activeItemChange(){
    if (this.modalType === "child") {
      this.levelName = String(trvalLevel(this.activeItem))
    }
  }
  @Watch('isShow')
  isShowChange(v: any){
    v && this.getResourceList() // 获取资源列表 供资源组操作
  }
    // 提交数据
  closeDialog(reload = false) {
    this.formData = {}
    this.isLoading = false
    this.refSourceTree.setCheckedKeys([])
    this.$emit("closeDialog", {
      type: "resGroup",
      reload,
      value: false
    })
  }
  submit() {
    this.refFormRef.validate((valid: any) => {
      if (!valid) {
        return false
      } else {
        let params = this.handleData()
        this.isLoading = true
        if (this.isEdit) {
          this.$emit("editGroup", params)
        } else {
          this.$emit("addGroup", params)
        }
      }
    })
  }
  handleData() {
    let data = this.formData
    if (!this.isEdit) {
      if (this.modalType === "root") {
        data.sort = this.newSort
      } else {
        data.sort = this.activeItem.data.children.length + 1
        data['parent_id'] = this.activeItem.data.id
      }
    } // 根据当前的modal类型和是否编辑状态 设置请求参数
    data['resource_ids'] = filterTreeKeys(
        this.refSourceTree.getCheckedNodes()
      )
    return data
  }
  getResourceList() {
    this.isLoading = true
    ResourceGroupService.getAllResourceList()
        .then((res: any) => {
          if (res.code === 0) {
            this.allResource = res.data
            if (this.isEdit) {
              this.$nextTick(() => {
                this.formData = JSON.parse(JSON.stringify(this.activeItem.data))
                let defaultChecked = this.activeItem.data.resource_ids
                this.refSourceTree.setCheckedKeys(defaultChecked, true)
              })
            }
          } else {
            this.$Message.error({
              duration: 2,
              content: res.message
            }, 2)
          }
        })
        .catch(error => {
          this.$Message.error({
            duration: 2,
            content: error.errorMessage
          }, 2)
        })
        .finally(() => {
          this.isLoading = false
        })
  } // 获取资源列表以供资源组操作
}
</script>

<style lang="scss">
.resource-tree-container {
  border: 1px solid #e6e9ed;
  padding: 9px;
}
</style>
