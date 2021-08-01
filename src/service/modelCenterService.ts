import HttpService from './httpService'
import UrlConst from '../utils/urlConfig'

export default class ModelCenterService {

    static getAllExtractModelList() {
        var option = {
            url: UrlConst.modelCenter.extractModels.getAllModelList,
            queryParams: {type: 1}
        }
        return HttpService.get(option)
    }

    static preMarkDoc(params: any) {
        var option = {
            url: UrlConst.modelCenter.extractModels.preMarkDoc,
            queryParams: params
        }
        return HttpService.post(option)
    }
}
