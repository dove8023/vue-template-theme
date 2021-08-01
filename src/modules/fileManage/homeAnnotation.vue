<template>
  <div
    class="home-extract-container home-query-container hidden-height scroll-container customer"
  >
    <!-- brat标注页面 -->
    <div v-if="isMarkPage" class="brat-page-wrap content-box-fullscreen">
      <div class="return-title">
        <gs-button
          icon="revoke"
          type="primary"
          class="return-btn"
          @click="bratBackWeb()"
        />
        <h2>知识标注</h2>
      </div>
      <iframe
        id="bratIframe"
        :src="
          `${bratSetting.src}${bratSetting.filePath}?${bratSetting.queryStr}`
        "
        frameborder="0"
      />
    </div>
    <!-- 原本的页面 -->
    <div v-else>
      <noViewAuth v-if="!pageAuth.view" />
      <div v-else>
        <gs-loading :is-show="pageLoading" />

        <!--列表页面 导航-->
        <div class="extract-wrap">
          <div class="file-choose">
            <div class="file-list">
              <gs-loading :is-show="contentLoading" />
              <gs-button
                type="primary"
                :disabled="!selections.length"
                style="margin-bottom: 16px;"
                @click="openPreMark"
              >
                批量预标注
              </gs-button>
              <gs-table
                ref="extractResTab"
                :data="fileList"
                :pagination="pagination"
                paging
                @size-change="sizeChange"
                @page-change="pageJump"
                @selection-change="selectionChange"
              >
                <gs-table-column type="selection" fixed width="28" />
                <gs-table-column
                  show-overflow-tooltip
                  prop="fileName"
                  label="文档名称"
                  data-align="right"
                  min-width="180"
                />
                <gs-table-column
                  prop="status"
                  label="预标注状态"
                  min-width="160"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.preMarkState === '0'"
                      class="status-cell"
                    >
                      <span>未使用预标注</span>
                    </div>
                    <div
                      v-else-if="scope.row.preMarkState === '1'"
                      class="status-cell"
                    >
                      <span class="in-progress">标注中</span>
                    </div>
                    <div
                      v-else-if="scope.row.preMarkState === '2'"
                      class="status-cell"
                    >
                      <span class="finished">已完成</span>
                    </div>
                    <div v-else class="status-cell">
                      <span class="failed">标注失败</span>
                      <gs-popover supernanant trigger="hover">
                        <a slot="reference">查看原因</a>
                        <span>{{ scope.row.preMarkResult }}</span>
                      </gs-popover>
                    </div>
                  </template>
                </gs-table-column>
                <gs-table-column
                  show-overflow-tooltip
                  prop="createTime"
                  label="文档导入时间"
                  data-align="right"
                  min-width="160"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime | formatTime }}</span>
                  </template>
                </gs-table-column>
                <gs-table-column
                  show-overflow-tooltip
                  prop="updateTime"
                  label="标注保存时间"
                  data-align="right"
                  min-width="160"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.updateTime | formatTime }}</span>
                  </template>
                </gs-table-column>
                <gs-table-column label="操作" width="128">
                  <template
                    v-if="!scope.row.progress && !scope.row.uploadFail"
                    slot-scope="scope"
                  >
                    <gs-button
                      :disabled="!pageAuth.mark"
                      type="text-primary"
                      @click="markDocument(scope.row)"
                    >
                      知识标注
                    </gs-button>
                    <gs-button
                      :disabled="!pageAuth.clear"
                      type="text-primary"
                      @click="docClear(scope.row)"
                    >
                      清空标注结果
                    </gs-button>
                  </template>
                </gs-table-column>
              </gs-table>

              <!-- <div class="btn-autoextract">
                <gs-pagination
                  :current="pagination.currentPage"
                  :page-size="pagination.currentSize"
                  :page-sizes="pagination.sizeArray"
                  :total="pagination.total"
                  style="margin-top:20px"
                  layout="pagesizes,pager"

                />
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <gs-modal
        v-model="preMarkVisible"
        title="预标注"
        class="pre-mark-modal"
        @confirm="submit"
        @cancel="closeModal"
      >
        <div>
          <gs-loading :is-show="preMarkLoading" />
          <div class="pre-mark-item">
            <span class="item-title">标注文档</span>
            <div v-if="selections.length === 1">
              {{ selections[0].fileName }}
            </div>
            <div v-else>
              共{{ selections.length }}个文档
            </div>
          </div>
          <div class="pre-mark-item">
            <span class="item-title">模型抽取</span>
            <gs-select v-model="preMarkModel" placeholder="请选择">
              <gs-option
                v-for="item in models"
                :key="item.extractModelId"
                :label="item.modelName"
                :value="item.id"
              />
            </gs-select>
          </div>
        </div>
      </gs-modal>
    </div>
  </div>
