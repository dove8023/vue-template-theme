<template>
  <div class="query-list-container">
    <!--<a-->
    <!--href="http://10.201.80.86:8080/files/doc/original/preview?fileId=77"-->
    <!--target="_blank"-->
    <!--&gt;查看详情</a>-->

    <div class="main-content-container list-container">
      <fix-right-auto-left :width="pushWidth">
        <!--left 列表-->
        <span
          slot="left"
          style="height: 100%"
        >
          <!--列表-->
          <div class="content-list-container">
            <div class="content-list-wrap scroll-container">
              <!-- 图表 -->
              <div v-if="queryForm.queryMode">
                <!--<span>我是dashboardList同级元素</span>-->
                <dashboard-list
                  ref="dashboardList"
                  :page-auth="pageAuth"
                  :param="param"
                />
              </div>

              <!--列表摘要切换按钮-->
              <div class="query-order-container">
                <fix-right-auto-left :width="80">
                  <span
                    slot="left"
                    class="float-right"
                  />
                  <span slot="right">
                    <gs-radio-group
                      v-model="listShowMode"
                      type="button"
                      class="float-right"
                    >
                      <gs-radio
                        :class="{ active: listShowMode == 1 }"
                        label="1"
                        @click="changeShowMode(1)"
                      >
                        <i class="icon-query-list" />
                      </gs-radio>
                      <gs-radio
                        :class="{ active: listShowMode == 2 }"
                        label="2"
                        @click="changeShowMode(2)"
                      >
                        <i class="icon-query-abstract" />
                      </gs-radio>
                    </gs-radio-group>
                  </span>
                </fix-right-auto-left>
              </div>

              <!-- 列表内容 -->
              <gs-table
                v-loading="loading"
                v-if="listShowMode == 1"
                :data="dataList"
                style="width: 100%"
                class="query-table-container"
              >
                <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="fileName"
                  label="题名"
                  min-width="200"
                >
                  <template slot-scope="scope">
                    <span
                      class="pointer primary-text"
                      @click="showContent(scope.row)"
                    ><span v-html="scope.row.fileName" /></span>
                  </template>
                </gs-table-column>
                <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="author"
                  label="作者"
                  width="120"
                >
                  <template slot-scope="scope">
                    <span v-html="scope.row.author" />
                  </template>
                </gs-table-column>
                <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="source"
                  label="知识来源"
                  width="120"
                />
                <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="publishTime"
                  label="发表日期"
                  width="90"
                />
                <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="esScore"
                  label="评分"
                  width="120"
                  class-name="text-right"
                />
                <!-- <gs-table-column
                  :show-overflow-tooltip="true"
                  prop="view_time"
                  label="阅读量"
                  width="80"
                  class-name="text-right"
                >
                  <template slot-scope="scope">
                    {{ scope.row.view_time }}
                    <router-link :to="{ path: '/show-pdf' }" target="_blank">
                      <i
                        v-if="false"
                        class="gs-icon-file-o pointer primary-text"
                      />
                    </router-link>
                  </template>
                </gs-table-column>-->
                <!-- <gs-table-column
                  prop="download_time"
                  label="下载量"
                  width="80"
                  class-name="text-right"
                >
                  <template slot-scope="scope">
                    {{ scope.row.download_time }}
                    <i
                      v-if="false"
                      class="gs-icon-download pointer"
                      @click="downloadFile(scope.row)"
                    />
                  </template>
                </gs-table-column>-->

                <gs-table-column
                  :width="80"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <gs-button
                      type="text"
                      class="table-options primary-text"
                      @click="previewFile(scope.row)"
                    >预览</gs-button>
                    <gs-button
                      :disabled="!pageAuth.download"
                      type="text"
                      class="table-options primary-text"
                      @click="downloadFile(scope.row)"
                    >下载</gs-button>
                  </template>
                </gs-table-column>
              </gs-table>

              <!-- 摘要内容 -->
              <div
                v-loading="loading"
                v-if="listShowMode == 2"
                class="query-content-list"
              >
                <div
                  v-for="(item, index) in dataList"
                  :key="index"
                  class="content-item"
                >
                  <h2
                    class="title pointer primary-text"
                    @click="showContent(item)"
                  ><span v-html="item.fileName" /></h2>
                  <div
                    v-if="item.author"
                    class="sub-title"
                  >
                    <span class="authors">作者：<span v-html="item.author" /></span>
                  </div>
                  <p
                    class="abstract"
                    v-html="item.fileAbstract"
                  />

                  <!--底部 发表日期 评分 查看 下载-->
                  <div class="footer margin-top12">
                    <span
                      v-if="item.publishTime"
                      class="publish-date"
                    >发表日期 {{ item.publishTime }}</span>

                    <span class="float-right">
                      <!--评分-->
                      <gs-button
                        class="margin-right6"
                        @click="thumbsUp(item, 1)"
                      >
                        <i class="gs-icon-heart-o" />
                        评分 {{ item.esScore }}
                      </gs-button>
                      <!--查看-->
                      <gs-button
                        class="margin-right6"
                        @click="previewFile(item)"
                      >
                        <i class="gs-icon-attention-o" />
                        查看
                        {{ item.view_time }}
                      </gs-button>
                      <!--下载-->
                      <gs-button
                        :disabled="!pageAuth.download"
                        @click="downloadFile(item)"
                      >
                        <i class="gs-icon-download" />
                        下载
                        {{ item.download_time }}
                      </gs-button>
                    </span>
                  </div>
                </div>

                <!-- no data -->
                <h1
                  v-if="!loading && total === 0"
                  class="no-data-text text-center"
                >暂无数据</h1>
              </div>

              <!--分页-->
              <div
                v-if="total > 0"
                class="pagination-container"
              >
                <gs-pagination
                  ref="pagination"
                  :total="total"
                  :before-jump="page => beforeJump(page, 'pagination')"
                  :current="pageIndex"
                  :page-size="pageSize"
                  :page-sizes="pageSizes"
                  layout="pagesizes,simplepager,jumper,jumpbtn"
                  @page-change="pageChange"
                  @page-size-change="pageSizeChange"
                />

                <span class="total-text">共 {{ total }} 条记录</span>
              </div>
            </div>
          </div>
        </span>

        <!--right 知识卡片 相关推送-->
        <span
          slot="right"
          style="height: 100%"
        >
          <!--知识卡片-->
          <!---->
          <!-- v-if="queryForm && queryForm.queryMode" -->
          <knowledge-card
            v-show="param.sentence"
            :page-auth="pageAuth"
            :para="param"
          />

          <!--相关知识-->
          <!--"-->
          <knowledge-card-table
            v-show="param.sentence"
            :page-auth="pageAuth"
            :para="param"
          />

          <!--推送-->
          <!---->
          <div
            v-show="param.sentence"
            class="similar-push margin-top16 scroll-container"
          >
            <div class="similar-push-header">相关推荐</div>
            <ul
              v-if="similarPushTags.length"
              class="tags-container"
            >
              <li
                v-for="(tagItem, listIndex) in similarPushTags"
                :key="listIndex"
                class="tag-wrap"
              >
                <div class="tag-title">{{ tagItem.title }}</div>
                <!--@mouseover.native="mouseOver($event, tag)"-->
                <!--@mouseout.native="mouseOut($event)"-->
                <gs-tag
                  v-for="(tag, tagIndex) in tagItem.list"
                  :key="tagIndex"
                  :label-max-width="120"
                  :selectable="true"
                  class="push-tag"
                  @select-change="similarSearch(formatTag(tag), tagItem.type)"
                >{{ formatTag(tag) }}</gs-tag>
              </li>
            </ul>
            <div
              v-else
              class="no-push-table"
            >请输入精确查找条件</div>
            <!--<div-->
            <!--v-if="nodesList.length > 0"-->
            <!--class="push-graph-module"-->
            <!--&gt;-->
            <!--<div class="tag-title">相关概念词发现</div>-->
            <!--<div-->
            <!--id="push_graph_container"-->
            <!--class="chart-module"-->
            <!--style="height: 156px;"-->
            <!--/>-->
            <!--</div>-->
          </div>
        </span>
      </fix-right-auto-left>
    </div>

    <!-- 展示文件详情 -->
    <gs-modal
      v-model="fileModal.visible"
      :show-cancel="fileModal.showCancel"
      :show-confirm="fileModal.showConfirm"
      class="file-content-modal"
      width="800px"
      title="文件详情"
    >
      <h3 class="file-title text-center margin-bottom16">{{ file.title }}</h3>
      <div class="file-content-container">
        <fix-left-auto-right :width="80">
          <span slot="left">标题：</span>
          <span slot="right" ref="dialogTitle"></span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">详情：</span>
          <span slot="right">{{ file.fileAbstract }}</span>
        </fix-left-auto-right>
      </div>
      <gs-button
        type="text"
        class="open-pdf float-right"
        @click="previewFile(file)"
      >查看PDF</gs-button>
    </gs-modal>

    <!--内容弹窗-->
    <div
      v-show="popData !== ''"
      ref="pushTagCover"
      :style="position"
      class="push-tag-cover"
      style="position: fixed; top: 0; left: 0;"
    >
      <span class="triangle" />
      <p v-html="popData" />
    </div>

    <gs-modal
      v-model="previewVisibel"
      :width="'80%'"
      :show-footer="false"
      :title="previewTitle"
      class="files-manage-preview-modal"
      @close="visible=false"
    >
      <gs-textarea
        v-model="previewContent"
        :autosize="true"
        :max-height="400"
        disabled
      />
    </gs-modal>
  </div>
