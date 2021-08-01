import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'

export default class AnalysisService {
    static getAnalysisInfo() {
        var option = {
            url: UrlConst.knowledgeUsing.getAnalysisInfo
        }

        return HttpService.get(option)
    }
    static searchAnalysisInfo(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.searchAnalysisInfo,
            data:params
        }
        return HttpService.post(option)
    } // 搜索图谱分析表

    static searchSimilarNodes(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.searchSimilarNodes,
            data:params
        }
        return HttpService.post(option)
    } // 搜索相似的节点

    static previewChart(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.previewChart,
            data:params
        }
        return HttpService.post(option)
    } // 预览图表

    static saveOrUpdate(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.saveOrUpdate,
            data:params
        }
        return HttpService.post(option)
    } // 保存或更新图表

    static getAllCharts(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.getAllCharts,
        }
        return HttpService.get(option)
    } // 获取所有图表信息

    static getChartData(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.getChartData,
            data:params,
            errors:true
        }
        return HttpService.post(option)
    } // 根据id查询图表数据

    static deleteChart(params: any){
        var option = {
            url: UrlConst.knowledgeUsing.deleteChart,
            data:params
        }
        return HttpService.post(option)
    } // 删除图表

    static getEditInfo(id: string){
        var option = {
            url: UrlConst.knowledgeUsing.getEditInfo+'/'+id,
        }
        return HttpService.get(option)
    } // 获取所有图表信息
    getEditInfo: any



}


