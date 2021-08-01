<template>
  <div class="custom-header-container">
    <gs-header
      :is-fixed="isFixed"
      :show-feedback="showFeedback"
      :has-toggler="false"
      :theme="menuTheme"
    >
      <div slot="logo" class="custom-header-left-container">
        <!-- 顶部左侧的logo -->
        <div class="custom-header-gs-logo" @click="routerJump">
          <img v-show="isShowNavLogo" :src="logo" alt="logo">
          <div class="custom-header-title">
            <span>{{ getTitle(1) }}</span>
            <span>{{ getTitle(0) }}</span>
          </div>
        </div>
      
        <div v-if="!isHome" class="custom-header-home-wrap">
          <i class="iconfont iconHOME custom-header-icon-home" @click="toHome" />
          <span v-if="!isBackCenter" class="jiangefu">|</span>
          <custom-selection v-if="!isBackCenter" />
        </div>
      </div>
      <div v-if="isAdmin" slot="nav" class="custom-header-backup" @click="toBackupCenter">
        后台中心
      </div>
      <div slot="special">
        <gs-popover
          ref="userPopover"
          supernatant
          placement="bottom"
          trigger="hover"
          class="userPopover"
          :width="146"
        >
          <!-- 非SSO模式下，有用户中心查看权限 -->
          <div class="userPopover-item" @click="toConfig">
            {{ userName || '暂无姓名' }}
          </div>
          <div class="userPopover-item" @click="openEditPw">
            修改密码
          </div>
        </gs-popover>
        <ul>
          <!-- 非SSO有修改密码和查看个人中心 -->
          <li v-if="!win.epApp.configs.sysUserType" v-popover:userPopover style="width: auto;">
            <span style="font-size: 16px; color: #fff;" class="pointer">
              <span>{{ userName }}</span>
              <i class="gs-icon-user-o" style="position: relative; top: 2px;" />
            </span>
          </li>
          <li v-else style="width: auto;">
            <span style="font-size: 16px; color: #fff;" class="pointer">
              <span>{{ userName }}</span>
              <i class="gs-icon-user-o" style="position: relative; top: 2px;" />
            </span>
          </li>
          <li>
            <span class="pointer" @click="showLogoutModal">
              <i class="gs-icon-logout" style="position: relative; top: 2px;" />
            </span>
          </li>
        </ul>
      </div>
    </gs-header>
    <gs-modal v-model="logoutModalVisible" class="logout-modal" title="登出" @confirm="logoutCtrl">
      <p>是否确定登出？</p>
    </gs-modal>
    <edit-pw-model :vis="editPwModalVisible" @closeEditPwModel="closeEditPwModal" />
    <gs-modal
      v-model="tipForPwModalVisible"
      :show-cancel="false"
      confirm-text="立即修改"
      title="提示"
      @confirm="openEditPw"
    >
      <p>为了账户安全，请立即修改密码</p>
    </gs-modal>
  </div>
</template>
<script lang='ts'>
import StoreService from '../../service/storeService'
import LoginService from '../../service/loginService'
import TenantService from '../../service/tenantService'
import EditPwModel from '../public/editPwModal.vue'
import { getPageAuth } from '../../utils/comUtils'
import CustomSelection from './customSelection.vue'
import { Component, Vue } from 'vue-property-decorator'
import { ssoLogout } from '@/utils/authorition'
import { Getter } from 'vuex-class'


@Component({
    components: {
        EditPwModel,
        CustomSelection
    }
})
export default class CustomHeader extends Vue{
    public isFixed = true;
    public showFeedback = false;
    public isBody = false;
    public isEnter = false;
    public logoutModalVisible = false;
    public editPwModalVisible = false;
    public tipForPwModalVisible = false;
    public menuTheme = 'dark';
    public loading = false;
    public pageAuth = {view: false};
    public isAdmin = false;
    public backCenterUrl = "";
    public isShowNavLogo=false;
    private win: any = window
  

    get userName() {
        return StoreService.getData('userName')
    }
    get isHome() {
        return this.$route.path === '/home/tenantHome'
    }
    get isBackCenter() {
        const path = this.$route.path
        const backRoutes = [
            '/home/logManage',
            '/home/tanantManagement',
            '/home/userManagement',
            '/home/tenantRelation',
            '/home/sysRoleManage'
        ]
        return backRoutes.find((route: string) => {
            return route === path
        })
    }
    get logo(){
      const navLogoPath= this.win.epApp.configs.headerNavLogo;  
      if(!navLogoPath) return false   
      return navLogoPath 
    }


