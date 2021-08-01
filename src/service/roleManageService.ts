import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'
import Store from '../vuex/store'
const roleManage = {
  editRole (payload:any) {
    return HttpService.post({
      url: UrlConst.roleManage.editRole,
      data: {
        data: payload
      }
    })
  },
  searchRole (payload:any) {
    let param:any = {
      url: `${UrlConst.roleManage.searchRole}/${payload.pageNo}/${payload.pageSize}`
    }
    if (payload.data) {
      param.data = {
        data: payload.data
      }
    }
    return HttpService.post(param)
  },
  sourceList () {
    return HttpService.get({
      url: UrlConst.roleManage.sourceList + '/' + Store.getters.tenantCode
    })
  },
  roleDelete (payload:any) {
    return HttpService.delete({
      url: `${UrlConst.roleManage.roleDelete}/${payload.id}`
    })
  },
  wholeMember (payload:any) {
    let param:any = {
      url: `${UrlConst.roleManage.wholeMember}/${payload.id}/${payload.pageNo}/${payload.pageSize}`
    }
    if (payload.data) {
      param.data = {
        data: payload.data
      }
    }
    return HttpService.post(param)
  },
  roleSource (payload:any) {
    return HttpService.get({
      url: `${UrlConst.roleManage.getrRoleSource}/${payload.roleId}`
    })
  },
  roleDownList () {
    return HttpService.get({
      url: UrlConst.userManage.wholeRoles
    })
  }
}
export default roleManage
