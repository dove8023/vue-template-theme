/* eslint-disable @typescript-eslint/camelcase */
// vuex 的getters
export default {
  resourceGroup: (state: any) => state.systemManage.resourceGroupInfo,  // 当前用户的所有资源组
  currentMenusGroup: (state: any) => {
    /**
     * kmp-gpower, gpower项目页面逻辑依赖全局数据。
     * 后期需隔离这一问题，gpower应独立获取自己的权限内容
    */

    localStorage.setItem("kmp-gpower", JSON.stringify(state.systemManage.resourceGroupInfo))

    return state.systemManage.resourceGroupInfo
  },
  tenantCode: (state: any) => localStorage.getItem('tenantCode'),
  currentActiveMenu:(state:any) => state.systemManage.currentActiveMenu
}
