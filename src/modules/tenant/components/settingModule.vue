<template>
  <gs-modal
    v-model="showDialog"
    :show-footer="false"
    width="550px"
    title="资源组配置"
  >
    <source-group
      v-if="showDialog"
      :tenant-code="item.code"
    />
  </gs-modal>
</template>

<script lang='ts'>
import SourceGroup from './sourceGroup/index.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  components:{
    SourceGroup
  }
})
export default class SettingModule extends Vue{
  @Prop({default:false}) readonly isShow: boolean
  @Prop({default:{}}) readonly item: any
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
    // 关闭当前对话框
  closeDialog(reload = false) {
    this.$emit('closeDialog', {
      type: 'setting',
      reload,
      value: false
    })
  }
}
</script>
