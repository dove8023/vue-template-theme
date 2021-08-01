<template>
  <div class="query-form-container">
    <!--查询输入框 检索条件-->
    <div class="query-form-main-container">
      <!--<div class="main-content-container">-->

      <fix-right-auto-left :width="140">
        <!-- 简单和复合选择模式 -->
        <span slot="left">
          <div class="query-mode-form-container">
            <simple-query-mode
              v-if="queryMode"
              :search-random="searchRandom"
              :query-tag-list-obj="queryTagListObj"
              :similar-push-obj="similarPushObj"
              @search="simpleSearch"
            />
            <complex-query-mode v-else @search="complexSearch" />
          </div>
        </span>

        <!-- 检索模式 -->
        <!-- <span slot="right">
          <div class="query-mode-switch text-right">
            <span class="mode-label">检索模式</span>
            <gs-switch
              v-model="queryMode"
              :width="switchWidth"
              @change="modeChange"
            >
              <span slot="on" class="mode-toggle">简单</span>
              <span slot="off" class="mode-toggle">高级</span>
            </gs-switch>
          </div>
        </span>-->
      </fix-right-auto-left>

      <!-- 展示简单检索的条件 -->

      <div v-show="queryTagListObj.queryTagList.length > 0" class="query-form-list text-left">
        <fix-left-auto-right :width="72">
          <span slot="left">检索条件：</span>
          <span slot="right">
            <gs-tag
              v-for="(tag, i) in queryTagListObj.queryTagList"
              :key="tag.uid"
              label-max-width="120"
              closable
              class="query-tag"
              @close="closeTag(i)"
            >{{ tag.name }}</gs-tag>

            <span
              v-if="queryTagListObj.queryTagList.length > 0"
              class="pointer primary-text"
              @click="cleanTag"
            >清除所有</span>

            <span class="primary-text pointer margin-left8 subscibe-sp" @click="toSubscribe">订阅</span>
          </span>
        </fix-left-auto-right>
      </div>
      <!--</div>-->
    </div>

    <!--分组下拉-->
    <!-- 结果中查询资源控制 -->
    <div v-if="pageAuth.result_query" class="query-group-form-container">
      <span class="group-label">结果中搜索：</span>
      <span class="keyword-label">关键词</span>
      <gs-select
        v-model="groupForm.keyword"
        :searchable="true"
        :clearable="true"
        :searchable-method="searchKeyword"
        class="keyword-select"
        popper-class="keyword-select-popper"
        placeholder="请选择关键词"
        @change="setGroupKeyword"
        @clear="setGroupKeyword(0)"
        @visible-change="getAllKeywordList"
      >
        <gs-option
          v-for="(item, index) in keywordGroupList"
          :key="index"
          :label="item"
          :value="item"
        />
      </gs-select>
      <span class="category-label">分类</span>
      <gs-select
        v-model="groupForm.category"
        :searchable="true"
        :clearable="true"
        :searchable-method="searchCategory"
        class="category-select"
        popper-class="category-select-popper"
        placeholder="请选择分类"
        @change="setGroupCategory"
        @clear="setGroupCategory(0)"
        @visible-change="getAllCategoryList"
      >
        <gs-option
          v-for="(item, index) in categoryGroupList"
          :key="index"
          :label="item"
          :value="item"
        />
      </gs-select>
      <span class="label-label">标签</span>
      <gs-select
        v-model="groupForm.label"
        :searchable="true"
        :clearable="true"
        :searchable-method="searchLabel"
        class="publish-year-select"
        popper-class="label-select-popper"
        placeholder="请选择标签"
        @change="setGroupLabel"
        @clear="setGroupLabel(0)"
        @visible-change="getAllLabelList"
      >
        <gs-option
          v-for="(item, index) in labelGroupList"
          :key="index"
          :label="item"
          :value="item"
        />
      </gs-select>
      <span class="source-label">知识来源</span>
      <gs-select
        v-model="groupForm.source"
        :searchable="true"
        :clearable="true"
        :searchable-method="searchSource"
        class="source-select"
        popper-class="source-select-popper"
        placeholder="请选择知识来源"
        @change="setGroupSource"
        @clear="setGroupSource(0)"
        @visible-change="getAllSourceList"
      >
        <gs-option
          v-for="(item, index) in sourceGroupList"
          :key="index"
          :label="item"
          :value="item"
        />
      </gs-select>
      <i class="icon-gongtufenxi" @click="openStatisticGraph" />
    </div>

    <!--可视化图表-->
    <visual-graph-pop :prop-config="visualGraphConfig" />
  </div>
