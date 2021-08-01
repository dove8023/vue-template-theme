<template>
  <div class="tenant-manage-container hidden-height">
    <!-- 租户管理 -->
    <div class="content-layout-container scroll-container customer">
      <noViewAuth v-if="!pageAuth.view" />
      <div v-else class="tenant-manage-contain">
        <section class="header-wrap search-content">
          <gs-button type="primary" @click="showDialog({},'add')">
            新建租户
          </gs-button>
          <gs-search v-model="searchValue" :placeholder="'请输入'+searchTypeConfig[activeSearchType]" @search="searchValueChange" @clear="searchValueChange">
            <template slot="prepend">
              <gs-select v-model="activeSearchType" class="type-select">
                <gs-option v-for="(value, name) in searchTypeConfig" :key="name" :label="value" :value="name" />
              </gs-select>
            </template>
          </gs-search>
        </section>
        <section class="user-table">
          <gs-table
            :data="dataList"
            :pagination.sync="pagination"
            class="user-table-content"
            paging
            @page-change="pageChange"
            @size-change="sizeChange"
          >
            <template v-for="item in tableConfig">
              <gs-table-column
                v-if="item.prop === 'op'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <gs-button type="text-primary" @click="showDialog(scope.row,'edit')">
                    修改
                  </gs-button>
                  <!-- <gs-button type="text-primary" @click="showDialog(scope.row,'setting')">配置功能模块</gs-button> -->
                  <gs-button type="text-primary" @click="showDialog(scope.row,'switch')">
                    {{ scope.row.is_valid? '停用':'启用' }}
                  </gs-button>
                </template>
              </gs-table-column>
              <gs-table-column
                v-else-if="item.prop === 'is_valid'"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.is_valid ? '#7A9859' :'#CB4C5B' }">{{ scope.row.is_valid? '启用':'停用' }}</span>
                </template>
              </gs-table-column>
              <gs-table-column
                v-else
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
              />
            </template>
          </gs-table>

          <!-- 新增/修改  -->
          <tenant-info
            :item="activeItem"
            :is-show.sync="dialogVisiable[dialogType]"
            :type="dialogType"
            @closeDialog="opDialog"
          />
          <!-- 切换状态 -->
          <switch-status
            :item="activeItem"
            :is-show="dialogVisiable.switch"
            @closeDialog="opDialog"
          />
          <!-- 设置资源 -->
          <setting-module
            :item="activeItem"
            :is-show="dialogVisiable.setting"
            @closeDialog="opDialog"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/service/tenantService'
import noViewAuth from '@/components/public/noViewAuth'
import { mapGetters } from 'vuex'
import tenantInfo from './components/tenantInfo'
import switchStatus from './components/switchStatus'
import settingModule from './components/settingModule'
export default {
  components: {
    noViewAuth,
    tenantInfo,
    switchStatus,
    settingModule
  },
  data() {
    return {
      label: '租户管理',
      loading: false,
      dialogVisiable: {
        add: false,
        edit: false,
        setting: false,
        switch: false
      },
      dialogType: 'add',
      searchValue: '',
      searchTypeConfig: {
        name: '租户名称',
        'admin_login_name': '负责人'
      },
      activeSearchType: 'name', // 默认类型
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizes: [5, 10, 15],
        layout: 'pagesizes,total,simplepager,jumper,jumpbtn'
      },
      dataList: [],
      tableConfig: [{
        prop: 'name',
        width: 120,
        label: '租户名称'
      }, {
        prop: 'description',
        width: 120,
        label: '描述'
      }, {
        prop: 'is_valid',
        width: 80,
        label: '状态'
      }, {
        prop: 'admin_login_name',
        width: 120,
        label: '负责人'
      }, {
        prop: 'create_time',
        width: 120,
        label: '创建时间'
      }, {
        prop: 'op',
        width: 80,
        label: '操作'
      }],
      activeItem: {},
      pageAuth: {
        view: true
      }
    }
  },
  computed: {
    ...mapGetters(['currentMenusGroup'])
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.getDataList()
    },
    // 控制对话框
    showDialog(row = {}, type) {
      if (type === 'add' || type === 'edit') {
        this.dialogType = type
      }
      this.dialogVisiable[type] = true
      this.activeItem = row
    },

    opDialog(row) {
      this.dialogVisiable[row.type] = row.value
      if (row.type === 'delete') {
        this.pagination.current = 1
      }
      if (row.reload) { // 加载列表
        this.getDataList()// 获取列表
      }
    },

    /**
     * 获取关系列表
     */
    getDataList() {
      this.loading = true
      let params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        data: {
          'data': {
            [this.activeSearchType]: this.searchValue
          }
        }
      }
      service.getSearchTenantList(params).then(res => {
        if (res.code === 0) {
          let data = res.data
          this.dataList = data.records
          this.pagination.total = data.total
        } else {
          this.$Message.error(res.msg)
        }
      }).catch(err => {
        this.$Message.error(err.msg)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 当前页码变化
     */
    pageChange(page) {
      this.pagination.current = page
      this.getDataList()
    },
    /**
     * 每页显示数量变化
     */
    sizeChange(size) {
      this.pagination.pageSize = size
      this.pagination.current = 1
      this.getDataList()
    },
    // 关键字搜索跳转第一页
    searchValueChange() {
      this.pagination.current = 1
      this.getDataList()
    }
  }
}
</script>
