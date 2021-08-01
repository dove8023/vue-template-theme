import md5 from 'blueimp-md5'
import Store from '../vuex/store'
// 对象拷贝
// export const copyObj = (source: any, dist: any) => {
//   for (let k in source) {
//     dist[k] = source[k]
//   }
// }

/**
 * 下载文件流
 * @type {[type]}
 */
// export const downloadBlob = (blobStr: any, fileName: any, contentType: any) => {
//   let blob = new Blob([blobStr], {
//     type: contentType
//   })
//   let reader = new FileReader()
//   reader.readAsDataURL(blob)
//   reader.onload = function(e) {
//     let a: any = document.createElement('a')
//     let file: any = e
//     if (fileName.indexOf('.txt') >= 0) {
//       a.download = fileName
//     } else {
//       a.download = fileName + '.txt'
//     }
//     a.href = file.target.result
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//   }
// }

/**
 * 将中文名称编码为brat识别的名称
 * @param zhName
 */
export const encodeBratName = (zhName: any) => {
  return zhName && encodeURIComponent(zhName).replace(/%/g, '$')
}
export const decodeBratName = (bratName: any) => {
  return bratName && decodeURIComponent(bratName.replace(/\$/g, '%'))
}

export const md5BratName = (zhName: any) => {
  return zhName && md5(zhName)
}

/**
 *  根据当前页面url获取页面的权限
 * @param data
 * @param url
 */
export const getPageAuth = (data: any, url: string) => {
  let currentData = Store.getters.currentMenusGroup
  let auth: any = {}
  if(!currentData.length){
    return auth
  }
  for (let item of currentData) {
    /* 页面是一级菜单 */
    if (item.front_url === url) {
      let perms = item.perms // 当前页面的编码
      for (let authItem of item.children) {
        let authName = authItem.perms.replace(perms + ':', '')
        auth[authName] = true
      }
      break
    } else {
      if (item.resource_type === 'M') {
        for (let nav of item.children) {
          if (nav.front_url === url) {
            let perms = nav.perms // 当前页面的编码
            for (let authItem of nav.children) {
              let authName = authItem.perms.replace(perms + ':', '')
              auth[authName] = true
            }
            break
          }
        }
      }
    }
  }
  return auth
}

export const getLeftNav = (data: any) => {
  // let list:any[] = []
  // for (let item of data) {
  //   if (item.resource_type === 'M') {
  //     let secondNav = []
  //     for (let nav of item.children) {
  //       if (nav.resource_type === 'M' || nav.resource_type === 'SL') {
  //         secondNav.push({
  //           label: nav.name,
  //           className: nav.icon_class,
  //           routeUrl: nav.front_url,
  //           type: nav.resource_type
  //         })
  //       }
  //     }
  //     // 一级菜单信息
  //     let navInfo: any = {
  //       label: item.name,
  //       className: item.icon_class,
  //       routeUrl: item.front_url,
  //       type: item.resource_type
  //     }
  //     // 如果存在二级菜单
  //     if (secondNav.length > 0) {
  //       navInfo.children = secondNav
  //     }
  //     list.push(navInfo)
    // }
  // }
  // return list
}
/**
 * @method 角色管理部分--通过树形结构子节点遍历获取(已选+半选中)状态下节点key值集合
 */
 export const filterTreeKeys = function (nodes:any) {
  let set = new Set()
  let getParentFunc = function (node:any) {
    set.add(node.$node.key)
    if (node.$node.parentKey && !set.has(node.$node.parentKey)) {
      getParentFunc(node.$node.parent)
    } else {
      return null
    }
  }
  nodes.forEach((item: any) => {
    getParentFunc(item)
  })
  return [...set]
}

/**
 * 获取默认的url：根据后端返回的front_url
 * @param data
 * @returns {string}
 */
// export const getSysDefaultUrl = (data: any) => {
//   let defaultUrl = ''
//   let filterArr = []
//   for (let val of data) {
//     if (val.resource_type === 'M') {
//       filterArr.push(val)
//     }
//   }
//   for (let item of filterArr) {
//     if (item.resource_type === 'M') {
//       if (item.front_url) {
//         defaultUrl = item.front_url
//         break
//       } else {
//         for (let nav of item.children) {
//           if (nav.resource_type === 'M' && nav.front_url) {
//             defaultUrl = nav.front_url
//             break
//           }
//         }
//       }
//     }
//   }
//   return defaultUrl
// }

/**
 * 在删除数据后重新计算当前页码
 * @param total 删除前总条数
 * @param pageSize 每页显示条数
 * @param page 删除前页码
 * @param count 删除数据条数
 * @returns {*} 最新页码
 */
// export const computeCurPage = (total: number, pageSize: number, page: number, count = 1) => {
//   const totalPage = Math.ceil((total - count) / pageSize) // 总页数
//   let curPage = page > totalPage ? totalPage : page
//   return curPage < 1 ? 1 : curPage
// }

/**
 * 根据指定字符串中，指定文字背景高亮
 * @param {*} val 原始字符串
 * @param {*} keyword 高亮的子字符串
 */
// export const highlightWord = (val: any, keyword = '') => {
//   if (keyword) {
//     if (val.indexOf(keyword) !== -1) {
//       val = val.replace(
//         new RegExp(keyword, 'g'),
//         '<span class="custom-gs-highlight">' + keyword + '</span>'
//       )
//     }
//   }
//   return val
// }


// export const getUrlParamsByKey = (name: string) => {
//   const url: string = location.search
//   let reg = new RegExp('(|&)' + name + '=([^&/#]*)')
//   let str = url.match(reg)
//   if (str && str[0]) {
//     return str[0].split('=')[1]
//   }
//   return ''
// }

/**
 * 用于数据的深拷贝
 * @params obj
 */
export const deepCopy = (obj: any) => {
  // if (obj === null) {
  //   return obj
  // }
  // if (typeof obj === 'object') {
  //   if (Array.isArray(obj)) {
  //     var newArray = []
  //     for (var i = 0; i < obj.length; i++) {
  //       newArray.push((obj[i]))
  //     }
  //     return newArray
  //   } else {
  //     var newObj: any = {}
  //     for (var key in obj) {
  //       newObj[key] = deepCopy(obj[key])
  //     }
  //     return newObj
  //   }
  // } else {
  //   return obj
  // }
}

