<template>
    <div class="hidden-height">
        <custom-header />
        <router-view v-if="isNotNeedHomeSide" class="full-screen" />
        <gs-layouts v-else class="full-screen">
            <custom-navigation />
            <gs-layouts class="main-box">
                <gs-layouts-content class="hidden-height">
                    <div class="module-layout-container hidden-height">
                        <h2 class="sit-map-title">
                            <span>{{ bread }}</span>
                        </h2>
                        <div class="content-main-full">
                            <router-view />
                        </div>
                    </div>
                </gs-layouts-content>
            </gs-layouts>
        </gs-layouts>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter } from "vuex-class";
import CustomHeader from "@/components/home/customHeader.vue";
import CustomNavigation from "@/components/home/customNavigation.vue";


@Component({
    components: {
        CustomHeader,
        CustomNavigation
    }
})
export default class Home extends Vue {
    @Getter("currentActiveMenu") currentActiveMenu: any


    get isNotNeedHomeSide() {
        const path = this.$route.path;
    // 不需要左侧菜单的页面
        const routes = [
            "/home/logManage",
            "/home/tanantManagement",
            "/home/userManagement",
            "/home/tenantRelation",
            "/home/sysRoleManage",
            "/home/tenantHome"
        ];
        let target = routes.find((route: string) => {
            return route === path;
        }) || false;

        return target;
    }

    get bread(){
    // 根据currentActiveMenu确定面包屑的显示
        const { currentActiveMenu } = this;

        if (!currentActiveMenu){
            return "知识图谱管理平台";
        }

        if (!currentActiveMenu.children){
            return currentActiveMenu.label;
        }
        return currentActiveMenu.children[0].label;
    }
}
</script>
<style scoped>
.full-screen{
  height: calc(100% - 64px);
}
.main-box{
  margin-left: 10px;
}
.content-main-full{
  background: inherit;
  min-height: calc(100vh - 130px);
}
</style>
