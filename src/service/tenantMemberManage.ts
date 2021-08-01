import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'
import Store from '../vuex/store'

export default class {
  static getMemberList (payload:any) {
    let param:any = {
      url: UrlConst.tenantMember.search + payload.pageNum + '/' + payload.pageSize,
      header: {
        tenant_code: Store.getters.tenantCode
      }
    }
    if (payload.data) {
      param.data = {
        data: payload.data
      }
    }
    return HttpService.post(param)
  }
  static editMember (payload:any) {
    return HttpService.post(
      {
        url: UrlConst.tenantMember.edit,
        header: {
          tenant_code: Store.getters.tenantCode
        },
        data: {
          data: payload
        }
      }
    )
  }
  static deleteMember (name:any) {
    return HttpService.delete({
      url: UrlConst.tenantMember.delete + name,
      header: {
        tenant_code: Store.getters.tenantCode
      }
    })
  }
  static checkName (login_name:any) {
    return HttpService.get({
      url: UrlConst.tenantMember.checkName+"/"+login_name,
      header: {
        tenant_code: Store.getters.tenantCode
      },
      
    })
  }
  
}
