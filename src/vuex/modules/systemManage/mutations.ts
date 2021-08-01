import { getMenuDefaultUrl, getMenuResource } from "@/common";
import { kmpObj } from "@/kmp";
import router from "@/router"
import { Message } from "@gs-ui/gs-ui";

const mutations = {
  setResourceGroupInfo(state: { resourceGroupInfo: any }, val: any) {
    state.resourceGroupInfo = val
  },

  /**
   * 设置租户ID
   * 1. 依据新的tenantCode获取左侧菜单列表
   * 2. 根据需要，是否刷新router-view
   * @param state 
   * @param val 
   */
  async setTenantCode(state: { tenantCode: any }, options: { val:string, jump: boolean }) {
    console.log('setTenantCode : has been called.', options);
	  let { val, jump = false } = options;
    
    localStorage.setItem('tenantCode', val)
    kmpObj.setTenantCode(val)

    let tenantResource: any[] = [];
    // 获取左侧菜单权限列表
    try {
      tenantResource = await getMenuResource();
    } catch (error) {
      console.log(error);
    }

    if(!tenantResource.length){
      Message.info("该租户没有任何权限", 2)
      setTimeout(()=>{
        localStorage.removeItem("tenantCode");
        router.push("/home/tenantHome")
      }, 1000);
      return
    }

    if(jump){
      let defaultUrl = getMenuDefaultUrl(tenantResource);
      if(defaultUrl == router.app.$route.path){
        router.go(0);
      }else{
        router.replace(defaultUrl);
      }
    }
  },
  setCurrentActive(state: { currentActiveMenu: any }, val: any){
    state.currentActiveMenu = val
  }
}

export default mutations
