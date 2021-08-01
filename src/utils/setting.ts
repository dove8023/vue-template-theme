/*
 * @Author: hexisen@gridsum.com 
 * @Date: 2021-04-26 11:25:05 
 * @Last Modified by: hexisen@gridsum.com
 * @Last Modified time: 2021-04-26 11:33:01
 * @Content: 系统设置数据
 */

export const dd = {
    queryType: [
        { key: 0, label: '综合', data: '_all' },
        { key: 1, label: '全文', data: 'fileContent' },
        { key: 2, label: '关键词', data: 'docKeywords' },
        { key: 3, label: '摘要', data: 'fileAbstract' },
        { key: 4, label: '题名', data: 'fileName' },
        { key: 5, label: '作者', data: 'author' },
        // {key: 6, label: '发表时间', data: 'published_date'}
    ],
    queryOrder: [
        { key: 1, label: '相关度', data: 'key_words' },
        { key: 2, label: '题名', data: 'title' },
        { key: 3, label: '发表时间', data: 'published_date' },
        { key: 4, label: '评分', data: 'score' },
        { key: 5, label: '阅读量', data: 'view_time' },
        { key: 6, label: '下载量', data: 'download_time' }
    ],
    complexQueryType: [
        { key: 1, label: '全文', field: 'fileContent', type: 'text' },
        // {key: 1, label: '全文', field: 'abstract', type: 'text'},
        // {key: 2, label: '关键词', field: 'key_words', type: 'text'},
        // {key: 3, label: '摘要', field: 'abstract', type: 'text'},
        { key: 4, label: '题名', field: 'title', type: 'text' },
        // {key: 5, label: '作者', field: 'author', type: 'text'},
        // {key: 6, label: '发表时间', field: 'published_date', type: 'date-range'}
    ]
}