<template>
  <div class="home-query-container hidden-height">
    <div class="home-dynamic-analyse-container files-manage content-layout-container scroll-container customer">
      <noViewAuth v-if="!pageAuth.view" />
      <div v-loading="isLoading" v-else class="files-manage-container">
        <div class="dynamic-table-preview dynamic-analyse-content">
          <div class="dynamic-table-section">
            <div class="search-box" style="margin-bottom: 15px;">
              <gs-search
                v-model="keywords"
                placeholder="请输入搜索内容"
                @search="filterBySearchKey"
                @clear="filterBySearchKey"
              />
            </div>
            <div class="section-body">
              <gs-scrollbar :wrap-style="{ height: '100%' }">
                <public-table
                  :table-data="tableData"
                  :table-items="tableItems"
                  :table-deal="tableDeal"
                  :pagination="pagination"
                />
              </gs-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <preview-modal
        ref="preview"
        :is-visible="modalVis.preview"
        :file-details="fileDetails"
        :allow-edit="pageAuth.edit"
        @updateFileContent="updateFileContent"
        @close="closeModal"
      />
      <edit-modal
        ref="edit"
        :edit-file-vis="modalVis.edit"
        :edit-data="editData"
        @close="closeModal"
        @editFileConfirm="updateFileProperty"
      />
    </div>
  </div>
</template>
<script>
import PublicTable from '../../components/public/multistageTable.vue'
import EditModal from './filesModal/editFileModal.vue'
import PreviewModal from './filesModal/previewModal.vue'
import noViewAuth from '../../components/public/noViewAuth.vue'

import { mapGetters } from 'vuex'
import { getPageAuth } from '../../utils/comUtils'
import FilesProcessService from '../../service/filesProcessService'

export default {
  components: {
    PublicTable, // 表格组件
    EditModal,   // 编辑文件属性他那床
    PreviewModal, // 查看详情弹窗
    noViewAuth // 无权限时显示的页面
  },
  data () {
    return {
      label: '文档管理',
      isLoading: false,
      modalVis: {
        edit: false,
        preview: false
      },
      tableItems: [
        {
          label: '标题',
          prop: 'fileName'
        },
        {
          label: '来源',
          prop: 'source'
        },
        {
          label: '作者',
          prop: 'author'
        },
        {
          label: '关键词',
          prop: 'docKeywords'
        },
        {
          label: '发表时间',
          prop: 'publishTime'
        },
        {
          label: '分类',
          prop: 'fileCategory'
        },
        {
          label: '所在路径',
          prop: 'fileLogicPath'
        }
      ],
      keywords: '',
      tableData: [],
      tableDeal: {
        isShow: true,
        isMultiManage: false,
        methods: [
          {
            name: '查看',
            code: 'view',
            disabledInfo: {
              status: false,
              title: '没有查看权限'
            },
            callback: (row) => {
              this.fileDetails.fileId = row.fileId
              this.fileDetails.title = row.fileName
              this.getFileContent(row.fileId)
            }
          },
          {
            name: '修改',
            code: 'edit',
            disabledInfo: {
              status: false,
              title: '没有修改权限'
            },
            callback: (row) => {
              this.editData = { ...row }
              this.modalVis.edit = true
            }
          }
        ]
      },
      pagination: {
        currentSize: 10,
        currentPage: 1,
        sizeArray: [5, 10, 15],
        total: 0
      },
      pageAuth: {
        edit: false,
        view: false
      },
      editData: {},
      fileDetails: {
        fileId: '',
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters(['resourceGroup'])
  },
  watch: {
    pagination: {
      handler () {
        this.getListData()
      },
      deep: true
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.initAuth()
      this.getListData()
    }, // 页面初始化
    initAuth () {
      let auth = getPageAuth(this.resourceGroup, this.$route.path)
      this.pageAuth = { ...this.pageAuth, ...auth }
      this.tableDeal.methods.map((item) => {
        if (item.code) {
          item.disabledInfo.status = !this.pageAuth[item.code]
        }
        return item
      })
    }, // 权限初始化
    getListData () {
      this.isLoading = true
      let params = {
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.currentSize,
        keyWord: this.keywords
      }
      FilesProcessService.getFilesList(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.records
          this.pagination.total = res.data.total
        } else {
          this.$Message.error(res.msg)
        }
        this.isLoading = false
      })
    }, // 获取页面列表数据
    getFileContent (id) {
      let params = {
        fileId: id
      }
      FilesProcessService.getFileContent(params).then(res => {
        if (res.code === 0) {
          this.fileDetails.content = res.data
          this.modalVis.preview = true
        } else {
          this.$Message.error(res.msg)
        }
      })
    }, // 获取单个文档内容
    updateFileContent (id, content) {
      let params = {
        fileId: id,
        content: content
      }
      FilesProcessService.updateFileContent(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('编辑成功')
          this.modalVis.preview = false
        } else {
          this.$Message.error(res.msg)
        }
        this.$refs.preview.isLoading = false
      }).catch(() => {
        this.$refs.preview.isLoading = false
      })
    }, // 保存编辑文档内容
    updateFileProperty (params) {
      FilesProcessService.updateFileProperty(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功')
          this.$refs.edit.isLoading = false
          this.modalVis.edit = false
          this.getListData() // 列表更新
        } else {
          this.$Message.error(res.msg)
          this.$refs.edit.isLoading = false
        }
      }).catch(() => {
        this.$refs.edit.isLoading = false
      })
    }, // 保存文档编辑内容函数
    closeModal (type) {
      this.modalVis[type] = false // 关闭弹窗
    },
    // 每次值变化之后需要默认置为第一页查询
    filterBySearchKey () {
      this.pagination.currentPage = 1
      this.getListData()
    }
  }
}
</script>
