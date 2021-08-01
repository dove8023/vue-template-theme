const queryHost = (window as any).epApp.API_URL_DOMAIN
const host = (window as any).epApp.API_URL_DOMAIN

// 租户相关
const tenantApi = host + '/api/kipf/service/auth'
const analysisApiFix = host + '/api/kipf/service'
const filesManageApi = host + '/api/kipf/service/file/processing'
// 模型中心
const modelCenterApi = host + '/api/kipf/service/file/processing'
const kgSearchApi = analysisApiFix + '/file/processing/knowledge/'
const filemgrApi = analysisApiFix + '/filemgr/'
const analysisApiNew = analysisApiFix + '/business/baseapp/report/'

const knowledgeManageApiPrefix = host + '/api/kipf/service/graph/'

export default {
    login: queryHost + 'api/kipf/service/auth/user/login',
    logout: queryHost + 'api/kipf/service/auth/user/logout',
    getCurrentUser: queryHost + 'account/get_current_user/',
  // 权限管理 用户管理
    userManage: {
        searchUser: host + '/api/kipf/service/auth/user/sys/search',
        editUser: host + '/api/kipf/service/auth/user/coru',
        deleteUser: host + '/api/kipf/service/auth/user/delete',
        userInfo: host + '/api/kipf/service/auth/user/sso/userinfo',
        wholeRoles: host + '/api/kipf/service/auth/role/list',
        editPw: host + '/api/kipf/service/auth/user/password/change',
        resetPw: host + '/api/kipf/service/auth/user/password/reset'
    },
  // 用户组管理
    userGroupManage: host + '/api/kipf/service/auth/user/group',
    userGroupMemberManage: host + '/api/kipf/service/auth/user/group/member',
    userGroupMemberElse: host + '/api/kipf/service/auth/user/group/member/userelse',

  // SSO租户关系配置
    tenantRelation: {
        getTenantList: tenantApi + '/tenant/mapping/list', // 获取租户关系列表
        addTenantRelation: tenantApi + '/tenant/mapping/add', // 新增租户关系
        updateTenantRelation: tenantApi + '/tenant/mapping/update', // 修改租户关系
        deleteTenantRelation: tenantApi + '/tenant/mapping/delete', // 删除租户关系
        getSSOTenantList: tenantApi + '/tenant/mapping/listall/ssoTenants', // 获取sso租户列表
        getLocalTenantList: tenantApi + '/tenant/list/simple', // 获取kipf租户列表
        getOtherSSOTenantList: tenantApi + '/tenant/mapping/listother/ssoTenants', // 获取sso租户列表【其他】
        getOtherLocalTenantList: tenantApi + '/tenant/list/other' // 获取kipf租户列表【其他】
    },

  // 日志管理接口
    log: {
        list: host + '/api/kipf/service/sys/sysoperlog/list/table/singlecondition'
    },
  // 登录管理
    loginInfo: {
        login: host + '/api/kipf/service/auth/user/login',
        logout: host + '/api/kipf/service/auth/user/logout',
        resourceGroup: host + '/api/kipf/service/auth/user/list/resource', // 获取当前用户资源组
        ssoToKipf: host + '/api/kipf/service/auth/tenant/mapping/listpair/ssoTenantCode/toKipfTenantCode' // 获取sso对应的租户列表
    },
  // 租户相关接口
    tenant: {
        search: tenantApi + '/tenant/mapping/list/', // 查询 修改
        enable: tenantApi + '/tenant/enable/', // 启用
        stop: tenantApi + '/tenant/stop/', // 停用
        userTenant: tenantApi + '/user/tenants/', // 我的租户
        project: tenantApi + '/tenant/project/list/simple', // 引用项目 下拉列表
        tenant: tenantApi + '/tenant/list/simple',  // 引用租户 下拉列表
        add: tenantApi + '/tenant/coru', // 新建租户
        sourceGroup: tenantApi + '/tenant/whole/', // 租户资源组
        userProjects: tenantApi + '/user/tenants/', // 获取header选择器数据 租户+项目
        tenantDatabaseCfg: tenantApi + '/tenant/store/allInfo/', // 获取租户数据库配置信息
        getBackResource: tenantApi + '/user/list/admin/resource', // 获取后台中心资源
        getSearchTenantList: tenantApi + '/tenant/search', // 最新接口获取租户列表
        createTenant: tenantApi + '/tenant/create' // 创建租户【v2.6.0引入的新接口】
    },
    tenantMember: {
        search: tenantApi + '/tenant/user/search/',
        edit: tenantApi + '/tenant/user/coru/user',
        delete: tenantApi + '/tenant/user/',
        checkName: tenantApi + '/tenant/user/check/user'
    },
  // 资源组管理接口
    GroupManage: {
        getGroupList: tenantApi + '/resource/group/list/', // 根据租户获取资源组列表
        getAllResourceList: tenantApi + '/resource/group/resource/list', // 获取所有资源
    // ------------------  在body里传租户code
        addGroup: tenantApi + '/resource/group/add', // 添加资源组
        editGroup: tenantApi + '/resource/group/update', // 编辑资源组
        deleteGroup: tenantApi + '/resource/group/delete', // 删除资源组
        dragGroup: tenantApi + '/resource/group/drag' // 拖拽资源组排序
    },
    sysManage:{
        authRoleSysList:tenantApi +'/role/sys/list',
        editUserNow: tenantApi + '/role/addUser',

    },
    filesProcess: {
        getFilesList: filesManageApi + '/list', // 获取文档列表
        getFileContent: filesManageApi + '/content/get', // 获取单个文档内容
        updateFileContent: filesManageApi + '/content/update', // 保存对单个文档内容的修改
        updateFileProperty: filesManageApi + '/property/update', // 保存单个文档属性的修改
        getMarkList: filesManageApi + '/mark/list' // 获取标注文档列表
    },
   // brat 相关操作
    bratMap: {
        bodySetting: host + '/api/kipf/service/business/bratservice/brat/configuration/v2.1.0', // 本体配置
        docCopy: host + '/api/kipf/service/business/bratservice/brat/document/v2.1.0', // brat文档复制并生成ann文件
        docClear: host + '/api/kipf/service/business/bratservice/brat/document/v2.1.0', // brat文档清除
        markImport: host + '/api/kipf/service/business/bratservice/brat/import/v2.1.0' // brat标注导入
    },
  // 模型中心接口
    modelCenter: {
    // 模型列表-抽取模型
        extractModels: {
      // getAllModelList: modelCenterApi + '/api/model/extract/all',
            getAllModelList: analysisApiFix + '/gthunder/model/extract/selectList',
            preMarkDoc: modelCenterApi + '/api/model/extract/mark'
        },
    },
  // 知识查询
    queryUrl: {
        query: host + 'es/query/',
        queryKeyword: host + 'es/query_keyword/',
        newQuery: host + 'es_search',
        groupInfo: host + 'es_aggs_search',
        queryInRst: host + 'es_rst_search',
        newAdvancedQuery: host + 'es_advanced_search',
        pdf: host + 'es/doc/preview',
        qaTable: host + 'qa/qa_graph',
        qaGraph: host + 'graph/show',
        getBasicInfo: host + 'getBasicInfo',
        getContentList: host + 'getContentList',
        getTableList: host + 'getTableList',
        card: host + 'card',
        cardPhoto: host + 'graph_card/photo', // 知识卡片 图片
        cardTable: host + 'graph_card/table', // 知识卡片 表格,
        searchSimilarTable: host + 'achievement/data/statistics',
        downloadImg: host + 'graph_card/image/download',
        downloadFile: host + 'es/doc/download',
        simpleQueryKg: kgSearchApi + 'search/simple', // 简单查询java移植接口
        fileDonload: filemgrApi + 'file/download',
        getDocFileContent: filemgrApi + 'file/content', // 文件预览 Java移植
        getResearchHistory: analysisApiFix + '/filemgr/index/search/qAndA'
    },
  // 知识应用
    knowledgeUsing: {
        getAnalysisInfo: host + '/analysis', // 图谱分析
        searchAnalysisInfo: host + '/report/graph/analysis/cross/v1/search', // 查询图文分析

        searchSimilarNodes: analysisApiNew + 'search/relate/nodes', // 查询相似节点
        previewChart: analysisApiNew + 'chart/drawing', // 预览图表
        saveOrUpdate: analysisApiNew + 'chart/saveorupdate', // 保存或更新图表
        getAllCharts: analysisApiNew + 'chart/list', // 获取所有图表
        getChartData: analysisApiNew + 'chart/refresh', // 获取单个图表数据
        deleteChart: analysisApiNew + 'chart/delete', // 删除图表
        getEditInfo: analysisApiNew + 'chart/getone' // 编辑图表时获取具体信息
    },

  // 知识管理
    knowledgeManage: {
    // 本体管理
        body: {
            search: knowledgeManageApiPrefix + 'ontological/schema/select/v1', // 查询节点、关系列表
            searchCount: knowledgeManageApiPrefix + 'ontological/vertex/count/select/v1', // 节点和关系的数据库本体总量

            attrsDataType: knowledgeManageApiPrefix + 'ontological/property/type/select/v1', // 获取属性-数据类型列表
            updateNode: knowledgeManageApiPrefix + 'ontological/vertex/update/v1', // 新建节点 更新节点
            deleteNode: knowledgeManageApiPrefix + 'ontological/vertex/delete/v1', // 删除节点

            edgeLogicRelations: knowledgeManageApiPrefix + 'ontological/rel/logic/select/v1', // 关系-逻辑设置列表
            edgeLogicRelationsAbout: knowledgeManageApiPrefix + 'ontological/rel/logic/corresponding/v1', // 当逻辑关系选择相反性/等价性时，对应的关系的下拉
            updateEdge: knowledgeManageApiPrefix + 'ontological/rel/update/v1', // 新建关系 更新关系
            deleteEdge: knowledgeManageApiPrefix + 'ontological/rel/delete/v1', // 删除关系

            nodesList: knowledgeManageApiPrefix + 'ontological/node/select/v1', // 本体所有节点列表查询

            nodeAttrsUnique: knowledgeManageApiPrefix + 'ontological/vertex/select/property/v1', // 选择实体类型 本体所有节点属性列表（去重）
            nodeAttrs: knowledgeManageApiPrefix + 'ontological/vertex/property/distinct/select/v1', // 不选择实体类型 只搜索属性 本体所有节点列表查询
            edgesListUnique: knowledgeManageApiPrefix + 'ontological/head/tail/select/v1', // 根据头尾节点名称查询关系列表
            edgesList: knowledgeManageApiPrefix + 'ontological/rel/distinct/select/v1', // 查询本体关系的所有列表
            edgesListWithIds: knowledgeManageApiPrefix + 'ontological/search/allrel/v1', // 获取所有关系（模板下载模块） 多了id 头尾节点的属性

            downloadBatchModal: knowledgeManageApiPrefix + 'ontological/download/vertex/sourcetemplate/v1', // 本体管理木模板下载
            uploadModalUrl: knowledgeManageApiPrefix + 'ontological/schema/import', // 本体管理批量导入

            nodesListNoStandard: knowledgeManageApiPrefix + 'ontological/node/select/v1', // 本体所有节点列表查询
            edgesListNoStandard: knowledgeManageApiPrefix + 'ontological/rel/distinct/select/v1', // 查询本体关系的所有列表
        },

    // 实体管理
        entity: {
            search: knowledgeManageApiPrefix + 'noumenon/entity/search/simple/v1', // 查询节点、关系列表
            searchCount: knowledgeManageApiPrefix + 'noumenon/entity/totalcount/v1', // 节点和关系的数据库实体总量
            searchComplex: knowledgeManageApiPrefix + 'noumenon/entity/search/complex/v1', // 高级查询
            filterSearchUrl: knowledgeManageApiPrefix + 'noumenon/entity/search/filter', // 筛选过滤查询
            updateNode: knowledgeManageApiPrefix + 'noumenon/entity/node/update/v1', // 新建节点 更新节点
            deleteNode: knowledgeManageApiPrefix + 'noumenon/entity/node/delete/v1', // 删除节点

            updateEdge: knowledgeManageApiPrefix + 'noumenon/entity/edge/update/v1', // 新建关系 更新关系
            deleteEdge: knowledgeManageApiPrefix + 'noumenon/entity/edge/delete/v1', // 删除关系

            nodesList: knowledgeManageApiPrefix + 'noumenon/entity/node/select/label/v1', // 根据本体名称查询实体节点名称列表

            reasoning: host + 'graph_algo/reasoning', // 在线推理
            pathExplore: host + 'graph_algo/path_explore', // 路径探索
            connectGraphDownload: host + 'graph_algo/connected_graph', // 连通图下载
            upload: knowledgeManageApiPrefix + 'noumenon/upload/substance/sourcedata/v1', // 文件上传
            templateDownload: knowledgeManageApiPrefix + 'noumenon/download/substance/sourcetemplate/v1', // 实体导入模板下载
            batchUpdate: knowledgeManageApiPrefix + 'noumenon/upload/substance/sourcedata/v1', //
            cpyherSearch: knowledgeManageApiPrefix + 'noumenon/entity/searchcp/v1', // cpyher查询
        // nodesAndEdgesDownload:  knowledgeManageApiPrefix + 'noumenon/download/sunstance/v1', // 当前实体节点和关系excel下载
            nodesAndEdgesDownload: knowledgeManageApiPrefix + 'noumenon/download/sunstancenew/v1' // 实体数据和关系下载(通过id下载）
        }
    },
   // 字典管理
    dictionaryManage: {
        participleList: host + '/dict/list',
        participleAdd: host + '/dict/add',
        synonymsSearch: host + '/synonym/search',
        synonymsAdd: host + '/synonym/add',
        synonymsDel: host + '/synonym/delete'
    },
  // 权限管理 角色管理
    roleManage: {
        editRole: host + '/api/kipf/service/auth/role/coru',
        searchRole: host + '/api/kipf/service/auth/role/search',
        docClear: host + '/api/kipf/service/business/bratservice/brat/document/v2.1.0', // brat文档清除
        markImport: host + '/api/kipf/service/business/bratservice/brat/import/v2.1.0', // brat标注导入
        sourceList: host + '/api/kipf/service/auth/resource/group/list',
        roleDelete: host + '/api/kipf/service/auth/role/delete',
        wholeMember: host + '/api/kipf/service/auth/user/search/role',
        getrRoleSource: host + '/api/kipf/service/auth/role/whole'
    }
}
