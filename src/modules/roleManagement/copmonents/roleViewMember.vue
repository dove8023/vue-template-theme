<template>
  <gs-modal v-model="vis" :show-footer="false" width="844px" title="查看成员" class="view-member-modal">
    <gs-search
      v-model="searchValue"
      :placeholder="viewMemberPlaceholder"
      width="327px"
      @search="memberSearch"
      @clear="getMember"
    >
      <template slot="prepend">
        <gs-select v-model="searchPre">
          <gs-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :disabled="item.disabled"
            :value="item.value"
          />
        </gs-select>
      </template>
    </gs-search>
    <gs-table
      v-loading="loading"
      :data="memberData"
      :pagination.sync="pagination"
      class="view-member-modal-table"
      style="width: 100%"
      paging
      @page-change="pageChange"
      @size-change="sizeChange"
    >
      <gs-table-column prop="name" label="姓名" show-overflow-tooltip />
      <gs-table-column prop="login_name" label="账号(邮箱)" show-overflow-tooltip />
      <gs-table-column prop="role_ids" label="所属角色" width="68">
        <template slot-scope="scope">
          <gs-table-tags :tags="scope.row.roleNames" :show-count="1" />
        </template>
      </gs-table-column>
      <gs-table-column prop="update_time" label="更新时间" show-overflow-tooltip />
    </gs-table>
  </gs-modal>
</template>

<script>
import roleService from '../../../service/roleManageService'
import userService from '../../../service/userManageService'
export default {
  data() {
    return {
      vis: false,
      loading: false,
      roleID: '',
      searchValue: '',
      searchPre: 'name',
      searchOptions: [
        {
          label: '姓名',
          value: 'name'
        },
        {
          label: '账号',
          value: 'login_name'
        }
      ],
      memberData: [],
      pagination: {
        total: 1,
        current: 1,
        pageSizes: [5, 10, 15],
        pageSize: 10
      },
      roleOptions: []
    }
  },
  computed: {
    viewMemberPlaceholder: function() {
      for (let val of this.searchOptions) {
        if (val.value === this.searchPre) {
          return '请输入' + val.label
        }
      }
      return '请输入查询条件'
    }
  },
  methods: {
    showModal(id) {
      this.memberData=[]
      this.vis = true
      this.roleID = id
      this.searchValue = '' // 清空查询条件
      this.getMember()
    },
    memberSearch() {
      let payload = {
        data: {}
      }
      payload.data[this.searchPre] = this.searchValue
      this.getMember(payload)
    },
    getMember(searchParam) {
      this.loading = true
      if (searchParam) {
        this.pagination.current = 1
        this.pagination.pageSize = 10
      }
      let payload = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        id: this.roleID
      }
      let param = searchParam ? { ...payload, ...searchParam } : payload
      roleService.wholeMember(param)
        .then(res => {
          this.pagination.total = res.data.total
          if (!res.code) {
            this.getWholeRoles().then(() => {
              this.memberData = res.data.records.map((val) => {
                val.roleNames = this.getTagText(val.role_ids)
                return val
              })
            })
          } else {
            this.$Message.error('获取数据出错误')
          }
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    getWholeRoles() {
      return userService.wholeRoles()
        .then(res => {
          if (!res.code) {
            this.roleOptions = res.data.records
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    /**
     * @method id组映射对应文本用于显示
     */
    getTagText(idArr) {
      if (!idArr.length) {
        return []
      }
      let arr = []
      let that = this
      for (let id of idArr) {
        let data = that.roleOptions.find((item) => {
          return item.id === id
        })
        if (data) {
          arr.push(data.role_name)
        }
      }
      return arr
    },
    pageChange(page) {
      this.pagination.current = page
      this.getMember()
    },
    sizeChange(size) {
      this.pagination.pageSize = size
      this.pagination.current = 1
      this.getMember()
    }
  }
}
</script>
