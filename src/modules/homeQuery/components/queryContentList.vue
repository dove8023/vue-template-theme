<template>
  <!-- 作废 -->
  <div class="query-content-list-container">
    <div class="main-content-container content-list-container">

      <fix-right-auto-left :width="rightWidth">
        <div slot="left">
          <div
            v-loading="loading"
            class="query-content-list"
          >
            <div class="content-item single-result-container">
              <h2 class="title">{{ singleResult.title }}</h2>

              <p class="content text-center">{{ singleResult.content }}</p>

              <div class="sub-title text-right">
                <span>{{ singleResult.subContent }}</span>
              </div>
            </div>
            <div
              v-for="(item, index) in dataList"
              :key="index"
              class="content-item"
            >
              <h2 class="title pointer">{{ item.title }}</h2>

              <div class="sub-title">
                <span class="authors">{{ item.authors }}</span>
                <span class="source">{{ item.source.join(' ') }}</span>
                <span class="publish-date">{{ item.year }}</span>
              </div>

              <p class="abstract">{{ item.abstract }}</p>

              <div class="text-right margin-top12">
                <span>发表日期 {{ item.published_date }}</span>&emsp;
                <span>评分 {{ item.score }}</span>&emsp;
                <span>阅读量 {{ item.view_time }}</span>&emsp;
                <span>
                  下载量 {{ item.download_time }}
                  <i
                    class="gs-icon-download pointer"
                    @click="downloadFile(item)"
                  />
                </span>
              </div>

            </div>

            <!-- no data -->
            <h1
              v-if="!loading && total === 0"
              class="no-data-text text-center"
            >暂无数据</h1>
          </div>

          <div
            v-if="total > 0"
            class="pagination-container"
          >
            <gs-pagination
              ref="pagination"
              :total="total"
              :before-jump="page => beforeJump(page, 'pagination')"
              :current="pageIndex + 1"
              :page-size="pageSize"
              :page-sizes="pageSizes"
              layout="pagesizes,simplepager,jumper,jumpbtn"
              @page-change="pageChange"
              @page-size-change="pageSizeChange"
            />

            <span class="total-text">共 {{ total }} 条记录</span>
          </div>
        </div>
        <div
          slot="right"
          class="card-container"
        >
          <img
            src="../../../assets/images/demo/1.jpg"
            alt="图片1"
          >
          <img
            src="../../../assets/images/demo/2.jpg"
            alt="图片2"
          >
          <img
            src="../../../assets/images/demo/3.jpg"
            alt="图片3"
          >
        </div>
      </fix-right-auto-left>

    </div>
  </div>
