<template>
  <div class="query-list-container">
    <div class="main-content-container list-container">

      <div class="main-content-container content-list-container">


        <!-- 列表 -->
        <gs-table
          v-loading="loading"
          v-if="listShowMode == 1"
          :data="dataList"
          style="width: 100%"
          class="query-table-container"
        >
          <gs-table-column
            prop="title"
            label="题名"
            min-width="220"
          >
            <template slot-scope="scope">
              <span
                class="pointer primary-text"
                @click="showContent(scope.row)"
              >{{ scope.row.title }}</span>
            </template>
          </gs-table-column>
          <gs-table-column
            prop="authors"
            label="作者"
          />
          <gs-table-column
            prop="researchers"
            label="知识来源"
          />
          <gs-table-column
            prop="published_date"
            label="发表日期"
            width="120"
          />
          <gs-table-column
            prop="score"
            label="评分"
            width="100"
            class-name="text-right"
          />
          <gs-table-column
            prop="view_time"
            label="阅读量"
            width="100"
            class-name="text-right"
          >
            <template slot-scope="scope">
              {{ scope.row.view_time }}
              <router-link
                :to="{path: '/show-pdf'}"
                target="_blank"
              >
                <i class="gs-icon-file-o pointer primary-text" />
              </router-link>
            </template>
          </gs-table-column>
          <gs-table-column
            prop="download_time"
            label="下载量"
            width="100"
            class-name="text-right"
          >
            <template slot-scope="scope">
              {{ scope.row.download_time }}
              <i
                class="gs-icon-download pointer"
                @click="downloadFile(scope.row)"
              />
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
            >{{ item.title }}</h2>

            <div class="sub-title">
              <span class="authors">{{ item.authors }}</span>
              <span class="source">{{ item.source.join('; ') }}</span>
              <span class="publish-date">{{ item.year }}</span>
            </div>

            <div
              v-if="item.key_words"
              class="sub-title"
            >
              <span class="key-words">关键词：{{ item.key_words }}</span>
            </div>

            <p class="abstract">{{ item.abstract }}</p>

            <div class="text-right margin-top12">
              <span
                class="margin-right6 pointer"
                @click="thumbsUp(item, 1)"
              >
                <i
                  :class="{'fa-thumbs-up': item.isUp == 1}"
                  class="fa fa-thumbs-o-up"
                  style="width: 14px;height: 13px;"
                />{{ item.thumbsUp }}
              </span>
              <span
                class="margin-right6 pointer"
                @click="thumbsUp(item, 2)"
              >
                <i
                  :class="{'fa-thumbs-down': item.isUp == 2}"
                  class="fa fa-thumbs-o-down"
                  style="width: 14px;height: 13px;"
                />{{ item.thumbsDown }}
              </span>
              <span>发表日期 {{ item.published_date }}</span>&emsp;
              <span>评分 {{ item.score }}</span>&emsp;
              <span
                class="pointer primary-text"
                @click="showFile(item)"
              >
                <router-link
                  :to="{path: '/show-pdf'}"
                  target="_blank"
                >阅读量 {{ item.view_time }} <i class="gs-icon-file-o" />
                </router-link>
              </span>
              <span
                class="pointer primary-text"
                @click="downloadFile(item)"
              >下载量 {{ item.download_time }}<i class="gs-icon-download pointer" />
              </span>
            </div>

          </div>

          <!-- no data -->
          <h1
            v-if="!loading && total === 0"
            class="no-data-text text-center"
          >暂无数据</h1>
        </div>

        <!-- 图表 -->
        <div v-if="listShowMode == 3">
          <dashboard-list
            ref="dashboardList"
            :param="param"
          />
        </div>

        <div
          v-if="listShowMode != 3"
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
          <span slot="left">作者：</span>
          <span slot="right">{{ file.author ? file.author.join('; ') : '' }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">单位：</span>
          <span slot="right">{{ file.author_affiliations ? file.author_affiliations.join('; ') : '' }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">知识来源：</span>
          <span slot="right">{{ file.researchers }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">关键词：</span>
          <span slot="right">{{ file.key_words }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">主题：</span>
          <span slot="right">{{ file.category ? file.category.join('; ') : '' }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">标签：</span>
          <span slot="right">{{ file.label ? file.label.join('; ') : '' }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">发表日期：</span>
          <span slot="right">{{ file.published_date }}</span>
        </fix-left-auto-right>

        <fix-left-auto-right :width="80">
          <span slot="left">摘要：</span>
          <span slot="right">{{ file.abstract }}</span>
        </fix-left-auto-right>


      </div>
    </gs-modal>
  </div>
</template>

<script type="es6">
  import QueryService from '@/service/queryService'
  import FormatParamService from '../services/formatParamService'

  import FixLeftAutoRight from '@/components/public/fixLeftAutoRight'
  import DashboardList from './dashboardList'

  export default {
    components: {DashboardList, FixLeftAutoRight},
    props: {
      listShowMode: {
        type: [String, Number],
        required: true
      },
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
        dataList: [],
        total: 0,
        tableData: [],
        pageSize: 10,
        pageIndex: 0,
        pageSizes: [10, 20, 25, 50],
        loading: false,
        file: {},
        fileModal: {
          visible: false,
          showCancel: false,
          showConfirm: false
        }
      }
    },
    watch: {
      listShowMode: function (newVal) {
        var me = this

        if (Number(newVal) === 2) {
          me.rightWidth = 320
        } else {
          me.rightWidth = 0
        }
      },
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

        if (Number(me.listShowMode) === 3) {
          me.$refs.dashboardList.initModule()
        }

        QueryService.query(param).then(
          (res) => {
            var dataList = res.data.data.map((item) => {
              var data = item

              data.authors = data.author.join('; ')
              data.key_words = data.key_words.join('; ')
              data.researchers = data.researcher.join('; ')
              data.view_time = data.view_time || parseInt(Math.random() * 500)
              data.download_time = data.download_time || parseInt(Math.random() * 100)
              data.score = data.score || (Number(data.view_time) + Number(data.download_time))
              data.thumbsUp = parseInt(Math.random() * 500)
              data.thumbsDown = parseInt(Math.random() * 100)
              data.isUp = 0 // 是否点赞 0：没有操作，1：赞，2：贬

              return data
            })

            me.dataList = dataList || []

            me.total = res.data.total

            me.loading = false
          },
          (error) => {
            // console.log('query list error', error)
            me.$Message.warning(error.errorMessage || 'err.message')
            me.loading = false
          }
        )
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
        QueryService.downloadFile('111')
      },

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

      showContent (item) {
        var me = this

        me.file = item

        me.fileModal.visible = true
      }
    }
  }
</script>
