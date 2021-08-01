<template>
  <div class="user-group-member-setting">
    <div class="module-layout-container">
      <h2 class="sit-map-title sit-map-title-fix">
        <i class="gs-icon-revoke" style="cursor: pointer" @click="backToUserGroup()" />
        <span>{{ label }}</span>
      </h2>
    </div>
    <!-- 定比 -->
    <section v-loading="loadding" class="user-group-member-content">
      <div class="desc-header-wrap">
        <p class="desc-item-wrap">
          <span>所属用户组：{{ item.name }}</span>
          <span>描述：{{ item.description }}</span>
          <span>成员数：{{ memberCount }}</span>
        </p>
        <section class="header-wrap">
          <gs-button type="primary" @click="showDialog({},'add')">
            添加成员
          </gs-button>
          <gs-search
            v-model="searchValue"
            placeholder="输入成员姓名"
            @search="searchValueChange"
            @clear="searchValueChange"
          />
        </section>
      </div>
      <section>
        <gs-table
          :data="dataList"
          :pagination.sync="pagination"
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
                <gs-button type="text-primary" @click="showDialog(scope.row,'delete')">
                  移除
                </gs-button>
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
    </section>
    <!-- 添加成员 -->
    <addGroupMember
      :item="activeItem"
      :user-group-id="item.id"
      :is-show="dialogVisiable.add"
      @closeDialog="opDialog"
    />
    <!-- 移除成员 -->
    <deleteGroupMember
      :item="activeItem"
      :user-group-id="item.id"
      :is-show="dialogVisiable.delete"
      @closeDialog="opDialog"
    />
  </div>
</template>

<script>
import deleteGroupMember from './components/deleteGroupMember'
import addGroupMember from './components/addGroupMember'
import service from '@/service/userGroupService'

export default {
    components: {
        deleteGroupMember,
        addGroupMember
    },
    props: {
        item: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            label: '成员配置',
            loadding: false,
            dialogVisiable: {
                add: false,
                delete: false
            },
            searchValue: '',
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10,
                pageSizes: [5, 10, 15],
                layout: 'pagesizes,total,simplepager,jumper,jumpbtn'
            },
            memberCount: 0,
            dataList: [],
            tableConfig: [{
                prop: 'name',
                width: 120,
                label: '姓名'
            }, {
                prop: 'email',
                width: 120,
                label: '用户名'
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
                width: 60,
                label: '操作'
            }],
            activeItem: {}
        }
    },
    created() {
        this.getMemberList()
    },
    methods: {
        backToUserGroup() {
            this.$emit('clickBack')
        },
    // 控制对话框
        showDialog(row = {}, type) {
            this.dialogVisiable[type] = true
            this.activeItem = row
        },

        opDialog(row) {
            this.dialogVisiable[row.type] = row.value
      // if (row.type === 'delete') {
      //   this.pageInfo.current = 1
      // }
            console.log(row)
            if (row.reload) { // 加载列表
                this.getMemberList()// 获取列表
            }
        },

    /**
     * 获取成员列表
     */
        getMemberList() {
            this.loadding = true;
            (this.dataList.length===1&&this.pagination.current>1)&&this.pagination.current--
            let params = {
                pageNo: this.pagination.current,
                pageSize: this.pagination.pageSize,
                groupId: this.item.id,
                keyword: this.searchValue
            }

            service.getMemberList(params).then(res => {
                if (res.code === 0) {
                    let data = res.data
                    this.dataList = data.records
                    this.pagination.total = data.total
                    this.memberCount = data.extra_information || 0 // 统计当前的成员总数
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
        pageChange(page) {
            this.pagination.current = page
            this.getMemberList()
        },
    /**
     * 每页显示数量变化
     */
        sizeChange(size) {
            this.pagination.pageSize = size
            this.pagination.current = 1
            this.getMemberList()
        },
        searchValueChange() {
            this.pagination.current = 1
            this.getMemberList()
        }
    }
}
</script>
<style scoped>
.sit-map-title-fix{
  justify-content: left!important;;
}
.gs-icon-revoke{
  line-height: 36px;
}
</style>
