<template>
  <gs-modal v-model="modalData.visible" :title="title" class="edit-member-modal">
    <gs-form
      ref="memberForm"
      class="edit-member-form"
      :rules="memberFormRules"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <gs-form-item v-if="modalData.type === 'add'" label="用户名(邮箱)" prop="login_name">
        <!-- <gs-input v-model="data.login_name" placeholder="输入用户用户名" ></gs-input> -->
        <user-selection
        @isExit="getIsExit"
          v-if="modalData.visible"
          :name="data.login_name"
          @inputChange="inputChange"
        />
      </gs-form-item>
      <div v-else class="edit-member-text">
        <span>用户名(邮箱)</span>     
        <p>{{ data.name }}({{ data.login_name }})</p>
      </div>
      <gs-form-item style="margin-top: 24px" label="分配角色" prop="roleNames">
        <gs-select @visible-change="visibleChange"  v-model="data.roleNames" class="form-role-select" multiple>
          <gs-option          
            :class="item.isSystemDefaultRole?'system-default':''"
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </gs-select>
      </gs-form-item>
    </gs-form>
    <div slot="footer">
        <gs-button type="primary" :disabled="submitDisabled" @click="confirm">
          确定
        </gs-button>
        <gs-button @click="close">
          取消
        </gs-button>
     
    </div>
  </gs-modal>
</template>

<script>
import UserSelection from '@/components/public/userSelection'
import Service from '@/service/tenantMemberManage'
import RoleService from '@/service/roleManageService'
export default {
    components: {
        UserSelection
    },
    props: {
        modalData: {
            type: Object,
            default: () => {
                return {
                    visible: false,
                    type: 'add',
                    memberForm: {
                        login_name: '',
                        roleNames: []
                    }
                }
            }
        }
    },
    data() {
        const memberFormRules = {
            login_name: [
                {
                    trigger: "change,blur",
                    required: true,
                    validator: (rules, value, callback) => {
                        let loginName = this.data.login_name;
                            if (!loginName) {
                                callback(new Error("用户邮箱不能为空"))
                            } else {
                                callback()
                            }
                        
            // if (!loginName) {
            //   callback(new Error("用户邮箱不能为空"));
            // } else if (
            //   /^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
            //     loginName
            //   )
            // ) {
            //   callback();
            // } else {
            //   callback(new Error("邮箱格式错误"));
            // }
                       
                    }
                }
            ],
            roleNames: [
                {
                    trigger: 'change,blur',
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value.length) {
                            callback(new Error("分配角色不能为空"))
                        } else {
                            callback()
                        }
                    }
                }
            ]
        }
        return {
            isShowTag:false,
            isExit:false,
            options: [],
            data: {
                roleNames: []
            },
            submitDisabled: false,
            memberFormRules,
        }
    },
    computed: {
        title() {
            if (this.modalData.type === 'add') {
                return '添加成员'
            } else {
                return '修改成员'
            }
        }
    },
    watch: {
        'modalData.visible': {
            handler(val) {
                if (this.modalData.type === 'edit') {
                    this.data = this.modalData.memberForm
                } else {
                    this.data = {
                        roleNames: []
                    }
                }
                if (val) {
                    this.$refs.memberForm.resetFields()
                    this.getRoleList()
                }
            },
            deep: true
        }
    },
    created() {
    },
    methods: {
        close() {
            this.$refs.memberForm.resetFields();

            this.$emit('closeEditModal')
        },
        confirm() {
            if(this.isExit) {
                this.$Notify.error({
                    duration: 0,
                    title: '成员已经存在了',
                });
                return
            }
            this.submitDisabled = true
            this.$refs.memberForm.validate(valid => {
                if (valid) {
                    let payload = {
                        login_name: this.data.login_name,
                        role_codes: this.data.roleNames,
                        project_codes: ['system_defalut']
                    }
                    if (this.modalData.type !== 'add') {
                        payload.user_id = this.data.user_id
                    }
                    Service.editMember(payload)
            .then(res => {
                if (res.code) {
                    // this.$Message.error(res.msg)
                    this.submitDisabled = false
                    return
                }
                this.$Message.success('操作成功')
                this.$emit('updateMember')
                this.submitDisabled = false
            })
            .catch(err => {
                // this.$Message.error(err.msg)
                this.submitDisabled = false
            })
                } else {
                    this.submitDisabled = false
                    return false
                }
            })
        },
        inputChange(val) {
            this.data.login_name = val;
        },
        getRoleList() {
            RoleService.roleDownList()
        .then(res => {
            if (res.code === 0) {
               
                this.options = res.data.records.map(val => {
                    return {
                        label: val.role_name,
                        value: val.role_code,
                        isSystemDefaultRole:val.system_default_role
                    }
                })
            }
        })
        },
        getIsExit(flag){
            this.isExit=flag
        },
        /**
         * 下拉框展开关闭时触发
         */
        visibleChange(isExpend){ 
            //展开式插入节点，关闭时删除节点         
            if(this.modalData.type==="add" && isExpend){  
                const html=`<span class="default-tag">系统默认</span>` 
                 for (const li of document.querySelectorAll(".system-default")) {
                     li.insertAdjacentHTML('beforeend', html);
                 } 
            }else{
                 for (const li of document.querySelectorAll(".system-default")) {
                    if(this.modalData.type!=="add") return        
                    li.removeChild(li.querySelector (".default-tag"));
                 } 
            }
        }
    }
}
</script>

<style lang="scss" >
.edit-member-modal {
  .edit-member-text {
    font-size: 12px;
    margin-bottom: 40px;
    p {
      margin-top: 6px;
    }
  }
}
.gs-select-menu-item {
  padding: 0 !important;
}
.default-tag{
    // display: flex;
    padding: 2px 10px;
    font-size: 12px;
    color: #666;
    background-color: #f3f3f3;
    border-radius:6px ;
    margin-left: 16px;
}
</style>
