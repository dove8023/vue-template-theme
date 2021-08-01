import HttpService from './httpService'
import UrlConfig from '../utils/urlConfig'
import CryptoJS  from "crypto-js";
import { deepCopy } from '@/utils/comUtils';

const KEY = CryptoJS.enc.Utf8.parse("gridsum*gridsum*");
const IV = CryptoJS.enc.Utf8.parse("www.gridsum.com*");

export default class LoginService {

  /**
   * password登录
   * @param param
   * @returns {*|Promise|Promise<any>}
   */
  static ctrlLogin(param: any) {
    param = deepCopy(param)
    let encryptedData = CryptoJS.AES.encrypt(param.data.password, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    let password = encryptedData.ciphertext.toString(CryptoJS.enc.Base64);
    param.data.password = password;

    var option = {
      url: UrlConfig.loginInfo.login,
      data: param
    }
    
    return HttpService.post(option)
  }

  /**
   * 退出
   * @returns {*|Promise|Promise<any>}
   */
  static ctrlLogout() {
    let option = {
      method: 'delete',
      url: UrlConfig.loginInfo.logout
    }

    return HttpService.create(option)
  }

  static getUserResGroup() {
    let option = {
      url: UrlConfig.loginInfo.resourceGroup
    }

    return HttpService.get(option)
  }
  /**
   * 获取SSO租户映射kipf租户
   */
  static getRemoteTenantRelation() {
    let option = {
      url: UrlConfig.loginInfo.ssoToKipf
    }
    return HttpService.get(option)
  }
}
