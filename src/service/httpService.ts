import { authorition, tenantCodeInvalid, tokenInvalid } from '@/utils/authorition'
import {Notification} from '@gs-ui/gs-ui'
import axios from "axios"

const servProxy = axios.create({})

servProxy.interceptors.response.use(
  res => {
    return res
  },
  error => {
    // 拦截http错误

    let status = error.request.status;

    let errorMessage = `${error.request.status}-${error.request.statusText}-${error.request.response}`
    switch(status){
		case 401:
			// Notification.error(error.request.response, 3)
      tokenInvalid();
			break;
		default:
			Notification.error(errorMessage, 4.5);
			break;
    }
   
    return new Promise((resove, reject) => {
      reject(error)
    })
  }
)


let http = async function(method: any, url: string, queryParams: any, data: any, timeout: number, options: any) {
  let res = await servProxy({
    headers: {
      token: localStorage.getItem("kgp-token"),
      tenant_code: localStorage.getItem("tenantCode") || '',
      ...options.headers
    },
    method,
    url,
    params:queryParams,
    data,
    timeout
  })
	
	let { code, msg } = res.data;
	
	if(code == 0 || code == 200){
		return res.data;
	}

  switch(code){
    case 1404:
      tenantCodeInvalid();
      break;
    default:
      break;
  }

  if(options.errors){
    return res.data;
  }
  
	Notification.error(msg, 4.5);

  throw new Error(msg)
}

var httpService = {
  get: function(options: any) {
    return http('get', options.url, options.queryParams, '', 0, options)
  },
  post: function(options: any) {
    return http('post', options.url, options.queryParams, options.data, options.timeout, options)
  },
  put: function(options: any) {
    return http('put', options.url, options.queryParams, options.data, 0, options)
  },
  create: function(options: any) {
    return http(options.method, options.url, options.queryParams, options.data, 0, options)
  },
  delete: function(options: any) {
    return http('delete', options.url, options.queryParams, options.data, 0, options)
  }
}

export default httpService