</template>

<script type="es6">

import QueryService from '@/service/queryService'
import FixRightAutoLeft from '@/components/public/fixRightAutoLeft'
import FixLeftAutoRight from '@/components/public/fixLeftAutoRight'
import DashboardList from './dashboardList'
import KnowledgeCard from './knowledgeCard.vue'
import KnowledgeCardTable from './knowledgeCardTable.vue'
import GraphOption from '@/utils/paint/graphOption'
import { dd } from "@/utils/setting"

export default {
  components: {
    FixRightAutoLeft,
    DashboardList,
    FixLeftAutoRight,
    KnowledgeCard,
    KnowledgeCardTable
  },
  props: {
    queryForm: {
      type: [Object, Array],
      required: true
    },
    similarPushObj: {
      type: Object,
      required: true
    },
    pageAuth: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      pushWidth: 0,
      popData: '',
      param: {
        sentence: ''
      },
      dataList: [],
      total: 0,
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      pageSizes: [10, 20, 25, 50],
      loading: false,
      file: {},
      fileModal: {
        visible: false,
        showCancel: false,
        showConfirm: false
      },
      similarPushTags: [],
      nodesList: [],
      position: {
        left: 0,
        top: 0
      },
      queryOrderVal: 1,
      queryOrder: dd.queryOrder,
      listShowMode: 1,
      previewVisibel: false,
      previewTitle: '',
      previewContent: ''
    }
  },
  watch: {
    queryForm: function () {
      var me = this
      me.pageIndex = 1
      me.initSearch()
    }
  },
  mounted () {
    var me = this

    me.initSearch()
  },
  methods: {
    // 检索数据
    initSearch () {
      var me = this

      // me.dataList = []
      // me.total = 0

      me.loading = true

      var response = null
      var filter = me.queryForm.filter

      var param = {
        pageSize: me.pageSize,
        pageNo: me.pageIndex
      }

      // 复杂查询
      if (!me.queryForm.queryMode) {
        me.pushWidth = 0
        param.searchWord = filter || ''
        response = QueryService.advancedQuery(param)
      } else { // 简单查询
        if (filter && filter.length > 0) {
          param.field = filter[0].typeData
          param.searchWord = filter[0].queryText
        } else {
          param.field = '_all'
          param.searchWord = ''
        }

        response = QueryService.simpleQueryKg(param)
        if (me.queryForm.groupForm) {
          param.filter_content = me.queryForm.groupForm
          response = QueryService.queryInSearchResult(param)
        }

        me.$set(me.param, 'sentence', param.searchWord)

        setTimeout(() => {
          me.$refs.dashboardList.initModule()
        }, 0)
      }
      response.then((res) => {
        if (res.search_rst) {
          var dataList = res.search_rst.map(function (item) {
            var data = item
            data.author = data.author.join('、')
            data.source = data.source.join('、')
            return data
          })

          me.dataList = dataList || []

          me.total = res.total
        } else if (res.data) {
          let pageResult = res.data.pageData
          let dataList = pageResult.records
          this.dataList = dataList || []
          this.total = pageResult.total
        } else {
          me.$Message.warning(res.message || '获取列表数据失败')
        }
        if (res.recommendResult) {
          this.searchSimilar(res)  // 获取相似列表
        }
        me.loading = false
      }, function (error) {
        // console.log('query list error', error)
        me.$Message.warning(error.errorMessage || 'err.message')
        me.loading = false
      })
    },
    handlesimpleQueryData (res) {
      var dataList = res.data.pageData.records.map(function (item) {
        var data = item
        data.author = data.author.join('、')
        data.source = data.source.join('、')
        return data
      })

      this.dataList = dataList || []

      this.total = res.total
    }, // 处理搜索请求中，简单请求的结果数据

    // 相似tag数据

    searchSimilar (res) {
      let data = res.data.recommendResult
      data.show.forEach((item, index) => {
        let similarTagObj = this.getSimilarTagObj(data.map[item], data[item], item)
        this.similarPushTags.push(similarTagObj)
      })
      // 当搜索条件不存在时清空数据
      if (this.param.sentence.length !== 0) {
        this.pushWidth = 378
      }
    },

    // tag块对象
    getSimilarTagObj (title, list, type) {
      return {
        title,
        type,
        list: this.getSubArray(list)
      }
    },

    // 获取前五条tag数据
    getSubArray (list) {
      // this.removeEmptyItemFromArray(list)
      if (list.length <= 5) {
        return list
      } else {
        return list.slice(0, 5)
      }
    },

    // 去除数组中空字段
    removeEmptyItemFromArray (list) {
      let indexOfEmpty = list.findIndex((item, index) => {
        let keys = Object.getKeys(item)
        return keys[0] === ''
      })
      if (indexOfEmpty !== -1) {
        list.splice(indexOfEmpty, 1)
        this.removeEmptyItemFromArray(list)
      } else {
        return list
      }
    },

    // 相似检索
    similarSearch (searchVal, searchType) {
      let me = this
      me.similarPushObj.searchTag = `"${searchVal}"`
      me.similarPushObj.searchType = searchType
    },

    // tag显示文本设置
    formatTag (tag) {
      if (typeof tag === 'string') {
        return tag
      } else {
        return Object.keys(tag)[0]
      }
    },

    // tag 鼠标hover的显示
    formatTooltip (tag) {
      if (typeof tag === 'string') {
        return ''
      } else {
        var value = tag[Object.keys(tag)[0]]

        if (typeof value === 'string' || typeof value === 'number') {
          return value
        } else {
          return value.join('<br/>')
        }
      }
    },

    // 获取相似推荐区域的graph图数据 已去掉 不显示了
    initGraph (pushParam) {
      if (!this.pageAuth.result_query) {
        return false
      }
      var me = this

      me.nodesList = []

      QueryService.getQAGraph(pushParam).then(
        res => {
          var data = res.data || {}
          // var nodes = data.nodes || []
          // var edges = data.edges || []
          var nodes = data.node || []
          var edges = data.edge || []

          me.nodesList = nodes

          if (nodes.length > 0) {
            setTimeout(function () {
              me.initNodeGraph(nodes, edges)
            }, 10)
          }
        },
        err => {
          // console.log(err)
          me.$Message.warning(err.errorMessage || 'err.message')
        }
      )
    },

    // 转换graph图数据
    initNodeGraph (nodes, edges) {
      var me = this

      var option = GraphOption.option
      var graphModule = document.getElementById('push_graph_container')

      option.series[0].data = nodes.map(function (item) {
        return {
          name: item.id,
          info: item,
          labelName: item.label,
          realValue: item.value || item.label,
          value: item.value || item.label,
          // value: (item.label || '') + '：' + (item.value || ''),
          symbolSize: 16,
          itemStyle: {
            color: '#65B37B'
          },
          label: {
            show: false,
            formatter: function (params) {
              return params.data.value
            }
          }
        }
      })

      option.series[0].links = edges.map(function (item) {
        return {
          source: item.source.toString(),
          target: item.target.toString(),
          value: item.value
        }
      })

      me.dataGraphChart = echarts.init(graphModule)

      me.dataGraphChart.setOption(option)
    },

    beforeJump (page, pagination = 'pagination') {
      var me = this
      if (isNaN(page) || page < 1 || page > me.$refs[pagination].totalPage) {
        me.$Message.error('请输入正确页数')
        return false
      }
    },

    pageChange (currentPage) {
      var me = this

      me.pageIndex = currentPage > 1 ? currentPage : 1

      me.initSearch()
    },

    pageSizeChange (pageSize) {
      var me = this

      me.pageIndex = 1
      me.pageSize = pageSize

      me.initSearch()
    },

    // 下载表格数据
    downloadFile (file) {
      QueryService.downloadFile(file.fileId)
    },

    // 点赞 评分
    thumbsUp (item, isUp) {
      if (Number(item.isUp) === 0) {
        item.isUp = isUp

        if (isUp === 1) {
          item.thumbsUp += 1
        } else {
          item.thumbsDown += 1
        }
      } else if (Number(item.isUp) === 1 && isUp === 1) {
        item.isUp = 0
        item.thumbsUp -= 1
      } else if (Number(item.isUp) === 1 && isUp === 2) {
        item.isUp = 2
        item.thumbsUp -= 1
        item.thumbsDown += 1
      } else if (Number(item.isUp) === 2 && isUp === 1) {
        item.isUp = 1
        item.thumbsUp += 1
        item.thumbsDown -= 1
      } else if (Number(item.isUp) === 2 && isUp === 2) {
        item.isUp = 0
        item.thumbsDown -= 1
      }
    },

    // 查看pdf
    previewFile (row) {
      let me = this

      if (row.fileId) {
        this.previewTitle = row.file_name
        QueryService.previewFile(row.fileId)
          .then(res => {
            this.previewVisibel = true
            this.previewContent = res.data
          })
      } else {
        me.$Message.warning('无法获取文件信息')
      }
    },

    // 查看摘要 弹窗
    showContent (item) {
      var me = this

      me.file = item
      // 为了解决返回值的font标签，需要使用innerHTML，为了解决颜色问题，需要替换里面的color字符
      this.$refs['dialogTitle'].innerHTML = item.fileName.replaceAll('color=','')

      me.fileModal.visible = true
    },

    // 显示列表还是摘要的切换
    changeShowMode (val) {
      if (this.listShowMode !== val) {
        this.listShowMode = val
      }
    },

    // 右侧推送标签 鼠标hover事件 不要了
    mouseOver (e, tag) {
      let me = this
      this.popData = this.formatTooltip(tag)
      setTimeout(() => {
        var height = me.$refs.pushTagCover.offsetHeight
        var width = me.$refs.pushTagCover.offsetWidth / 2
        me.position.left = (e.clientX - width) + 'px'
        me.position.top = (e.clientY - height - 20) + 'px'
      }, 10)
    },

    mouseOut (e) {
      this.popData = ''
      this.position.left = '0px'
      this.position.top = '0px'
    }
  }
}
</script>