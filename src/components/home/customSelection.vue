<template>
  <div>
    <gs-cascader-select
      :value="currentTenant"
      :options="options"
      :click-on-select="true"
      placeholder
      filterable
      expand-trigger="hover"
      @change="selectChange"
    />
  </div>
</template>

<script lang='ts'>
import Service from '@/service/tenantService'
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class CustomerSelecition extends Vue{
  public options: Array<any> = []
  public currentTenant = [localStorage.getItem("tenantCode")]

  created() {
    this.getDownList()
  }
  selectChange(data: Array<any>) {
    if (data.length === 1) {
      this.$store.commit('setTenantCode', {
        val: data[0],
        jump: true,
      })
    }
  }
  getDownList() {
    Service.getTenantDownList()
      .then(res => {
        this.options = this.formatTenantList((res as any).data.records)
      })
      .catch(err => {
        this.$Message.error(err.msg, 2)
      })
  }
  formatList(list: Array<any>) {
    let formatData: Array<any> = []
    for (let tenant of list) {
      let obj: any = {
        label: tenant.tenant_name,
        value: tenant.tenant_code,
        children: []
      }
      for (let pro of tenant.projects) {
        obj.children.push({
          label: pro.project_name,
          value: pro.project_code
        })
      }
      formatData.push(obj)
    }
    return formatData
  }
  // 只有租户级别数据
  formatTenantList(list: Array<any>) {
    let formatData: any[] = [];
    list.map((val: any) => {
      if(!val.is_valid){
        return
      }

      formatData.push({
        label: val.name,
        value: val.code
      })
    })

    return formatData
  }
}
</script>

