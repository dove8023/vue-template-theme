import LoginService from "@/service/loginService"
import Store from '@/vuex/store'
import { Message } from "@gs-ui/gs-ui";

// 获取左侧菜单资源
export const getMenuResource = async ()=> {
    let res: any = await LoginService.getUserResGroup();
    if(res.code !== 0){
        return Message.error("权限列表获取失败", 3);
    }

    let { tenant } = res.data;

    // 之后来梳理setResourceGroupInfo的业务逻辑
    Store.commit('setResourceGroupInfo', tenant)
    return tenant;
}

let win = window as any;
export const getMenuDefaultUrl = (tenant: any[] = [])=>{
    /**
     * 勘探院需求默认选中 图谱管理-实体管理 /home/entity-manage
     * 后期基于后端返回字段设置默认选中项
     */
    const defaultUrl = win.epApp.configs.defaultUrl || "/home/entity-manage"
    for(let item of tenant){
        if(item.front_url == defaultUrl){
            return defaultUrl;
        }

        if(!item.children || !item.children.length){
            continue;
        }

        for(let child of item.children){
            if(child.front_url == defaultUrl){
                return defaultUrl;
            }
        }
    }

    /* ========================================================== */

    for(let item of tenant){
        if(item.front_url){
            return item.front_url;
        }

        if(item.children && item.children.length){
            return item.children[0].front_url
        }
    }

    return "/home"
}