<template>
  <div>
    <gs-search
      v-model="searchValue"
      :datalist="searchedResults"
      :input-search="search"
      :placeholder="placeholder"
      class="user-selection"
      @select="select"
      
    />
   
    <p v-if="userName" style="padding: 5px;" >
       <span>姓名: {{ userName }}</span>
    </p>
    
  </div>
</template>

<script>
import Service from '@/service/tenantMemberManage'
import UserService from '@/service/userManageService'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    adminName: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isExit:false,
      searchValue: '',
      userName: '',
      searchedResults: [],
      records: [],
      pageNum: 1,
      pageSize: 10
    }
  },
  watch: {
    searchValue(n) {
      this.select(n)
    }
  },
  created() {
    this.userName = this.adminName
    this.searchValue = this.name
    if (this.name) {
      this.search(this.name)
        .then(() => {
          this.select(this.name)
        })
    }
  },
  methods: {
    search(val) {
      return new Promise((resolve, reject) => {
        this.$emit('inputChange', val);
      
        if (val) {
          let payload = {
            pageNo: this.pageNum,
            pageSize: this.pageSize,
            data: {
              'login_name': val
            }
          }
          //检查是否重复
          Service.checkName(val).then(res=>{    
              this.isExit=false;
              this.$emit("isExit",  this.isExit)
          }).catch(err=>{
             this.isExit=true;
              this.$emit("isExit",  this.isExit)
            console.log(err);
          })
            
          UserService.searchUser(payload)
            .then((res) => {
              if (!res.code) {
                this.records = res.data.records
                this.searchedResults = res.data.records.map(val => {
                  return val.login_name
                })
                resolve()
              }
            }).catch((err) => {
              reject()
              this.$Message.error(err.msg)
            })
        } else {      
          this.searchedResults = []
          this.userName = ''
          this.isExit=false;
          this.$emit("isExit",  this.isExit)
        }
      })
    },
    select(val) {
      this.userName = ''
      for (let item of this.records) {
        if (item.login_name === val) {
          this.userName = item.name
        }
      }
    
    }
  }
}
</script>

<style lang="scss">
.user-selection {
  width: 100%;

  .gs-icon-search {
    display: none;
  }
}

.gs-search-popper {
  .gs-search-matchitem {
    padding: 8px;
  }
}
.name_exit{
  color: red
}
</style>
