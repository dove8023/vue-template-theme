import urlConfig from '../utils/urlConfig'
import httpService from './httpService'

export default {

  /**
   * 分词列表
   * @returns
   */
  getParticipleList () {
    return httpService.get({
      url: urlConfig.dictionaryManage.participleList
    })
  },

  /**
   * 添加分词
   * @param {*} param
   * @returns
   */
  addParticiple (param: any) {
    return httpService.post({
      url: urlConfig.dictionaryManage.participleAdd,
      data: param
    })
  },

  /**
   * 检索同义词
   * @param {*} param
   * @returns
   */
  searchSynonyms (param: any) {
    return httpService.get({
      url: urlConfig.dictionaryManage.synonymsSearch,
      queryParams: param
    })
  },

  /**
   * 添加同义词
   * @param {*} param
   * @returns
   */
  addSynonyms (param: any) {
    return httpService.post({
      url: urlConfig.dictionaryManage.synonymsAdd,
      data: param
    })
  },

  /**
   * 删除同义词
   * @param {*} param
   * @returns
   */
  delSynonyms (param: any) {
    return httpService.post({
      url: urlConfig.dictionaryManage.synonymsDel,
      data: param
    })
  }
}

