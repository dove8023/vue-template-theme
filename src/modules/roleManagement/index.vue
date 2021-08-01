<template>
  <div class="home-query-container hidden-height">
    <div class="content-layout-container scroll-container customer">
      <noViewAuth v-if="!pageAuth.view" />
      <template v-else>
        <div class="role-contain">
          <section class="role-contain-heade-setting">
            <gs-button class="blockContain-btn" type="primary" @click="showModal('add')">
              添加角色
            </gs-button>
            <gs-search
              v-model="searchValue"
              placeholder="输入角色名称"
              async
              class="header-setting-search"
              @search="roleSearch"
              @clear="getRoleList"
            />
          </section>
          <section class="table-list">
            <gs-table
              :stripe="false"
              v-loading="tableLoading"
              :data="roleData"
              :pagination.sync="pagination"
              style="width: 100%"
              paging          
              @page-change="pageChange"
              @size-change="sizeChange"
            >
              <gs-table-column
                prop="role_name"
                label="角色名称"
                show-overflow-tooltip
                min-width="168"
              >
              <template slot-scope="scope">
                  <span>
                    {{ scope.row.role_name }}
                  </span>
                  <span v-show="!scope.row.can_delete" class="default-system-tag">系统默认</span>
                </template>
              </gs-table-column>
              <gs-table-column prop="memo" label="角色描述" show-overflow-tooltip min-width="248" />
              <gs-table-column prop="role_user_count" label="成员数" min-width="168">
                <template slot-scope="scope">
                  <p style="color:#666666">
                    {{ scope.row.role_user_count }}
                  </p>
                  <gs-button
                    style="margin-left:20px"
                    type="text-primary"
                    @click="checkMember(scope.row)"
                  >
                    查看成员
                  </gs-button>
                </template>
              </gs-table-column>
              <gs-table-column label="操作" width="108">
                <template slot-scope="scope">
                  <gs-button type="text-primary" @click="viewAuthority(scope.row)">
                    查看权限
                  </gs-button>
                  <gs-button
                    :disabled="!scope.row.can_delete"
                    type="text-primary"
                    @click="editRow(scope.row)"
                  >
                    修改
                  </gs-button>
                  <gs-button
                    :disabled="!scope.row.can_delete"
                    type="text-primary"
                    @click="deleteRow(scope.row)"
                  >
                    删除
                  </gs-button>
                </template>
              </gs-table-column>
            </gs-table>
          </section>
        </div>
        <!-- 添加角色弹窗 // 修改角色弹窗  isEdit区分-->
        <gs-modal
          v-model="visible.addRoleVis"
          :title="isEdit? '修改角色':'添加角色'"
          class="add-role-modal"
          width="577px"
        >
          <div v-if="isEdit" class="add-role-modal-edit-warning">
            <img
              class="add-role-modal-edit-warning-icon"
              src="@/assets/images/icons/userModalWarning.png"
            >
            <span>修改后该角色下的用户将会覆盖以前的权限,请谨慎操作</span>
          </div>
          <gs-form
            ref="addRoleForm"
            :model="addRoleForm"
            :rules="addRoleRules"
            label-width="80px"
            label-position="top"
            :class="{addform: isEdit}"
          >
            <gs-form-item label="角色名称" prop="role_name">
              <gs-input v-model="addRoleForm.role_name" placeholder="填写角色名称" />
              <word-limit :max="20" :val="addRoleForm.role_name" />
            </gs-form-item>

            <gs-form-item label="编码" prop="role_code">
              <gs-input
                v-model="addRoleForm.role_code"
                :disabled="isEdit"
                :placeholder="isEdit?'无':'填写编码'"
              />
              <word-limit :max="50" :val="addRoleForm.role_code" />
            </gs-form-item>

            <gs-form-item label="角色描述" prop="memo">
              <gs-textarea v-model="addRoleForm.memo" placeholder="填写角色描述" />
              <word-limit :max="100" :val="addRoleForm.memo" />
            </gs-form-item>
          </gs-form>

          <!-- <section class="authority-setting">
							<p class="authority-setting-tip">配置权限</p>
							<gs-collapse accordion>
								<gs-collapse-item v-for="(item,i) in sourceData" :key="i+ '-' + item.id" :title="item.group_name">
									<gs-checkbox-group v-model="checkBoxResult" :show-all-check="true">
										<gs-checkbox
											v-for="child in item.children"
											:label="child.id"
											:value="child.id"
											:key=" '---' + child.id"
										>{{child.group_name}}</gs-checkbox>
									</gs-checkbox-group>
								</gs-collapse-item>
							</gs-collapse>
            </section>-->

          <section>
            <gs-trees
              ref="sourceTree"
              :data="sourceData"
              show-checkbox
              node-key="id"
              default-all-expand
              :props="treeProps"
            />
          </section>
          <div slot="footer">
             <gs-button type="primary" :disabled="submitDisabled" @click="addRoleConfirm">
              确定
            </gs-button>
            <gs-button @click="modelClose('add')">
              取消
            </gs-button>
           
          </div>
        </gs-modal>
        <!-- 无法删除提示 -->
        <gs-modal v-model="visible.denyDeleteVis" title="提示">
          <p>无法删除角色,该角色下关联了用户</p>
          <p class="deny-delete-tip">
            需要先删除角色和用户关联的关系才可以删除
          </p>
          <div slot="footer">
            <!-- <gs-button @click="modelClose('denyDelete')">
              取消
            </gs-button> -->
            <gs-button type="primary" @click="denyDeleteConfirm">
              知道了
            </gs-button>
          </div>
        </gs-modal>

        <!-- 删除提示 -->
        <gs-modal v-model="visible.allowDeleteVis" title="提示">
          <p>该角色下已没有关联用户，确定要删除该角色吗?</p>
          <div slot="footer">
            <gs-button @click="modelClose('allowDelete')">
              取消
            </gs-button>
            <gs-button type="primary" @click="allowDeleteConfirm">
              确定
            </gs-button>
          </div>
        </gs-modal>

        <!-- 查看权限弹窗 -->
        <gs-modal
          v-model="visible.viewAuthorityVis"
          :show-footer="false"
          width="577px"
          title="查看权限"
          class="view-authority-modal"
        >
          <section class="view-authority-modal-text">
            <span>角色名称</span>
            <p>{{ viewAuthorityData.role_name }}</p>
          </section>

          <section class="view-authority-modal-text">
            <span>角色编码</span>
            <p>{{ viewAuthorityData.role_code }}</p>
          </section>

          <section class="view-authority-modal-text">
            <span>角色描述</span>
            <p>{{ viewAuthorityData.memo }}</p>
          </section>
          <p class="font-size-small">
            配置权限
          </p>
          <!-- <section
							v-for="(data,index) in viewAuthorityData.authority"
							:key="'autho-' + index"
							class="view-authority-modal-authority-section"
						>
							<span class="view-authority-modal-authority-section-title">{{ data.group_name }}</span>
							<div class="view-authority-modal-authority-section-box">
								<span v-for="item in data.children" :key="index + '--' + item">{{ item.group_name }}</span>
							</div>
            </section>-->
          <section>
            <gs-trees
              :data="viewAuthorityData.authority"
              :props="treeProps"
              :default-all-expand="true"
            />
          </section>
        </gs-modal>

        <!-- 查看成员弹窗 -->
        <role-view-member ref="viewMemberModal" />
      </template>
    </div>
  </div>
