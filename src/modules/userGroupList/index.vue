<template>
  <div class="home-usergroup-container hidden-height">
    <!-- 成员配置页面 -->
    <groupMemberSetting v-if="!isUserGroupList" :item="activeItem" @clickBack="backToUserGroup" />

    <!-- 用户组列表 -->
    <div v-loading="loadding" v-show="isUserGroupList" class="content-layout-container scroll-container customer">
        <noViewAuth v-if="!pageAuth.view" />
        <div v-else class="user-group-contain">
          <section class="header-wrap">
            <gs-button type="primary" @click="showDialog({},'add')">新建用户组</gs-button>
            <gs-search
              v-model="searchValue"
              placeholder="输入用户组名称"
              @search="searchValueChange"
              @clear="searchValueChange"
            />
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
                >
                  <template slot-scope="scope">
                    <gs-button type="text-primary" @click="jumpMemberSetting(scope.row)">成员配置</gs-button>
                    <gs-button type="text-primary" @click="showDialog(scope.row,'edit')">修改</gs-button>
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
          </section>
        </div>
    </div>
    <userGroupInfo :item="activeItem" :info="dialogUserGroupInfo" @closeDialog="opDialog" />
  </div>
</template>

<script>
import userGroupInfo from './components/userGroupInfo'
import groupMemberSetting from './groupMemberSetting'
import service from '@/service/userGroupService'
import { getPageAuth } from '@/utils/comUtils'
import noViewAuth from '@/components/public/noViewAuth'
import { mapGetters } from 'vuex'
export default {
  components: {
    userGroupInfo,
    groupMemberSetting,
    noViewAuth
  },
  data () {
    return {
      label: '用户组管理',
      loadding: false,
      isUserGroupList: true,
      dialogUserGroupInfo: {
        show: false,
        type: 'add' // add:新增  edit:修改
      },
      searchValue: '',
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
        label: '用户组名称'
      }, {
        prop: 'description',
        width: 120,
        label: '描述'
      }, {
        prop: 'member_count',
        width: 120,
        label: '成员数'
      }, {
        prop: 'creator',
        width: 120,
        label: '创建人'
      }, {
        prop: 'create_time',
        width: 120,
        label: '创建时间'
      }, {
        prop: 'op',
        width: 120,
        label: '操作'
      }],
      activeItem: {},
      pageAuth: {
        view: false
      }
    }
  },
  computed: {
    ...mapGetters(['currentMenusGroup'])
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let auth = getPageAuth(this.currentMenusGroup, this.$route.path)
      this.pageAuth = { ...this.pageAuth, ...auth }
      if (this.pageAuth.view) {
        this.getUserGroupList()
      }
    },
    // 从成员配置返回用户组管理
    backToUserGroup () {
      this.isUserGroupList = true
      this.getUserGroupList()// 获取列表
    },
    jumpMemberSetting (row = {}) {
      this.isUserGroupList = false
      this.activeItem = row
    },
    // 控制对话框
    showDialog (row = {}, type) {
      this.dialogUserGroupInfo.show = true
      this.dialogUserGroupInfo.type = type
      this.activeItem = row
    },

    opDialog (row) {
      this.dialogUserGroupInfo.show = row.value
      if (row.reload) { // 加载列表
        this.getUserGroupList()// 获取列表
      }
    },

    /**
     * 获取用户组列表
     */
    getUserGroupList () {
      this.loadding = true
      let params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        keyword: this.searchValue
      }
      service.getUserGroupList(params).then(res => {
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
        this.loadding = false
      })
    },
    /**
     * 当前页码变化
     */
    pageChange (page) {
      this.pagination.current = page
      this.getUserGroupList()
    },
    /**
     * 每页显示数量变化
     */
    sizeChange (size) {
      this.pagination.pageSize = size
      this.pagination.current = 1
      this.getUserGroupList()
    },
    // 关键字搜索跳转第一页
    searchValueChange () {
      this.pagination.current = 1
      this.getUserGroupList()
    }
  }
}
</script>
<style lang='scss' scoped>
.user-group-contain .user-table{
  margin-top: 10px;
  padding: 0;
}
.header-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