</template>

<script type="es6">
import SimpleQueryMode from './simpleQueryMode'
import ComplexQueryMode from './complexQueryMode'
import FixRightAutoLeft from '@/components/public/fixRightAutoLeft'
import FixLeftAutoRight from '@/components/public/fixLeftAutoRight'
import VisualGraphPop from './visualGraphPop.vue'
import QueryService from '@/service/queryService'
//  import FormatParamService from '../services/formatParamService'

import { dd } from "@/utils/setting"

export default {
  components: {
    SimpleQueryMode,
    ComplexQueryMode,
    FixRightAutoLeft,
    FixLeftAutoRight,
    VisualGraphPop
  },
  props: {
    similarPushObj: {
      type: Object,
      required: true
    },
    queryForm: {
      type: [Object, Array],
      required: true
    },
    pageAuth: {
      type: Object
    }
  },
  data () {
    return {
      visualGraphConfig: {
        visible: false
      },
      queryMode: true,
      switchWidth: 60,
      queryOrderVal: 1,
      queryOrder: dd.queryOrder,
      groupLabelWidth: 56,
      groupForm: {
        keyword: '',
        category: '',
        label: '',
        source: ''
      },
      groupTimer: null,
      groupTimerInterval: 300,
      queryTagListObj: {
        queryTagList: []
      },
      searchRandom: 0,
      keywordGroupList: [],
      categoryGroupList: [],
      labelGroupList: [],
      sourceGroupList: [],
      keywordGroupBack: [],
      categoryGroupBack: [],
      labelGroupBack: [],
      sourceGroupBack: [],
      allKeywordLoaded: false,
      allCategoryLoaded: false,
      allLabelLoaded: false,
      allSourceLoaded: false,
      filteredKeyword: [], // 关键字 下拉 过滤后的数组
      filterKeyword: '', // 关键字 下拉 过滤条件
      filteredCategory: [], // 关键字 下拉 过滤后的数组
      filterCategory: '', // 关键字 下拉 过滤条件
      filteredLabel: [], // 关键字 下拉 过滤后的数组
      filterLabel: '', // 关键字 下拉 过滤条件
      filteredSource: [], // 关键字 下拉 过滤后的数组
      filterSource: '', // 关键字 下拉 过滤条件
      splitLen: 100 // 魔术字符串 一次截取长度
    }
  },
  computed: {
    showGroup () {
      return this.queryMode &&
        (this.keywordGroupList.length ||
          this.categoryGroupList.length ||
          this.labelGroupList.length ||
          this.sourceGroupList.length)
    }
  },
  watch: {},
  mounted () {
    this.getGroupList()
  },
  methods: {
    getAllList (backData, listData) {
      let me = this
      let timer = null
      let len = me.splitLen // 即将截取的数组长度
      let curStartIndex = me.getLen(backData)
      // 如果开始位置小于等于 魔术字符串的长度，则不需要二次获取数据
      // 因为发送请求回来的时候，已经设置过了
      if (curStartIndex < me.splitLen) {
        return
      }
      timer = setInterval(() => {
        if (backData.length < curStartIndex + len) {
          len = backData.length - curStartIndex
          clearInterval(timer)
        }
        listData.splice(listData.length, 0, ...(backData.slice(curStartIndex, curStartIndex + len)))
        curStartIndex += len
      }, 10)
    },
    searchKeyword (val) {
      let me = this
      me.filterKeyword = val
      me.searchFunc(val, 1, me.keywordGroupBack, me.keywordGroupList)
    },
    searchCategory (val) {
      let me = this
      me.filterCategory = val
      me.searchFunc(val, 2, me.categoryGroupBack, me.categoryGroupList)
    },
    searchLabel (val) {
      let me = this
      me.filterLabel = val
      me.searchFunc(val, 3, me.labelGroupBack, me.labelGroupList)
    },
    searchSource (val) {
      let me = this
      me.filterSource = val
      me.searchFunc(val, 4, me.sourceGroupBack, me.sourceGroupList)
    },
    searchFunc (val, type, backData, listData) {
      let me = this
      let filteredKeyword = backData.filter((item) => {
        return item.indexOf(val) !== -1
      })

      type === 1 ? me.filteredKeyword = filteredKeyword
        : type === 2 ? me.filteredCategory = filteredKeyword
          : type === 3 ? me.filteredLabel = filteredKeyword : me.filteredSource = filteredKeyword

      let tempArr = filteredKeyword
      if (filteredKeyword.length > me.splitLen) {
        tempArr = filteredKeyword.slice(0, me.splitLen)
      }
      listData.splice(0, listData.length, ...tempArr)
    },
    bindScrollEvent (selectClassStr, backData, filterVal, listData) {
      let me = this
      me.$nextTick(() => {
        let box = document.querySelector(`${selectClassStr} .gs-scrollbar-wrap`)
        // 监听这个dom的scroll事件
        box.addEventListener('scroll', () => {
          let tempBack = backData

          let tempVal = me.filterKeyword // 值必须随时获取
          let filteredData = me.filteredKeyword

          if (filterVal === 2) {
            tempVal = me.filterCategory
            filteredData = me.filteredCategory
          }
          if (filterVal === 3) {
            tempVal = me.filterLabel
            filteredData = me.filteredLabel
          }
          if (filterVal === 4) {
            tempVal = me.filterSource
            filteredData = me.filteredSource
          }

          if (tempVal) {
            tempBack = filteredData
          }

          if (tempBack.length > listData.length) {
            let len = me.splitLen

            let totalLen = tempBack.length
            let startIndex = listData.length

            if (totalLen < startIndex + len) {
              len = totalLen - startIndex
            }
            if (len > 0) {
              listData.splice(startIndex, 0, ...(tempBack.slice(startIndex, startIndex + len)))
            }
          }
        })
      })
    },
    getAllKeywordList (visible) {
      let me = this
      if (visible && !me.allKeywordLoaded) {
        me.allKeywordLoaded = true
        me.bindScrollEvent('.keyword-select-popper',
          me.keywordGroupBack, 1, me.keywordGroupList)
        // me.getAllList(me.keywordGroupBack, me.keywordGroupList)
      }
    },
    getAllCategoryList (visible) {
      let me = this
      if (visible && !me.allCategoryLoaded) {
        me.allCategoryLoaded = true
        me.bindScrollEvent('.category-select-popper',
          me.categoryGroupBack, 2, me.categoryGroupList)
        // me.getAllList(me.categoryGroupBack, me.categoryGroupList)
      }
    },
    getAllLabelList (visible) {
      let me = this
      if (visible && !me.allLabelLoaded) {
        me.allLabelLoaded = true
        me.bindScrollEvent('.label-select-popper',
          me.labelGroupBack, 3, me.labelGroupList)
        // me.getAllList(me.labelGroupBack, me.labelGroupList)
      }
    },
    getAllSourceList (visible) {
      let me = this
      if (visible && !me.allSourceLoaded) {
        me.allSourceLoaded = true
        me.bindScrollEvent('.source-select-popper',
          me.sourceGroupBack, 4, me.sourceGroupList)
        // me.getAllList(me.sourceGroupBack, me.sourceGroupList)
      }
    },
    // 简单复杂查询切换
    modeChange () {
      var me = this

      var queryForm = {
        filter: me.queryMode ? [] : '',
        queryMode: me.queryMode
      }
      me.$emit('update:queryForm', queryForm)
    },
    // 简单查询
    simpleSearch (tagList) {
      var me = this

      var queryForm = {
        filter: tagList,
        queryMode: me.queryMode
      }

      me.initGroupForm(tagList)

      let saveSearchData = {
        field: tagList[0].typeData,
        content: tagList[0].queryText
      }

      sessionStorage.setItem('knowledgeSearchData', JSON.stringify(saveSearchData))

      me.$emit('update:queryForm', queryForm)
    },
    // 分组条件变更
    queryGroupChange () {
      var me = this

      let groupArr = []
      if (me.groupForm.keyword) {
        groupArr.push(`key_words:${me.groupForm.keyword}`)
      }
      if (me.groupForm.category) {
        groupArr.push(`category:${me.groupForm.category}`)
      }
      if (me.groupForm.label) {
        groupArr.push(`label:${me.groupForm.label}`)
      }
      if (me.groupForm.source) {
        groupArr.push(`source:${me.groupForm.source}`)
      }
      var queryForm = {
        filter: me.queryForm.filter || [],
        queryMode: me.queryMode,
        groupForm: groupArr.join(';')
      }

      clearTimeout(me.groupTimer)

      me.groupTimer = setTimeout(function () {
        me.$emit('update:queryForm', queryForm)
      }, me.groupTimerInterval)
    },
    // 删除某个查询条件
    closeTag (index) {
      var me = this

      me.queryTagListObj.queryTagList.splice(index, 1)

      me.searchRandom = Math.random()
    },
    // 清空查询条件
    cleanTag () {
      var me = this

      me.queryTagListObj.queryTagList = []

      me.searchRandom = Math.random()
    },
    // 复杂查询
    complexSearch (filter) {
      var me = this

      var queryForm = {
        filter: filter
      }

      // me.initGroupForm()

      me.$emit('update:queryForm', queryForm)
    },

    initGroupForm (tagList) {
      var me = this

      me.groupForm = {
        keyword: '',
        category: '',
        label: '',
        source: ''
      }

      if (tagList && tagList.length > 0) {
        me.getGroupList(tagList[0])
      } else { // 清空
        me.getGroupList()
      }
    },
    getGroupList (tagItem) {
      /* 有结果中查询的权限才调用python接口 */
      if (!this.pageAuth.result_query) {
        return false
      }
      let me = this
      let param = {
        field: (tagItem && tagItem.typeData) || '',
        content: (tagItem && tagItem.queryText) || ''
      }
      QueryService.getGroupInfo(param).then(
        res => {
          if (res && res.search_rst) {
            me.keywordGroupBack = res.search_rst.key_words
            me.categoryGroupBack = res.search_rst.category
            me.labelGroupBack = res.search_rst.label
            me.sourceGroupBack = res.search_rst.source

            me.keywordGroupList = me.keywordGroupBack.slice(0, me.getLen(me.keywordGroupBack))
            me.categoryGroupList = me.categoryGroupBack.slice(0, me.getLen(me.categoryGroupBack))
            me.labelGroupList = me.labelGroupBack.slice(0, me.getLen(me.labelGroupBack))
            me.sourceGroupList = me.sourceGroupBack.slice(0, me.getLen(me.sourceGroupBack))

            me.allKeywordLoaded = false
            me.allCategoryLoaded = false
            me.allLabelLoaded = false
            me.allSourceLoaded = false
          } else {
            me.$Message.error('获取分组数据出错')
          }
        },
        err => {
          me.$Message.error(err.errorMessage || '获取分组数据出错')
        }
      ).catch(res => {
        me.$Message.error(res.message || '获取分组数据出错')
      })
    },

    getLen (arr) { // 魔术字符串
      return arr.length > this.splitLen ? this.splitLen : arr.length
    },

    // 设置分组中下拉列表的label（最终显示的文本） 已废弃
    getGroupOptionLabel (item) {
      return (item.key || '其它') + `(${item.doc_count})`
    },
    // 清空或改变分组下拉选项 关键词
    setGroupKeyword (item) {
      var me = this

      if (Array.isArray(item)) {
        me.groupForm.keyword = ''
      } else {
        // item.type = 'keyword'
        me.groupForm.keyword = item
      }

      me.queryGroupChange()
    },
    // 清空或改变分组下拉选项 分类
    setGroupCategory (item) {
      var me = this

      if (Array.isArray(item)) {
        me.groupForm.category = ''
      } else {
        // item.type = 'category'
        me.groupForm.category = item
      }

      me.queryGroupChange()
    },
    // 清空或改变分组下拉选项 标签
    setGroupLabel (item) {
      var me = this

      if (Array.isArray(item)) {
        me.groupForm.label = ''
      } else {
        // item.type = 'label'
        me.groupForm.label = item
      }

      me.queryGroupChange()
    },
    // 清空或改变分组下拉选项 知识来源
    setGroupSource (item) {
      var me = this

      if (Array.isArray(item)) {
        me.groupForm.source = ''
      } else {
        // item.type = 'source'
        me.groupForm.source = item
      }

      me.queryGroupChange()
    },
    // 订阅 暂时无用
    toSubscribe () {
      //        var me = this
      //
      //        me.$router.push({
      //          path: '/subscribe'
      //        })
    },
    // 打开可视化统计图表
    openStatisticGraph () {
      this.visualGraphConfig.visible = true
    }
  }
}
</script>
<style>
.mode-label {
  font-size: 12px;
  color: #273d52;
}
.mode-toggle {
  font-size: 10px;
  padding: 2px 3px;
}
.query-group-form-container {
  background: transparent !important;
  padding: 0 !important;
  margin-top: 16px;
  position: relative;
}
.icon-gongtufenxi {
  position: absolute;
  top: -2px;
  right: 0;
}
</style>
