/**
 * bootstrap kmp-web
 */

import kmpSDK, { IKMP_RESPONES } from "@gridsum/kmp-web-sdk";
import  router from "./router";
import  { tenantCodeInvalid, tokenInvalid } from "./utils/authorition";
import  store from "./vuex/store";
const win    = window as any;
const configEnv = process.env.CONFIG_ENV || "master";

export let kmpObj: IKMP_RESPONES

export default async function kmpInit(theme: string){
    win.REMOTE_FILES.map((item: any)=>{
        if (configEnv.indexOf("test") > -1){
            item.url = item.testUrl;
        }
    });

    kmpObj = await kmpSDK({
        router,
        KMP_API: win.epApp.API_URL_DOMAIN,
        remotes: win.REMOTE_FILES,
        store,
        theme,
        kmpTenantEmpty: ()=>{
            tenantCodeInvalid();
        },
        kmpTokenInvalid:() =>{
            tokenInvalid();
        }
    });
}
