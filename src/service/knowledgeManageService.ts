import urlConfig from '../utils/urlConfig'
import httpService from './httpService'


export default {

  // 本体管理
  bodyManage: {
    search (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.search,
        data: param
      })
    },

    searchCount (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.searchCount,
        data: param
      })
    },

    /**
     * 获取数据类型列表
     * @param {*} param
     */
    attrsDatatype (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.attrsDataType,
        data: param
      })
    },

    updateNode (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.updateNode,
        data: param
      })
    },

    deleteNode (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.deleteNode,
        data: param
      })
    },

    /**
     * 获取逻辑设置下拉列表
     * @param {*} param
     */
    edgeLogicRelations (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.edgeLogicRelations,
        data: param
      })
    },

    /**
     * 当逻辑设置选择相反性 相等性 时，会有对应的关系
     * @param {*} param
     */
    edgeLogicRelationsAbout (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.edgeLogicRelationsAbout,
        data: param
      })
    },

    updateEdge (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.updateEdge,
        data: param
      })
    },

    deleteEdge (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.deleteEdge,
        data: param
      })
    },

    /**
     * 获取本体节点列表
     * @param {*} param
     */
    allBodyNodes (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.nodesListNoStandard,
        data: param
      })
    },

    /**
     * 根据头尾节点获取本体关系列表
     * @param {*} param
     */
    aboutBodyEdges (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.edgesListUnique,
        data: param
      })
    },

    /**
     * 根据头尾节点获取本体关系列表
     * @param {*} param
     */
    bodyEdges (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.edgesListNoStandard,
        data: param
      })
    },

    /**
     * 根据头尾节点获取本体关系列表
     * @param {*} param
     */
    bodyEdgesWithIds (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.edgesListWithIds,
        data: param
      })
    },


    /**
     * 选择实体类型 查出相关属性
     * @param {*} param
     */
    nodeAttrsUnique (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.nodeAttrsUnique,
        data: param
      })
    },

    /**
     * 不选择实体类型 查出相关属性
     * @param {*} param
     */
    nodeAttrs (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.body.nodeAttrs,
        data: param
      })
    }

  },

  // 实体管理
  entityManage: {
    search (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.search,
        data: param
      })
    },


    searchCount (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.searchCount,
        data: param,
      })
    },

    /**
     * 高级搜索
     * @param {*} param
     */
    searchComplex (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.searchComplex,
        data: param
      })
    },

    /**
     * 高级搜索-单独查询节点和关系的数量
     * @param {*} param
     */
    // searchFuzzyCount (param: any) {
    //   return httpService.post({
    //     url: urlConfig.knowledgeManage.entity.searchFuzzyCount,
    //     data: param
    //   })
    // },

    /**
     * 高级搜索-单独查询节点和关系的数量
     * @param {*} param
     */
    // searchComplexCount (param: any) {
    //   return httpService.post({
    //     url: urlConfig.knowledgeManage.entity.searchComplexCount,
    //     data: param
    //   })
    // },

    updateNode (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.updateNode,
        data: param
      })
    },

    deleteNode (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.deleteNode,
        data: param
      })
    },

    updateEdge (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.updateEdge,
        data: param
      })
    },

    deleteEdge (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.deleteEdge,
        data: param
      })
    },

    /**
     * 根据本体名称查询实体节点名称列表
     * @param {*} param
     */
    entityNodesList (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.nodesList,
        data: param
      })
    },

    /**
     * 在线推理
     * @param {*} param
     */
    reasoning (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.reasoning,
        data: param
      })
    },

    /**
     * 路径探索
     * @param {*} param
     */
    discovery (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.pathExplore,
        data: param
      })
    },

    /**
     * cpyher查询
     * @param {*} param
     */
    cpyherSearch (param: any) {
      return httpService.post({
        url: urlConfig.knowledgeManage.entity.cpyherSearch,
        data: param
      })
    }

  }
}
