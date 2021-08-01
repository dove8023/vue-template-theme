import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'

export default class QueryService {
    static query(param: any) {
        var option = {
            url: UrlConst.queryUrl.query,
            data: param
        }

        return HttpService.post(option)
    }

    static queryKeyword(param: { keyword: string | number | boolean }) {
        var option = {
            url: UrlConst.queryUrl.queryKeyword + '?keyword=' + encodeURIComponent(param.keyword),
            dataParams: param
        }

        return HttpService.get(option)
    }

    static simpleQuery(param: any) {
        var option = {
            url: UrlConst.queryUrl.newQuery,
            data: param
        }

        return HttpService.post(option)
    }

    static simpleQueryKg(param: any) {
        var option = {
            url: UrlConst.queryUrl.simpleQueryKg,
            queryParams: param
        }

        return HttpService.get(option)
    }

    static getRHistory(param: any) {
        var option = {
            url: UrlConst.queryUrl.getResearchHistory,
            queryParams: param
        }

        return HttpService.get(option)
    }

    // 获取分组数据
    static getGroupInfo(param: any) {
        var option = {
            url: UrlConst.queryUrl.groupInfo,
            data: param
        }

        return HttpService.post(option)
    }

    // 在检索结果中查找分组后的数据
    static queryInSearchResult(param: any) {
        var option = {
            url: UrlConst.queryUrl.queryInRst,
            data: param
        }

        return HttpService.post(option)
    }

    static advancedQuery(param: any) {
            var option = {
                url: UrlConst.queryUrl.newAdvancedQuery,
                data: param
            }

            return HttpService.post(option)
        }
        // 获取问答table数据
    static getPDF(param: any) {
            var option = {
                url: UrlConst.queryUrl.pdf,
                queryParams: param
            }

            return HttpService.get(option)
        }
        // 获取问答table数据
    static getQATable(param: any) {
            var option = {
                url: UrlConst.queryUrl.qaTable,
                queryParams: param
            }

            return HttpService.get(option)
        }
        // 获取问答graph数据
    static getQAGraph(param: any) {
            var option = {
                url: UrlConst.queryUrl.qaGraph,
                queryParams: param
            }

            return HttpService.get(option)
        }
        // 获取基础数据
    static getBasicInfo() {
        var option = {
            url: UrlConst.queryUrl.getBasicInfo
        }

        return HttpService.get(option)
    }

    // 获取摘要数据
    static getContentList(param: any) {
        var option = {
            url: UrlConst.queryUrl.getContentList,
            data: param
        }

        return HttpService.post(option)
    }

    static getCardInfo(param: any) {
        var option = {
            url: UrlConst.queryUrl.card,
            queryParams: param
        }

        return HttpService.get(option)
    }

    static getCardPhoto(param: any) {
        var option = {
            url: UrlConst.queryUrl.cardPhoto,
            queryParams: param
        }

        return HttpService.get(option)
    }

    static getCardTable(param: any) {
        var option = {
            url: UrlConst.queryUrl.cardTable,
            queryParams: param
        }

        return HttpService.get(option)
    }

    // 获取列表数据
    static getTableList(param: any) {
        var option = {
            url: UrlConst.queryUrl.getTableList,
            data: param
        }

        return HttpService.post(option)
    }

    static searchSimilarTable(param: any) {
        var option = {
            url: UrlConst.queryUrl.searchSimilarTable,
            queryParams: param
        }

        return HttpService.get(option)
    }

    // static searchSimilarGraph(param: any) {
    //     var option = {
    //         url: UrlConst.queryUrl.searchSimilarGraph,
    //         queryParams: param
    //     }

    //     return HttpService.get(option)
    // }
    static downloadImg(url: any) {
        var fullUrl = UrlConst.queryUrl.downloadImg + `?image_url=/${url}`
        window.open(fullUrl, '_blank')
    }

    // 下载文档
    static downloadFile(fileId: any) {
        const host = (window as any).epApp.API_URL_DOMAIN
        var url = `${host}/api/kipf/service/filemgr/sourcefile/download/${fileId}`
        window.open(url, '_blank')
    }

    // 查看PDF
    static previewFile(fileId: any) {
        var option = {
            url: UrlConst.filesProcess.getFileContent,
            queryParams: { fileId: fileId }
        }
        return HttpService.get(option)
    }
}