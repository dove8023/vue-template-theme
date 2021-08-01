<template>
  <div class="home-query-container hidden-height home-user-container">
    <div class="member-content">
      <section class="header-setting">
        <gs-button type="primary" @click="editMember('add')">
          添加成员
        </gs-button>
        <gs-search
          v-model="searchValue"
          placeholder="输入成员姓名"
          :width="200"
          class="header-setting-search"
          @search="memberSearch"
          @clear="getMemberList"
        />
      </section>

      <section class="table-contain">
        <gs-tables
          v-loading="loading"
          :data="memberData"
          :pagination.sync="pagination"
          :class="{'no-pagination': !memberData.length}"
          paging
          stripe
          @page-change="pageChange"
          @page-size-change="sizeChange"
        >
          <gs-tables-column label="姓名" prop="name" />
          <gs-tables-column label="用户名" prop="login_name" />
          <!-- <gs-tables-column label="项目权限" prop="authority" width="150px">
            <template slot-scope="row,index">
              <member-popver :row="row" :index="index" />
            </template>
          </gs-tables-column> -->
          <gs-tables-column
            label="所属角色"
            width="300px"
            prop="roleNames"
            :max-tag-num="2"
            :max-tag-width="70"
          />
          <gs-tables-column label="操作" width="200px">
            <template slot-scope="row">
              <gs-button type="text-primary" @click="editMember('edit',row)">
                修改
              </gs-button>
              <gs-button type="text-primary" @click="deleteMember(row)">
                删除
              </gs-button>
            </template>
          </gs-tables-column>
          <template slot="empty">
            <div />
          </template>
        </gs-tables>
        <div v-if="!memberData.length" class="no-data-contain">
          <img src="@/assets/images/emptyUser.png">
          <p>你还没有创建任何成员</p>
        </div>
      </section>
    </div>
    <edit-member-modal
      :modal-data="editData"
      @updateMember="updateMember"
      @closeEditModal="modelClose('edit')"
    />
    <!-- 删除成员对话框 -->
    <gs-modal
      v-model="deleteData.visible"
      v-loading="deleteData.loading"
      title="提示"
      class="member-delete-model"
    >
      <p>确认删除"{{ deleteData.form.name }}"?</p>
      <div slot="footer">
        <gs-button @click="modelClose('delete')">
          取消
        </gs-button>
        <gs-button type="primary" @click="deleteConfirm">
          删除
        </gs-button>
      </div>
    </gs-modal>
  </div>
</template>

<script>
import EditMemberModal from './components/editMember'
import MemberPopver from './components/memberPopver'
import Service from '@/service/tenantMemberManage'
export default {
    components: {
        EditMemberModal, MemberPopver
    },
    data() {
        return {
            label: '成员管理',
            loading: false,
            searchValue: '',
            pageNum: 1,
            pagination: {
                total: 1,
                current: 1,
                pageSize: 10,
                pageSizes: [5, 10, 15],
                layout: 'pagesizes,total,simplepager,jumper,jumpbtn'
            },
            memberData: [],
            editData: {
                visible: false,
                type: '',
                memberForm: {}
            },
            deleteData: {
                visible: false,
                loading: false,
                form: {}
            }
        }
    },
    created() {
        this.getMemberList()
    },
    methods: {
        editMember(type, data) {
            this.editData = {
                visible: true,
                type: type,
                memberForm: {}
            }
            if (type !== 'add') {
                let arr = data.roleNames.map(element => {
                    return element.value
                })
                this.editData.memberForm = { ...data, roleNames: arr }
            }
        },
        deleteMember(data) {
            this.deleteData.visible = true
            this.deleteData.form = data
        },
        modelClose(type) {
            if (type === 'edit') {
                this.editData.visible = false
            } else {
                this.deleteData.visible = false
            }
        },
        deleteConfirm() {
            Service.deleteMember(this.deleteData.form.login_name)
        .then(res => {
            if (!res.code) {
                this.$Message.success(res.msg)
                this.modelClose('delete')
                this.getMemberList()
            } else {
                this.$Message.error(res.msg)
            }
        })
        .finally(() => {
            this.modelClose('delete')
        })
        },
        memberSearch() {
            if (this.searchValue){
                this.pagination.current = 1
            } else {
                this.pagination.current = this.pageNum
            }
            let data = {
                name: this.searchValue
            }
            this.getMemberList(data)
        },
        getMemberList(searchPayload) {
            if (!searchPayload){
                this.pagination.current = this.pageNum
            }
            this.loading = true
            let payload = {
                pageNum: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            if (searchPayload) {
                payload.data = searchPayload
            }
            Service.getMemberList(payload)
        .then(res => {
            const data = res.data
            this.memberData = this.format(data.records)
            this.pagination.total = data.total
            this.pagination.pageSize = data.page_size
        })
        .catch(err => {
            this.$Message.error(err.msg)
        })
        .finally(() => {
            this.loading = false
        })
        },
        updateMember() {
            this.modelClose('edit')
            this.getMemberList()
        },
        pageChange(val) {
            this.pagination.current = val
            this.pageNum = this.pagination.current
            this.getMemberList()
        },
        sizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.current = 1
            this.getMemberList()
        },
        format(data) {
            for (let val of data) {
                val.roleNames = []
                for (let roleInfo of val.role_infos) {
                    val.roleNames.push(
                        {
                            label: roleInfo.role_name,
                            value: roleInfo.role_code
                        }
          )
                }
            }
            return data
        }
    }
}
</script>

<style lang="scss" scoped>
.member-content {
  padding: 10px;
  background: #fff;
  .header-setting {
    .header-setting-search {
      float: right;
    }
  }

  .table-contain {
     margin: 10px 0;
    .gs-tables-data-content {
      .gs-tags {
        background-color: #eef2fe;
        color: $main-color;
      }
    }
    .no-data-contain {
      text-align: center;
      margin-top: 168px;
      img {
        border: 1px dashed;
      }
      p {
        margin-top: 23px;
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(197, 197, 197, 1);
      }
    }
    .no-pagination {
      .gs-pagination {
        display: none;
      }
    }
  }
}
</style>
