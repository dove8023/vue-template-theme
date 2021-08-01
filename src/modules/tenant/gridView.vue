<template>
  <div :class="{'empty-list': !data.length}" class="project-grid-view module-layout-container">

    <h2 class="sit-map-title">
      <span>{{ label }}</span>
    </h2>
    <div class="tenant-search">
      <gs-search v-model="searchValue" clearable placeholder="租户名称" @search="doSearch" @clear="doSearch" />
    </div>

    <div v-if="!data.length" class="empty-contain">
      <gs-empty text="未找到相关数据">
        <div slot="icon" class="empty-icon">
          <img src="@/assets/images/emptyUserView.png" style="border: 1px dashed;">
        </div>
      </gs-empty>
    </div>

    <div v-if="data.length" v-loading="loading" class="grid-wrap">
      <div class="project-container">
        <div v-for="item in data" :key="item.id" :class="!item.is_valid ? 'forbidden' : ''" class="project-item">
          <div class="top-container">
            <div class="item-title" v-text="item.name" />
            <div :title="item.description" class="item-desc" v-text="item.description" />
            <div class="item-bottom">
              <span v-if="!item.is_valid" class="item-tip">已停用,无法访问</span>
              <i class="item-detail gs-icon-logout" @click="clickItem(item, item.is_valid)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <gs-pagination
      v-if="data.length"
      :total="pagination['total']"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination['pageSize']"
      :current="pagination['pageNum']"
      layout="pagesizes,total,totalpage,pager,jumpbtn"
      style="margin: 12px 16px 0 16px;"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    />
  </div>
</template>

<script lang='ts'>
import Service from '@/service/tenantService'
import { Component, Vue } from 'vue-property-decorator'

interface ITenant {
  id: string;
  'is_valid': boolean;
  name: string;
  description: string;
}
@Component({
  components: {
  }
})
export default class GridView extends Vue {
  label: string = '我的租户'
  loading: boolean = false
  data: Array<ITenant> = []
  pagination: any = {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizes: [5, 10, 20, 50],
    layout: 'pagesizes,total,totalpage,pager,jumpbtn'
  }
  searchValue: string = ''

  created() {
    this.getUserTenantList()
  }
  pageChange(val: number) {
    this.pagination.pageNum = val
    this.getUserTenantList()
  }
  pageSizeChange(val: number) {
    this.pagination.pageSize = val
    this.pagination.pageNum = 1
    this.getUserTenantList()
  }
  async clickItem(row: any, status = false) {
    if(!status){
      return
    }

    this.$store.commit('setTenantCode', {
      val: row.code,
      jump: true
    })
  }
  // 获取租户列表
  async getUserTenantList() {
    this.loading = true
    let payload = {
      pageNum: this.pagination.pageNum,
      pageSize: this.pagination.pageSize,
      keyWord: this.searchValue
    }

    try {
      let res = await Service.getUserTenantList(payload);
      if (res.code == 0) {
        this.data = res.data.records
        this.pagination.total = res.data.total

        this.autoJump()
      }
    } catch (error) {
      console.error('error: ', error);
    } finally {
      this.loading = false
    }
  }

  autoJump(){
    if(!this.data.length || this.data.length != 1 || this.pagination.pageNum > 1){
      return
    }

    if(this.$route.query.jump == "no"){
      return
    }

    let item = this.data[0];
    this.clickItem(item, item.is_valid)
  }
  // 清空条件或搜索
  doSearch() {
    this.pagination.pageNum = 1
    this.getUserTenantList()
  }
}
</script>