    /**
     * flag>0 return chineseName 
     */
    getTitle(flag: number){
        const {chineseName, englishName}=this.win.epApp.configs.webName || {}
        return flag>0?chineseName:englishName
    }

    @Getter('resourceGroup') resourceGroup: any
    @Getter('currentMenusGroup') currentMenusGroup: any

    async logoutPwd() {
        let token = StoreService.getToken()
        if (token) {
            try {
                await LoginService.ctrlLogout()
            } catch (error) {
                console.log('error: ', error)
            }
        }

        StoreService.clearAll()
        this.$router.push({ path: '/login' })
    }
    showLogoutModal() {
        this.logoutModalVisible = true
    }
    toHome() {
        this.$router.push({ path: '/home/tenantHome', query: { jump: 'no' } })
    }
    toConfig() {
        let auth = getPageAuth(this.currentMenusGroup, '/home/user')
        this.pageAuth = { ...this.pageAuth, ...auth }
        this.pageAuth.view && this.$router.push({ path: '/home/user' })
    }

    getBackCenterAuth(){
        TenantService.getBackResource().then((res: any) => {
            let { system = [] } = res.data
            if (system.length){
                this.isAdmin = true
            }
            for (let item of system){
                if (!item.front_url){
                    continue
                }
                this.backCenterUrl = item.front_url
                return
            }
        })
    }
    toBackupCenter() {
        this.$router.push({
            path: this.backCenterUrl
        })
    }
  /**
   * 初始化页面数据信息等
   */
    initPage() {
        let token = StoreService.getToken()
        if (!token) {
            return this.logoutCtrl()
        }

    // 加载后台管理中心权限资源
        this.getBackCenterAuth()
    }
  /**
   * 用户退出
   */
    logoutCtrl() {
    // sso 用户体系
        if (this.win.epApp.configs.sysUserType) {
            this.logoutSSOSystem()
        } else {
            this.logoutPwd()
        }
    }
  /**
   * 打开修改密码弹窗
   */
    openEditPw() {
        this.editPwModalVisible = true
        this.tipForPwModalVisible = false
    }
  /**
   * 关闭修改密码弹窗
   */
    closeEditPwModal() {
        this.editPwModalVisible = false
    }
  /**
   * SSO 用户体系登出系统
   */
    logoutSSOSystem() {
        if (StoreService.getToken()) {
      // 已经登录
            LoginService.ctrlLogout().then(() => {
              ssoLogout()
            }).catch(err => {
                this.$Message.error(err.msg, 2)
            })
        } else {
            ssoLogout()
        }
    }
    mounted() {
        this.initPage()
    }
    created() {
        const navLogoPath= this.win.epApp.configs.headerNavLogo;  
        //判断是否配置了logoPath，无配置则不显示img标签
        if(navLogoPath) this.isShowNavLogo=true;
        
        let needEdit = StoreService.getData('needEdit')
        this.tipForPwModalVisible = needEdit && needEdit !== 'false' || false
    }

    //路由跳转
    routerJump(){
        const {homeUrl}=(window as any).epApp.configs
        location.href=homeUrl
    }
}
</script>
<style lang="scss" scoped>
.gs-popover.gs-popover-supernatant {
  padding: 0;
  margin-top: -3px;
}

.userPopover-item {
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-family: Microsoft, YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 40px;
  cursor: pointer;

  &:hover {
    color: #4978fc;
    background: rgba(71, 117, 246, 0.1);
  }
}
   

    

  .custom-header-gs-logo {
    cursor: pointer;
    display:flex;
    align-items: center;
    img :first-child {
      width: 164px;
      height: 16px;
    }
    .custom-header-title{
      font-weight: normal !important;
        margin-left: 8px;
        height: 64px;
        display: flex;
        flex-direction: column;
        font-family: "AdobeHeitiStd-Regular";
        font-size: 16px; 
        color: #fff;
          span{
          max-height:32px;
          letter-spacing: 0;
          line-height:48px;
            &:last-child{
              font-family: "PingFangSC-Regular";
              font-size: 10px;
              line-height:24px;
            }
          }
    }   
  }

   .custom-header-container{
     height: 64px;
      /deep/.nav-border{
        div{
          border-color:$header-bg !important;
        }
     
      }
      /deep/ .gs-special-nav{
        background:$header-bg !important
      }
   }

</style>

