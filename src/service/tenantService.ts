import HttpService from './httpService'
import UrlConfig from '../utils/urlConfig'

export default class {
  /**
   *
   * @method 所有租户
   */
  static getTenantList(payload: { pageNum: any; pageSize: string; keyWord: string; data: any }) {
    let options = {
      url: UrlConfig.tenant.search + payload.pageNum + '/' + payload.pageSize + '/' + payload.keyWord,
      data:{}
    }
    if (payload.data) {
      options.data = {
        data: payload.data
      }
    }
    return HttpService.get(options)
  }
  /**
   * @method 用户拥有的租户
   */
  static getUserTenantList(params: { pageNum: any; pageSize: string; keyWord: any }) {
    let options = {
      url: UrlConfig.tenant.userTenant + params.pageNum + '/' + params.pageSize,
      data: {
        name: params.keyWord || ''
      }
    }
    return HttpService.post(options)
  }
  /**
   * @method 获取租户下拉列表项
   */
  static getTenantDownLists() {
    return HttpService.get({
      url: UrlConfig.tenant.tenant
    })
  }
  /**
   * @method 获取租户+项目下拉列表项
   */
  static getTenantDownList() {
    return HttpService.get({
      url: UrlConfig.tenant.userProjects + '1/100'
    })
  }
  /**
   * @method 获取租户对应资源组
   */
  static getTenantSourceGroup(code: any) {
    return HttpService.get({
      url: UrlConfig.tenant.sourceGroup + code
    })
  }
  static enableTenant(id: any) {
    return HttpService.put({
      url: UrlConfig.tenant.enable + id
    })
  }
  static stopTenant(id: any) {
    return HttpService.put({
      url: UrlConfig.tenant.stop + id
    })
  }
  static addTenant(payload: any) {
    return HttpService.post({
      url: UrlConfig.tenant.add,
      data: {
        data: payload
      }
    })
  }
  static viewTananDatabaseCfg(code: any) {
    return HttpService.get({
      url: UrlConfig.tenant.tenantDatabaseCfg + code
    })
  }
  /**
   * @method 获取后台中心资源
   */
  static getBackResource() {
    return HttpService.get({
      url: UrlConfig.tenant.getBackResource,
      headers:{
        isSys:true
      }
    })
  }
  // 获取租户关系列表
  static getTenantRelationList(data: { pageNo: any; pageSize: any; keyWord: any }) {
    return HttpService.get({
      url: UrlConfig.tenantRelation.getTenantList + `/${data.pageNo}/${data.pageSize}/${data.keyWord}`
    })
  }
  // 新增租户关系
  static addTenantRelation(data: any) {
    return HttpService.post({
      url: UrlConfig.tenantRelation.addTenantRelation,
      data
    })
  }
  // 修改租户关系
  static updateTenantRelation(data: any) {
    return HttpService.put({
      url: UrlConfig.tenantRelation.updateTenantRelation,
      data
    })
  }
  // 删除租户关系
  static deleteTenantRelation(data: { id: any }) {
    return HttpService.delete({
      url: UrlConfig.tenantRelation.deleteTenantRelation + `/${data.id}`
    })
  }
  // 获取sso租户列表
  static getSSOTenantList() {
    return HttpService.get({
      url: UrlConfig.tenantRelation.getSSOTenantList
    })
  }
  // 获取kipf租户列表
  static getLocalTenantList() {
    return HttpService.get({
      url: UrlConfig.tenantRelation.getLocalTenantList
    })
  }
  // 获取【其他】sso租户列表
  static getOtherSSOTenantList(data: any) {
    return HttpService.post({
      url: UrlConfig.tenantRelation.getOtherSSOTenantList,
      data
    })
  }
  // 获取【其他】kipf租户列表
  static getOtherLocalTenantList(data: any) {
    return HttpService.post({
      url: UrlConfig.tenantRelation.getOtherLocalTenantList,
      data
    })
  }
  // 更加name或admin_login_name获取租户列表
  static getSearchTenantList(params: { pageNo: any; pageSize: any; data: any }) {
    return HttpService.post({
      url: UrlConfig.tenant.getSearchTenantList + `/${params.pageNo}/${params.pageSize}`,
      data: params.data
    })
  }
  // 新建租户，v2.6.0新增接口
  static createTenant(params: any) {
    return HttpService.post({
      url: UrlConfig.tenant.createTenant,
      data: params
    })
  }
}
