<template>
  <div
    class="visual-graph-pop-container"
  >
    <gs-modal
      v-model="propConfig.visible"
      :width="950"
      :show-footer="false"
      title="数据可视化"
      class="visual-graph-pop-modal"
      @cancel="close"
    >
      <gs-tabs
        v-model="activeName"
        type="content-tab"
      >
        <gs-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item"
          :name="item"
          style="width:900px;min-height:400px"
        >
          <pieDialog
            v-if="propConfig.visible && canShow && item==='关键字'"
            ref="map"
            :title="titlePieDialog.title"
            :legend="titlePieDialog.legend"
            :series="titlePieDialog.series"
          />
          <barDialog
            v-if="propConfig.visible && canShow && item==='类别'"
            ref="map"
            :title="companyBarDialog.title"
            :legend="companyBarDialog.legend"
            :x-axis-data="companyBarDialog.xAxisData"
            :y-axis="companyBarDialog.yAxis"
            :series="companyBarDialog.series"
          />
          <lineDialog
            v-if="propConfig.visible && canShow && item==='标签'"
            ref="map"
            :title="pushTimeLineDialog.title"
            :legend="pushTimeLineDialog.legend"
            :x-axis-data="pushTimeLineDialog.xAxisData"
            :y-axis="pushTimeLineDialog.yAxis"
            :series="pushTimeLineDialog.series"
          />
          <barDialog
            v-if="propConfig.visible && canShow && item==='来源'"
            ref="map"
            :title="from.title"
            :legend="from.legend"
            :x-axis-data="from.xAxisData"
            :y-axis="from.yAxis"
            :series="from.series"
          />
        </gs-tab-pane>
      </gs-tabs>
    </gs-modal>
  </div>
</template>

<script type="es6">
import pieDialog from '@/components/chart/pieMapDialog'
import lineDialog from '@/components/chart/lineMapDialog'
import barDialog from '@/components/chart/barMapDialog'

import Service from '@/service/queryService.ts'
export default {
  name: 'VisualGraphPop',
  components: {pieDialog, lineDialog, barDialog},
  props: {
    propConfig: {
      type: Object,
      required: true,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      activeName: '',
      canShow: false,
      tabs: [
        '关键字',
        '类别',
        '标签',
        '来源'
      ],
      titlePieDialog: {
        title: '',
        legend: [],
        xAxisData: [],
        series: [],
        yAxis: []
      },
      companyBarDialog: {
        title: '',
        legend: {},
        xAxisData: [],
        series: [],
        yAxis: []
      },
      pushTimeLineDialog: {
        title: '',
        legend: {

        },
        xAxisData: [],
        series: [],
        yAxis: []
      },
      from: {
        title: '',
        legend: {

        },
        xAxisData: [],
        series: [],
        yAxis: []
      }
    }
  },
  computed: {},
  watch: {
    activeName () {
      if (this.$refs.map) {
        this.$refs.map.forEach(e => {
          e.resize()
        })
      }
    },
    propConfig: {
      handler () {
        let _this = this
        if (this.propConfig.visible) {
          setTimeout(() => {
            _this.getFourMapData()
          }, 300)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.activeName = this.tabs[0]
    sessionStorage.setItem('knowledgeSearchData', JSON.stringify({content: '',
      field: '_all'}))
  },
  methods: {
    close () {
      this.propConfig.visible = false
    },
    getFourMapData () {
      let _this = this
      let storage = JSON.parse(sessionStorage.getItem('knowledgeSearchData'))
      let params = {
        field: storage.field,
        content: storage.content
      }
      Service.searchSimilarTable(params).then(res => {
        // console.log(res.data)
        let keywordList = res.data.key_words
        let category = res.data.category
        let label = res.data.label
        let source = res.data.source
        keywordList = keywordList.map(item => {
          return {
            name: Object.keys(item)[0],
            value: item[Object.keys(item)[0]]
          }
        })
        let categoryX = category.map(item => {
          return Object.keys(item)[0]
        })
        let categoryY = category.map(item => {
          return {
            name: Object.keys(item)[0],
            data: item[Object.keys(item)[0]]
          }
        })
        let labelX = label.map(item => {
          return Object.keys(item)[0]
        })
        let labelY = label.map(item => {
          return {
            name: Object.keys(item)[0],
            value: item[Object.keys(item)[0]]
          }
        })
        let sourceX = source.map(item => {
          return Object.keys(item)[0]
        })
        let sourceY = source.map(item => {
          return {
            name: Object.keys(item)[0],
            value: item[Object.keys(item)[0]]
          }
        })
        setTimeout(() => {
          _this.getTitlePieDialog(keywordList)
          _this.getCompanyBarDialog(categoryX, categoryY)
          _this.getPushTimeLineDialog(labelX, labelY)
          _this.getComeFromBarDialog(sourceX, sourceY)
          setTimeout(() => {
            _this.canShow = true
          }, 100)
        }, 100)
      })
    },
    // 关键字
    getTitlePieDialog (data) {
      this.titlePieDialog.title = '受数据量影响，暂时只展示前20位'
      let list = data.map(item => {
        return item.name
      })
      this.titlePieDialog.legend = list
      this.titlePieDialog.series = [{
        name: 'test',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: data.length > 20 ? data.slice(0, 20) : data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    },
    // 类别
    getCompanyBarDialog (dataX, dataY) {
      this.companyBarDialog.title = '受数据量影响，暂时只展示前20位'
      this.companyBarDialog.legend = {
        data: dataX.length > 20 ? dataX.slice(0, 20) : dataX,
        align: 'left'
      }
      this.companyBarDialog.xAxisData = dataX.length > 20 ? dataX.slice(0, 20) : dataX
      let list = dataY.map(i => {
        return i.data
      })
      this.companyBarDialog.yAxis = [
        {
          type: 'value'
        }
      ]
      this.companyBarDialog.series = [{
        data: list.length > 20 ? list.slice(0, 20) : list,
        type: 'bar'
      }]
    },
    // 标签
    getPushTimeLineDialog (dataX, dataY) {
      this.pushTimeLineDialog.title = '受数据量影响，暂时只展示前20位'
      this.pushTimeLineDialog.legend = {
        data: dataX.length > 20 ? dataX.slice(0, 20) : dataX,
        align: 'left'
      }
      this.pushTimeLineDialog.xAxisData = dataX.length > 20 ? dataX.slice(0, 20) : dataX
      this.pushTimeLineDialog.yAxis = [
        {
          type: 'value'
        }
      ]
      let list = dataY.map(i => {
        return i.value
      })
      this.pushTimeLineDialog.series = [{
        data: list.length > 20 ? list.slice(0, 20) : list,
        type: 'line'
      }]
    },
    // 来源
    getComeFromBarDialog (dataX, dataY) {
      this.from.title = '受数据量影响，暂时只展示前20位'
      this.from.legend = {
        data: dataX.length > 20 ? dataX.slice(0, 20) : dataX,
        align: 'left'
      }
      this.from.xAxisData = dataX.length > 20 ? dataX.slice(0, 20) : dataX
      this.from.yAxis = [
        {
          type: 'value'
        }
      ]
      let list = dataY.map(i => {
        return i.value
      })
      this.from.series = [{
        data: list.length > 20 ? list.slice(0, 20) : list,
        type: 'bar'
      }]
    }
  }
}
</script>