</template>
<script>
  import QueryService from '../../../service/queryService'
  import FormatParamService from '../services/formatParamService'
  import FixRightAutoLeft from '../../../components/fixRightAutoLeft'

  export default {
    components: {FixRightAutoLeft},
    props: {
      queryForm: {
        type: [Object, Array],
        required: true
      },
      orderForm: {
        type: [Object, Array],
        required: true
      }
    },
    data () {
      return {
        param: {},
        singleResult: {
          title: '欢喜岭油田，原油地质储量',
          content: '43144万吨',
          subContent: '评估时间：2017年',
          'query': '欢喜岭',
          'result': {
            '备用名称': '空',
            '区域': '亚太',
            '国家': '中国',
            '省（州）': '辽宁省',
            '市': '盘锦/锦州',
            '县（郡）': '空',
            '乡（镇）': '空',
            '村': '空',
            '经度': '121.77',
            '纬度': '41.025',
            '地质区域': '辽河西部凹陷',
            '权益人/公司': '中国石油',
            '作业公司': '中国石油辽河油气田分公司',
            '合同区块名称': '空',
            '油气类型': '油',
            '发现时间': '1975/03',
            '发现井': '杜4',
            '发现方式': '地震',
            '发现井日产量（油）': '113.8',
            '发现井日产量（气）': '14100',
            '发现井日产量（凝析油）': '-1000',
            '发现井试油日期': '1979/01',
            '发现井总深度': '-1000',
            '发现井井底岩石地层单元': '空',
            '发现井井底岩石地层单元的岩性': '空',
            '发现井井底岩石地层单元的地质年代': '空',
            '油气田规划开发日期': '1979/01',
            '油气田批准开发日期': '0000/00',
            '油气田开发日期': '1979/01',
            '油气田当前状态': '递减',
            '油气田当前状态所在时间': '2005/00',
            '当前开井数': '3210',
            '当前总井数': '5187',
            '钻遇探井总井数': '-1000',
            '油气田当前产量（油）': '7625',
            '油气田当前产量（气）': '-1000',
            '油气田当前产量（凝析油）': '-1000',
            '地形（陆上或海上）': '陆上',
            '水深': '-1000',
            '海拔': '3.5',
            '油气藏数量': '7',
            '探明含油面积': '-1000',
            '探明含气面积': '-1000',
            '探明地质储量（油）': '43144',
            '探明地质储量（气）': '84.74',
            '探明地质储量（凝析油）': '-1000',
            '探明地质储量报告日期': '0000/00',
            '可采储量（油）': '12542.59',
            '可采储量（气）': '-1000',
            '可采储量（凝析油）': '-1000',
            '可采储量报告日期': '0000/00',
            '累计产量（油）': '10181.76',
            '累计产量（气）': '-1000',
            '累计产量（凝析油）': '-1000',
            '累积产量报告时间': '2005/00',
            '剩余可采储量（油）': '2360.83',
            '剩余可采储量（气）': '-1000',
            '剩余可采储量（凝析油）': '-1000',
            '剩余可采储量报告日期': '0000/00',
            '全油气田采收率（油）': '29.07',
            '全油气田采收率（气）': '-1000',
            '全油气田采收率（凝析油）': '-1000',
            '构造位置图': '油田构造位置图.png',
            '构造剖面图': '构造剖面图.png',
            '连井剖面图': '构造剖面图.png.png',
            '钻遇最深井深度': '-1000',
            '钻遇最深井井底岩石地层单元': '空',
            '钻遇最深井井底岩石地层单元的岩性': '空',
            '钻遇最深井井底岩石地层单元的地质年代': '空',
            '数据输入日期': '0000/00',
            '数据最终更新日期': '0000/00',
            '油气藏': '兴隆台'
          }
        },
        dataList: [],
        total: 0,
        pageSize: 10,
        pageIndex: 0,
        pageSizes: [10, 20, 25, 50],
        loading: false,
        rightWidth: 320,
        cardInfo: {
          'table_name': '欢喜岭油气田',
          'table': [
            {
              '油气类型': '油'
            },
            {
              '剩余可采储量（油）': '2360.83'
            },
            {
              '发现方式': '地震'
            }
          ],
          'photos': [
            {
              '构造剖面图': '构造剖面图.png'
            },
            {
              '构造位置图': '油田构造位置图.png'
            }
          ]
        }
      }
    },
    watch: {
      queryForm: function () {
        var me = this
        me.pageIndex = 0
        me.initSearch()
      },
      orderForm: function () {
        var me = this
        me.initSearch()
      }
    },
    mounted () {
      var me = this

      me.initSearch()
    },
    methods: {
      beforeJump (page, pagination = 'pagination') {
        var me = this
        if (isNaN(page) || page < 1 || page > me.$refs[pagination].totalPage) {
          me.$Message.error('请输入正确页数')
          return false
        }
      },

      initSearch () {
        var me = this

        me.param.queryForm = me.queryForm
        me.param.pageSize = me.pageSize
        me.param.pageIndex = me.pageIndex
        me.param.order = me.orderForm

        var param = FormatParamService.formatParam(me.param)

        me.loading = true

        QueryService.query(param).then(function (res) {
          var dataList = res.data.data.map(function (item) {
            var data = item

            data.authors = data.author.join(', ')
            data.score = data.score || 0
            data.view_time = data.view_time || 0
            data.download_time = data.download_time || 0

            return data
          })

          me.dataList = dataList || []
          me.total = res.data.total

          me.loading = false
        }, function (error) {
//          console.log('query content list error', error)
          me.$Message.warning(error.errorMessage || 'err.message')
          me.loading = false
        })
      },

      pageChange (currentPage) {
        var me = this

        me.pageIndex = currentPage - 1 > 0 ? (currentPage - 1) : 0

        me.initSearch()
      },
      pageSizeChange (pageSize) {
        var me = this

        me.pageIndex = 0
        me.pageSize = pageSize

        me.initSearch()
      },

      downloadFile (file) {
        QueryService.downloadFile(file.fileId)
      }
    }
  }
</script>

