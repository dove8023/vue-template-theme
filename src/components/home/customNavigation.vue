<template>
  <gs-layouts-sider style="z-index:1;overflow:hidden;" :width="200" theme="light" collapsible :collapsed.sync="siderCollapsed" @collapsed-change-end="toggleMenus">
    <div class="custom-navigation-container">
      <gs-menus :default-active="active" :collapsed.sync="collapsed" theme="light" @click="openMenus">
        <template v-for="(item, index) of menuList">
          <!-- 多级菜单 -->
          <template v-if="item.children">
            <gs-sub-menus :key="index" :title="item.label" :index="'ep-' + index">
              <div slot="menuitem">
                <div class="iconfont-wrap">
                  <i :class="item.className" class="iconfont" />
                </div>
                <span v-show="!collapsed">{{ item.label }}</span>
              </div>
              <gs-menus-item v-for="navItem of item.children" :key="navItem.routeUrl" :title="navItem.label" :index="navItem.routeUrl" :class="[{'is-active':active === item.routeUrl}]">
                <!-- M：系统内部跳转的路由、SL：外部链接，打开新窗口 -->
                <!-- 外连系统 -->
                <a v-if="navItem.type === 'SL'" :href="config[navItem.routeUrl]" target="_blank">{{ navItem.label }}</a>
                <!-- 普通菜单 -->
                <template v-else>
                  <router-link :to="{ path: navItem.routeUrl }">
                    {{ navItem.label }}
                  </router-link>
                </template>
              </gs-menus-item>
            </gs-sub-menus>
          </template>
          <template v-else>
            <!-- 只有一级菜单 -->
            <gs-menus-item :key="index" :title="item.label" :index="item.routeUrl" :class="[{'is-active':active === item.routeUrl}]">
              <router-link :to="{ path: item.routeUrl }">
                <div class="iconfont-wrap">
                  <i :class="item.className" class="iconfont" />
                </div>
                <span v-show="!collapsed">{{ item.label }}</span>
              </router-link>
            </gs-menus-item>
          </template>
        </template>
      </gs-menus>
    </div>
  </gs-layouts-sider>
</template>

<script lang='ts'>
import { getLeftNav, deepCopy } from '../../utils/comUtils'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import Store from '@/vuex/store'

interface IMenu {
  children: Array<IMenu>;
  label: string|number;
  className: string;
  routeUrl: string;
  type?: string;
}
@Component
export default class CustomNavigation extends Vue {
    public siderCollapsed = false
    public collapsed = false
    public active = ''
    public menuList: Array<IMenu> = []
    public config = (window as any).epApp.configs
    @Getter('currentMenusGroup') currentMenusGroup: any;
    @Watch('$route.path')
  $routeChange(val: any) {
      this.calcCurrentActive(val) 
  }
    @Watch('currentMenusGroup')
  groupChange(){
      this.initPage()
  }
    calcCurrentActive(val: any){
        let current = {}
       this.menuList.some(item => {
      // 如果是一级路由
            if (item.routeUrl && val.indexOf(item.routeUrl) > -1){
                return current = item
            }
      // 如果是多级路由
            if (item.children){
                let parent = deepCopy(item)
                let child = item.children.find(c => {
                    return c.routeUrl && val.indexOf(c.routeUrl) > -1
                })

                if (child) {
                    parent.children = [child]
                    current = parent
                    return true
                }
                return false
            }
        })
        
        if(JSON.stringify(current)!=="{}"){
          this.active=(current as any).children?(current as any).children[0].routeUrl:(current as any).routeUrl
        }
       
        Store.commit('setCurrentActive', current)
    }
    async created() {
        this.initPage()
       
    }
  /**
   * 初始化页面数据
   */
    async initPage() {
       
        if (!this.currentMenusGroup.length){
            return
        }
        this.menuList = getLeftNav(this.currentMenusGroup)// 获取左侧菜单  
        this.calcCurrentActive(this.$route.path)
    }
    openMenus() {
      this.siderCollapsed = false;
      this.collapsed = false;
    }

    toggleMenus(){
      this.$nextTick(()=>{
        this.collapsed = this.siderCollapsed;
      })
    }

}
</script>