</template>

<script>
import WordLimit from '@/components/public/wordLimit'
import roleViewMember from './copmonents/roleViewMember'
import roleService from '@/service/roleManageService'
import { filterTreeKeys } from '@/utils/comUtils'
import noViewAuth from '@/components/public/noViewAuth'
import { mapGetters } from 'vuex'
import { getPageAuth } from '@/utils/comUtils'

export default {
    components: {
        WordLimit,
        roleViewMember,
        noViewAuth
    },
    data() {
        return {
            label: '角色管理',
            searchValue: '',
            isEdit: false,
            chooseRoleId: '',
            tableLoading: false,
            visible: {
                addRoleVis: false,
                denyDeleteVis: false,
                allowDeleteVis: false,
                viewAuthorityVis: false,
                viewMemberVis: false
            },
            visibleMap: {
                add: 'addRoleVis',
                denyDelete: 'denyDeleteVis',
                allowDelete: 'allowDeleteVis',
                edit: 'addRoleVis',
                viewAuthority: 'viewAuthorityVis',
                member: 'viewMemberVis'
            },
            roleData: [],
            addRoleForm: {},
            addRoleRules: {
                role_name: [
                    {
                        trigger: 'change,blur',
                        required: true,
                        validator(rule, v, cb) {
                            if (!v) {
                                cb(new Error('角色名称为必填项，不得置空'))
                            } else if (v.length > 20) {
                                cb(new Error('角色名称不得超过 20 个字符'))
                            } else {
                                cb()
                            }
                        }
                    }
                ],
                role_code: [
                    {
                        trigger: 'change,blur',
                        required: true,
                        validator(rule, v, cb) {
                            if (!v) {
                                cb(new Error('编码为必填项，不得置空'))
                            } else if (v.length > 50) {
                                cb(new Error('编码不得超过 50 个字符'))
                            } else {
                                cb()
                            }

                        }
                    }
                ],
                memo: [
                    {
                        trigger: 'change,blur',
                        required: true,
                        validator(rule, v, cb) {
                            if (!v) {
                                cb(new Error('角色描述为必填项，不得置空'))
                            } else if (v.length > 100) {
                                cb(new Error('角色描述不得超过 100 个字符'))
                            } else {
                                cb()
                            }
                        }
                    }
                ]
            },
            pagination: {
                total: 1,
                current: 1,
                pageSize: 10,
                pageSizes: [5, 10, 15],
                layout: 'pagesizes,total,simplepager,jumper,jumpbtn'
            },

            checkBoxResult: [],
            sourceData: [],
            treeProps: {
                label: 'name',
                children: 'children'
            },
            viewAuthorityData: {
                authority: []
            },
            pageAuth: {
                view: false
            },
            submitDisabled: false
        }
    },
    computed: {
        ...mapGetters(['resourceGroup', 'currentMenusGroup'])
    },
    watch: {
        'visible.addRoleVis': function(val, oldVal) {
            if (!val) {
                this.modelClose('add')
            }
        }
    },
    created() {
        this.initPage()
    },
    methods: {
        initPage() {
            let auth = getPageAuth(this.currentMenusGroup, this.$route.path)
            this.pageAuth = { ...this.pageAuth, ...auth }
            if (this.pageAuth.view) {
                this.getRoleList()
                this.getSourceList()
            }
        },
        getSourceList() {
            this.tableLoading = true
            roleService.sourceList()
        .then(res => {
            if (!res.code) {
                this.sourceData = res.data || []
                this.tableLoading = false
            }
        })
        },
        getRoleList(searchParam) {
            this.tableLoading = true
            if (searchParam) {
                this.pagination.current = 1
                this.pagination.pageSize = 10
            }
            let payload = {
                pageNo: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            let param = searchParam ? { ...payload, ...searchParam } : payload
            roleService.searchRole({ ...param })
        .then(res => {
            if (res.code === 0) {
                this.pagination.total = res.data.total
                this.roleData = res.data.records
                this.tableLoading = false
            }
        })
        .catch(err => {
            console.error(err)
        })
        },
        getRoleSource(id) {
            return roleService.roleSource({ roleId: id })
        .then((res) => {
            if (!res.code) {
                return new Promise((resolve, reject) => {
                    resolve(res.data)
                })
            } else {
                return new Promise((resolve, reject) => {
                    resolve([])
                })
            }
        })
        .catch(err => {
            this.$Message.error(err)
        })
        },
        roleSearch() {
            let payload = {
                data: {
                    role_name: this.searchValue
                }
            }
            this.getRoleList(payload)
        },
        pageChange(page) {
            this.pagination.current = page
            this.getRoleList()
        },
        sizeChange(size) {
            this.pagination.pageSize = size
            this.pagination.current = 1
            this.getRoleList()
        },
        showModal(type) {
            if (type === 'add') {
                this.addRoleForm = {}
                this.isEdit = false
                this.checkBoxResult = []
            }
            this.visible[this.visibleMap[type]] = true
        },
        modelClose(type) {
            this.visible[this.visibleMap[type]] = false
            if (type === 'add' || type === 'edit') {
                this.$refs.addRoleForm.resetFields()
                this.$refs.sourceTree.setCheckedKeys([])
            }
        },
        addRoleConfirm() {
            this.submitDisabled = true
            this.$refs.addRoleForm.validate((valid) => {
                if (!valid) {
                    this.submitDisabled = false
                    return false
                } else {
                    let nodes = this.$refs.sourceTree.getCheckedNodes(true)
                    let sourceGroup = filterTreeKeys(nodes) // 树形结构选中(包括半选中)状态节点Key集合
                    let param = {
                        role_name: this.addRoleForm.role_name,
                        role_code: this.addRoleForm.role_code,
                        memo: this.addRoleForm.memo,
                        resource_groups: sourceGroup
                    }
                    if (this.addRoleForm.id) {
                        param.id = this.addRoleForm.id
                    }
                    roleService.editRole(param).then(res => {
                        if (!res.code) {
                            this.$Message.success(param.id ? '修改成功' : '添加成功')
                            this.modelClose('add')
                            this.addRoleForm = {}
                            this.getRoleList()
                        } else {
                            this.modelClose('add')
                            this.$Message.error(res.msg)
                        }
                        this.submitDisabled = false
                    }).catch(err => {
                        this.submitDisabled = false
                        console.error(err)
                    })
                }
            })
        },
        denyDeleteConfirm() {
            this.modelClose('denyDelete')
        },
        allowDeleteConfirm() {
            let payload = {
                id: this.chooseRoleId
            }
            roleService.roleDelete(payload)
        .then(res => {
            if (!res.code) {
                this.getRoleList()
                this.$Message.success('删除成功')
            }
        })
        .catch(err => {
            console.error(err)
        })
            this.modelClose('allowDelete')
        },
        editRow(data) {
            this.getRoleSource(data.id).then((res) => {
                this.$refs.sourceTree.setCheckedKeys(res.resource_groups, true)
                this.isEdit = true
                this.addRoleForm = JSON.parse(JSON.stringify(data))
                this.showModal('edit')
            })
        },
        deleteRow(data) {
      // 判断是否能够删除该角色
            if (data.role_user_count) {
                this.showModal('denyDelete')
            } else {
                this.chooseRoleId = data.id
                this.showModal('allowDelete')
            }
        },
        viewAuthority(data) {
            this.viewAuthorityData = data
            this.viewAuthorityData.authority = []
            this.getRoleSource(data.id).then((res) => {
                this.viewAuthorityData.authority = res.whole_resource_groups || []
                this.showModal('viewAuthority')
            })
        },
        checkMember(data) {
            this.showModal('member')
            console.log(data)
            this.$refs.viewMemberModal.showModal(data.id)
        },
        filterSource(data) {
            let source = []
            for (let val of data) {
                if (!val.parent_id) {
                    val.children = []
                    source.push(val)
                }
            }
            for (let val of data) {
                if (val.parent_id) {
                    let parent = source.find((val) => {
                        return val.id === val.parent_id
                    })
                    if (parent) {
                        parent.children.push(val)
                    }
                }
            }
            return source
        }
    }
}
</script>

<style lang="scss" scoped>
.table-list{
  /deep/ .default-system-tag{
        padding: 4px 10px;
        font-size: 12px;
        color: #666;
        background-color: #f3f3f3;
        border-radius: 6px;
        margin-left: 16px;
    }
}

</style>
