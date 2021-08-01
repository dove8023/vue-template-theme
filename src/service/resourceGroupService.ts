import HttpService from './httpService'
import UrlConfig from '../utils/urlConfig'

export default class {
  static getGroupList(code: string) {
    var option = {
      url: UrlConfig.GroupManage.getGroupList + code
    }
    return HttpService.get(option)
  } // 获取资源组树列表请求
  static getAllResourceList() {
    return HttpService.get({
      url: UrlConfig.GroupManage.getAllResourceList
    })
  }
  static addGroup(param: any) {
    var option = {
      url: UrlConfig.GroupManage.addGroup,
      data: param
    }
    return HttpService.post(option)
  } // 新增资源组请求

  static editGroup(param: any) {
    var option = {
      url: UrlConfig.GroupManage.editGroup,
      data: param
    }
    return HttpService.put(option)
  } // 编辑资源组请求

  static deleteGroup(id: any) {
    var option = {
      method: 'delete',
      url: UrlConfig.GroupManage.deleteGroup,
      queryParams: {
        id
      }
    }
    return HttpService.create(option)
  } // 删除资源组请求
  
  static dragGroup(param: any) {
    var option = {
      url: UrlConfig.GroupManage.dragGroup,
      data: param
    }
    return HttpService.post(option)
  } // 拖拽资源组更新接口

}
