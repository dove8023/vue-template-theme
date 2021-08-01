import StoreService from '../service/storeService'
import { Message } from '@gs-ui/gs-ui'
import router from '../router/index'
import { kmpObj } from "@/kmp"
import { jumpSsoLogin, getSsoTicket } from "./loginSSO"
import axios from "axios"
import UrlConfig from './urlConfig'
/* eslint-disable */ // @ts-ignore 
import { cookie } from "@components/sso-jssdk";

let win: any = window

/**
 * sso模式
 * 1. 未从sso授权页面返回, 跳转至sso授权页面
 * 2. 已从sso授权页面返回, 依据ST换取TGT，请求登录接口
 */
export const ssoLogin = async ()=>{
  let ssoUrl = win.epApp.configs.ssoUrl

  let Ticket = await getSsoTicket();
  console.log('ssoLogin Ticket: ', Ticket)
  if(!Ticket){
    return jumpSsoLogin(ssoUrl);
  }

  // kmp-web 支持依据ticket(tgt)获取kmp-token
  kmpObj.getKmpToken(Ticket);

  let param = {
    'id': 'test_2020', 
    'date': '2020-02-14 10:38:22', 
    'data': { 'login_name': '', 'password': '' } 
  }

  let res: any = await axios({
    url: UrlConfig.loginInfo.login,
    method: "POST",
    headers: {
      token: Ticket
    },
    data: param
  })

  res = res.data

  if(res.code != 0){
    Message.error(res.msg, 2);
    return setTimeout(()=>{
      // jumpSsoLogin(ssoUrl);
      Message.error("请稍后刷新重试", 5)
    }, 2000);
  }

  let token = res.data.jwt;
  StoreService.setData('needEdit', false)
  StoreService.setData("kgp-token", token);
  StoreService.setData("userName", res.data.name);

  return router.replace('/');
}

/**
 * 依据localStorage token检测用户登录状态
 * 
 * token不存在时
 * 1.非sso模式调整登录页面
 * 2.sso模式触发sso登录流程
 */
export const authorition = () => {
  let token = StoreService.getToken();
  if(token){
    return true
  }

  let isSsoType = win.epApp.configs.sysUserType;

  /**
   * pwd模式
   */
  if(!isSsoType){
    router.replace('/login');
    return false;
  }

  /**
   * sso模式
   */
  ssoLogin();
  return false;
}


/**
 * tenantCode 无效
 */
export const tenantCodeInvalid = ()=>{
  localStorage.removeItem("tenantCode");
  router.replace("/home/tenantHome");
}


/**
 * token 无效
 */
export const tokenInvalid = ()=>{
  localStorage.removeItem("kgp-token");
  setTimeout(()=>{
    authorition()
  }, 500);
}


/**
 * sso logout
 */
export const ssoLogout = async ()=> {
  localStorage.clear()
  sessionStorage.clear()
  
  try {
    const reg = new RegExp('(^| )' + 'X-SSO-FullticketId' + '=([^;]*)(;|$)')
    const r: any = document.cookie.match(reg)
    let tgt = '';
    if(r.length){
      tgt = window.decodeURIComponent(r[2]);
    }

    cookie.delete("X-SSO-FullticketId");
    await axios({
      headers: {
          ticket: tgt
      },
      method: 'DELETE',
      url: win.epApp.configs.ssoUrl + 'api/v2/logout'
    })
  } catch (error) {
      console.log(error)
  }

  location.href = win.epApp.configs.ssoUrl + 'login?service=' + location.href.split('/#/')[0] + '/#/'
}