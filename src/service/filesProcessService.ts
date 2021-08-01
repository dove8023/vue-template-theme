import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'

export default class FilesProcessService {
  static getFilesList (params: any) {
    var option = {
      queryParams: params,
      url: UrlConst.filesProcess.getFilesList
    }

    return HttpService.get(option)
  } // 获取文档管理列表

  static getFileContent (params: any) {
    var option = {
      queryParams: params,
      url: UrlConst.filesProcess.getFileContent
    }

    return HttpService.get(option)
  } // 获取单个文档的内容

  static updateFileContent (params: { fileId: string | Blob; content: string | Blob }) {
    let form = new FormData()
    form.append('fileId', params.fileId)
    form.append('content', params.content) // 用fomrdata来封装参数

    let option = {
      header: {
        'Content-Type': 'multipart/form-data'
      },
      data: form,
      url: UrlConst.filesProcess.updateFileContent
    }
    return HttpService.post(option)
  } // 更新文档内容

  static updateFileProperty (params: any) {
    let option = {
      data: params,
      url: UrlConst.filesProcess.updateFileProperty
    }
    return HttpService.post(option)
  } // 更新文档属性

  static getMarkList (params: any) {
    var option = {
      queryParams: params,
      url: UrlConst.filesProcess.getMarkList
    }

    return HttpService.get(option)
  } // 获取标注列表
}
