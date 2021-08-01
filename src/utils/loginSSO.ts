import SsoSdk from "@components/sso-jssdk";
/* eslint-disable */ // @ts-ignore 
import { cookie } from "@components/sso-jssdk";

export const jumpSsoLogin = (ssoUrl: string)=>{
    location.href = ssoUrl + "login?service=" + location.href;
}; 

export const getSsoSt = ()=>{
    let search = location.search;
    if(!search){
        return;
    }

    search = search.substr(1, search.length);
    const searchs = search.split("&");
    let ticket = "";
    searchs.forEach((item)=>{
        if(item.indexOf("ticket") <  0){
            return;
        }

        ticket = item.split("=")[1];
    });

    return ticket;
};

export const getSsoTGT = async (ssoUrl: string) => {
    const sdk = new SsoSdk({
        sso: ssoUrl + "api/v2/",
        key: "X-SSO-FullticketId",
        stKey: "ticket",
        tgtKey: "tgt",
        expires: 0
    });

    const res = await sdk.autoSSO();
    return res;
};

/**
 * sso ticket 存在两种模式
 * 1. url st模式。获取st后需通过ssoSDK获取tgt凭证，再进行login 获取token
 * 2. cookie tgt 传递模式。直接进行login
 * 3. 优先获取cookie模式
 */
export const getSsoTicket = async () =>{
    let tgt = cookie.get("X-SSO-FullticketId");
    console.log('cookie.get tgt: ', tgt);
    if(tgt){
        return tgt;
    }

    // 检测 st
    let st = getSsoSt();
    if(st){
        let win = window as any;
        let ssoUrl = win.epApp.configs.ssoUrl
        let res = await getSsoTGT(ssoUrl);
        return res.Ticket;
    }
    return
}