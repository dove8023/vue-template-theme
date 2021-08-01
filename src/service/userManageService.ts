import HttpService from './httpService'
import UrlConfig from '../utils/urlConfig'

const userManage = {

  // 用户查询
  searchUser(payload: { pageNo: any; pageSize: any; data: any }) {
    let param: any = {
      url: `${UrlConfig.userManage.searchUser}/${payload.pageNo}/${payload.pageSize}`
    }
    if (payload.data) {
      param.data = {
        data: payload.data
      }
    }
    return HttpService.post(param)
  },
  editUser(payload: any) {
    return HttpService.post({
      url: UrlConfig.userManage.editUser,
      data: {
        data: payload
      }
    })
  },
  editUserNow(params: any){
    return HttpService.put({
      url:UrlConfig.sysManage.editUserNow,
      data: params
    })
  },
  deleteUser(payload: { id: any }) {
    return HttpService.delete({
      url: `${UrlConfig.userManage.deleteUser}/${payload.id}`
    })
  },
  /**
   * @desc 获取用户信息
   */
  searchSSOUser() {
    return HttpService.get({
      url: UrlConfig.userManage.userInfo,
      queryParams: {},
      header: {
        'sso_ticket': 'TGT-2110-v5rMYL5AedvrXyIYkb5cbHBtbPWIUbFcMgSkdQvGp3zUfxefvZ-x-sso'
      }
    })
  },
  wholeRoles() {
    return HttpService.get({
      url: UrlConfig.userManage.wholeRoles
    })
  },
  // 用户修改密码
  editPw(payload: { oldPw: any; newPw: any }) {
    let paramUrl = `/${payload.oldPw}/${payload.newPw}`
    return HttpService.put({
      url: `${UrlConfig.userManage.editPw}${paramUrl}`
    })
  },
  // 重置用户密码
  resetPw(payload: { id: any }) {
    let paramUrl = `/${payload.id}`
    return HttpService.put({
      url: `${UrlConfig.userManage.resetPw}${paramUrl}`
    })
  }
}
export default userManage
