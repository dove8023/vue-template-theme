/**
 * 开发环境配置
 */
console.log("开发环境 master 配置: ");
(function(epApp) {

    const configs = {

        title: "勘探开发知识成果共享与协同研究平台",

        homeUrl: "http://dev-riped.internal.gridsumdissector.com",

        webName: {
            chineseName: "中国石油勘探开发研究院",
            englishName: "RESEARCH INSTITUTE OF PETROLEUM EXPLORATION & DEVELOPMENT"
        },
        headerNavLogo: "./logo.png",
        faviconPath: "./logo.png",
        // 从租户列表页进入后默认跳转地址
        defaultUrl: "/home/entity-manage",
        sysUserType: false, // 标识用户类型 true:sso用户体系， false:自定义用户体系
        ssoUrl: "https://sso-internal.gridsumdissector.com/",

        theme: "red",

        urlPrefix: {
            // brat python服务地址
            queryApi: "http://10.201.82.113:8080/",
            // brat 数据抽取独立接口地址
            extractApi: "http://10.202.81.187:2088/",
            // brat markApi 地址
            newExtractApi: "http://dev-kg.gridsum.com/gateway/api/kipf/service/file/processing/",
            // brat 服务地址
            bratUrl: "http://dev-kg.gridsum.com/brat/",
        }
    };

    epApp.configs = configs;
    epApp.API_URL_DOMAIN = "http://dev-kg.gridsum.com/gateway";
    this.epApp = epApp;

    document.title = configs.title || "勘探开发知识成果共享与协同研究平台";
}(window));



// 存在未知设置项

// closeNavView: false, // 关闭菜单显示，当被其他系统iframe形式嵌套时，需要设置为true
// DataScienceStudio: 'http://10.200.60.54:9012', // 数据挖掘工具箱
// DocumentParsingPlatform: 'http://10.202.42.9:32000/', // 文档解析平台
// questionPlatform: 'http://10.202.41.108:10009/', // 智能问答平台
// documentCenter: 'http://10.201.81.83:20001/oli-gas-knowledge-dev/#/searchList', // 检索中心
