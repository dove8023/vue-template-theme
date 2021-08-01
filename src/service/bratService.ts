import urlConfig from '../utils/urlConfig'
import httpService from './httpService'

export default {

  /**
   * brat文档复制并生成ann文件（如果不存在的话）
   */
  docCopy(param: any) {
    return httpService.put({
      url: urlConfig.bratMap.docCopy,
      data: param
    })
  },
  /**
   * brat本体配置
   */
  bodySetting(param: any) {
    return httpService.put({
      url: urlConfig.bratMap.bodySetting,
      data: param
    })
  },

  /**
   * brat文档清除
   */
  docClear(param: any) {
    return httpService.create({
      method: "delete",
      url: urlConfig.bratMap.docClear,
      data: param
    })
  },

  /**
   * brat标注导入
   */
  markImport(param: any) {
    return httpService.post({
      url: urlConfig.bratMap.markImport,
      data: param
    })
  },
}
