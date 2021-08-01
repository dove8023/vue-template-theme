import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'

const userGroupManage = {
  // 获取用户组列表
  getUserGroupList (payload: { pageNo: any; pageSize: any; keyword: any }) {
    return HttpService.get({
      url: UrlConst.userGroupManage + `/${payload.pageNo}/${payload.pageSize}/${payload.keyword}`
    })
  },
  // 新增用户组
  addUserGroup (payload: any) {
    return HttpService.post({
      url: UrlConst.userGroupManage,
      data: payload
    })
  },
  // 删除用户组
  deleteUserGroup (payload: { userGroupId: any }) {
    return HttpService.delete({
      url: UrlConst.userGroupManage + `/${payload.userGroupId}`
    })
  },
  // 修改用户组
  updateUserGroup (payload: any) {
    return HttpService.put({
      url: UrlConst.userGroupManage,
      data: payload
    })
  },
  // 获取当前用户组所有成员列表
  getMemberList (payload: { groupId: any; pageNo: any; pageSize: any; keyword: any }) {
    return HttpService.get({
      url: UrlConst.userGroupMemberManage + `/${payload.groupId}/${payload.pageNo}/${payload.pageSize}/${payload.keyword}`
    })
  },
  // 获取非当前用户组成员的其他用户列表
  getUnselectMemberList (payload: { groupId: any; pageNo: any; pageSize: any }) {
    return HttpService.get({
      url: UrlConst.userGroupMemberElse + `/${payload.groupId}/${payload.pageNo}/${payload.pageSize}`
    })
  },
  // 修改用户组下的成员
  updateUserGroupMember (payload: any) {
    return HttpService.put({
      url: UrlConst.userGroupMemberManage,
      data: payload
    })
  },
  // 删除用户组下的成员
  deleteUserGroupMember (payload: { user_group_id: any; user_id: any }) {
    return HttpService.delete({
      url: UrlConst.userGroupMemberManage + `/${payload.user_group_id}/${payload.user_id}`
    })
  },
  // 校验重名
  checkNameUnique (data: any) {
    return HttpService.post({
      url: UrlConst.userGroupManage + '/isUnique',
      data
    })
  }
}
export default userGroupManage