</template>

<script type="es6">
import BratService from '@/service/bratService'
import FilesProcessService from '@/service/filesProcessService'
import modelCenterService from '@/service/modelCenterService.ts'
import { encodeBratName } from '@/utils/comUtils.ts'
import noViewAuth from '../../components/public/noViewAuth'
import { mapGetters } from 'vuex'
import { getPageAuth } from '../../utils/comUtils'
import clone from 'clone'

export default {
    components: { noViewAuth },
    filters: {
        formatTime(val) {
            if (val) {
                return val.replace(/Z|T|([\.].*)/gi, ' ')
            }
        }
    },
    data() {
        return {
            label: '知识标注',
            fileId: -1, // 当前浏览的文章ID
            fileName: '',
            fileList: [],
            contentLoading: false,
            pageLoading: false,
            pagination: {
                total: 0,
                current: 1,
                pageSizes: [5, 10, 15],
                pageSize: 10
            },
            isMarkPage: false,
            bratSetting: {
                src: window.epApp.configs.urlPrefix.bratUrl + 'index.xhtml#/kipf/',
        // src: 'http://127.0.0.1:8001/index.xhtml#/kipf/',
                filePath: '0001',
                fileTitle: ''
            },
            javaAPI: window.epApp.API_URL_DOMAIN, // 后端java地址
            pythonAPI: window.epApp.configs.urlPrefix.queryApi, // python地址
            markApi: window.epApp.configs.urlPrefix.newExtractApi, // 预标注文档开关
            pageAuth: {
                view: true,
                mark: true,
                clear: true
            },
            selections: [],
            preMarkVisible: false,
            models: [],
            preMarkModel: '',
            preMarkLoading: false,
            timer: '',
            recordUserSelections: []
        }
    },
    computed: {
        ...mapGetters(['resourceGroup'])
    },
    mounted() {
        this.initPage()
        this.autoRequest()
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
    // 获取文件列表
        getFileList() {
            this.contentLoading = true
            let params = {
                pageNo: this.pagination.current,
                pageSize: this.pagination.pageSize
            } // 新参数

            FilesProcessService
        .getMarkList(params)
        .then(res => {
            this.pagination.total = res.data.total
            this.fileList = res.data.records
            this.fileList.map((item) => {
                item.status = '标注中'
                item.percent = 50
                item.reason = 'reason...'
                return item
            })
        })
        .finally(() => {
            this.contentLoading = false
        })
        }, // 加载用于标注的文档列表

        autoRequest() {
            let auth = getPageAuth(this.resourceGroup, this.$route.path)
            this.pageAuth = { ...this.pageAuth, ...auth }
            if (this.pageAuth.view) {
                this.timer = window.setInterval(() => {
                    this.recordUserSelections = []
                    this.selections.forEach((item) => {
                        this.recordUserSelections.push(item.fileId)
                    })
                    const params = {
                        pageNo: this.pagination.current,
                        pageSize: this.pagination.pageSize
                    }
                    FilesProcessService.getMarkList(params).then(res => {
                        this.pagination.total = res.data.total
                        this.fileList = res.data.records
                        this.fileList.map((item) => {
                            item.status = '标注中'
                            item.percent = 50
                            item.reason = 'reason...'
                            return item
                        })
                        setTimeout(() => {
                            if (this.recordUserSelections.length) {
                                this.fileList.forEach((item) => {
                                    if (this.recordUserSelections.includes(item.fileId)) {
                                        this.$refs.extractResTab.toggleRowSelection(item, true)
                                    }
                                })
                            }
                        }, 10)
                    })
                }, 8000)
            }
        },

    // 分页变化
        sizeChange(size) {
            this.pagination.current = 1
            this.pagination.pageSize = size
            this.getFileList()
        },

    // 页面跳转
        pageJump(page) {
            this.pagination.current = page
            this.getFileList()
        },

    // 操作失败提示
        httpErrorMsg(res) {
            this.$Message.error({
                duration: 3,
                content: res || '网络错误'
            })
        },

    // 操作成功提示
        httpSuccessMsg(res) {
            this.$Message.success({
                duration: 3,
                content: res || '操作成功'
            })
        },

        selectionChange(selections) {
            this.selections = clone(selections)
        },

        openPreMark() {
            modelCenterService.getAllExtractModelList().then((res) => {
                this.models = res.data
                this.preMarkVisible = true
            }).catch(() => {
                this.preMarkVisible = true
            })
        },

        submit() {
            this.preMarkLoading = true
            let params = {
                extractModelId: this.preMarkModel,
                fileIdList: ''
            }
            this.selections.forEach((item) => {
                params.fileIdList += `${item.fileId},`
            })
            params.fileIdList = params.fileIdList.substring(0, params.fileIdList.length - 1)
            modelCenterService.preMarkDoc(params).then((res) => {
                console.log(res)
                this.getFileList()
                this.$Message.success('操作成功')
            }).finally(() => {
                this.preMarkLoading = false
                this.closeModal()
            })
        },

        closeModal() {
            this.preMarkVisible = false
            this.preMarkModel = ''
        },

    /**
     *  打开brat标注系统, 统一目录/kipf/
     * @param row
     */
        markDocument(row) {
            this.pageLoading = true
            let param = {
                'id': '',
                'date': '1988-10-25',
                'data': {}
            }
            BratService.bodySetting(param).then((res) => {
                if (res.code === 0) {
                    this.$Message.success(res.message)
                }
                this.pageLoading = false
                this.isMarkPage = true
                let bratPath = res.data.bratpath
                let tenantInfo = res.data.tenantInfo // 租户相关信息
                let fileOnlyName = row.fileName // 文件名【不含后缀】
                let encodeName = encodeBratName(fileOnlyName) // 文件名中文编码
                let queryStr = `fileName=${encodeName}&java=${this.javaAPI}&python=${this.pythonAPI}&markApi=${this.markApi}&fileId=${row.fileId}&bratPath=${bratPath}&tenantInfo=${tenantInfo}`
                this.bratSetting.filePath = `${tenantInfo}/${row.fileId}`
                this.bratSetting.queryStr = queryStr
        /*  iframe:src = `${bratSetting.src}${bratSetting.filePath}?${bratSetting.queryStr}`  */
            }, (error) => {
                this.$Message.warning(error.errorMessage)
            })
        },
    /**
     * 当不是.txt后缀的文件不可点击标注
     * @param name
     */
        filterFileType(name) {
            return !(/.txt|.doc|.docx|.pdf|.ppt|.pptx$/.test(name))
        },
    /**
     *  清空标记结果
     * @param row
     */
        docClear(row) {
      // let fileOnlyName = row.fileName
            let param = {
                'date': '1988-10-25',
                'data': row.bratProcessingId
            }
            BratService.docClear(param).then((res) => {
                if (res.errorCode !== 200) {
                    this.$Message.warning(res.message)
                }
                this.$Message.success('清空成功')
            }, (error) => {
                this.$Message.warning(error.errorMessage)
            })
        },
    /**
     *  从brat系统返回列表时刷新数据
     * @param row
     */
        bratBackWeb() {
            this.isMarkPage = false
            this.getFileList()
        },
    /**
     * 初始化页面
     */
        initPage() {
            let auth = getPageAuth(this.resourceGroup, this.$route.path)
            this.pageAuth = { ...this.pageAuth, ...auth }
            if (this.pageAuth.view) {
                this.getFileList()
            }
        }
    }
}
</script>
