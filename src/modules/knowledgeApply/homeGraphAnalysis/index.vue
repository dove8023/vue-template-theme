<template>
  <div class="home-query-container hidden-height chart-analysis-container">
    <div
      class="content-layout-container scroll-container customer analysis-main-container"
    >
      <noViewAuth v-if="!pageAuth.view" />
      <div v-else class="query-module-container">
        <gs-loading v-if="loading" text="加载中…" />
        <!-- <div
          class="create-btn"
          :class="{ disabled: !pageAuth.add }"
          @click="showCreateModal('create')"
        >
          <span>+ 自定义图表</span>
        </div> -->

        <div class="create-btn">
          <gs-button
            type="primary"
            :disabled="!pageAuth.add"
            @click="showCreateModal('create')"
          >
            自定义图表
          </gs-button>
        </div>
        <div class="analysis-container">
          <div
            v-for="(item, index) in chartsData"
            :key="index"
            class="chart-content"
          >
            <chart-toolbox
              :page-auth="pageAuth"
              :chart-index="index"
              :is-data="chartsData[index].values ? true : false"
              @deleteChart="deleteChart"
              @handleEdit="handleEdit"
              @handleRefresh="handleRefresh"
              @exportImg="exportImg"
              @amplChart="amplChart"
            />
            <div
              :ref="'chartContainerRef' + index"
              class="chart-container bar-3D"
            />
          </div>
          <div v-if="noData" class="empty-container">
            <img src="@/assets/images/icons/newChart.png" class="icon">
            <div class="tip-text">
              还未创建图表
            </div>
            <gs-button
              type="primary"
              :disabled="!pageAuth.add"
              @click="showCreateModal('create')"
            >
              立即创建
            </gs-button>
          </div>

          <set-chart-modal
            ref="setChartModal"
            class="create-chart-modal"
            :show-modal="showModal"
            :edit-data="editData"
            :open-type="openType"
            @refreshPage="refreshPage"
            @clearEdit="clearEdit"
          />
          <ampl-modal
            ref="amplModal"
            class="ampl-chart-modal"
            :charts-list="chartsList"
            :charts-data="chartsData"
            :ampl-index="amplIndex"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScatterOption from "./config/scatterOption"
import BarOption from "./config/barOption"

import AnalysisService from "@/service/analysisService"
import SetChartModal from "./components/setChartModal"
import ChartToolbox from "./components/chartToolbox"
import AmplModal from "./components/amplModal"
import noViewAuth from "@/components/public/noViewAuth"
import { mapGetters } from "vuex"
import { getPageAuth } from "@/utils/comUtils"
import * as echarts from "echarts"

export default {
    components: {
        SetChartModal,
        ChartToolbox,
        AmplModal,
        noViewAuth
    },
    data() {
        return {
            label: "图谱分析",
            loading: false,
            noData: false, // 没有图标界面的展示flag
            chartContainers: [], // 生成的图形容器
            chartsData: [], // 图形数据内容
            chartsList: [], // 总图表列表
            showModal: false,
            editData: {}, // 修改图表时传入的数据
            deleteNum: 0,
            amplIndex: 0,
            openType: 0,
            pageAuth: {
                view: false,
                add: false,
                edit: false,
                delete: false,
                export: false
            }
        }
    },
    computed: {
        ...mapGetters(["resourceGroup"])
    },
    watch: {},
    mounted() {
        this.initPage()
    },
    destroy() {
        window.onresize = null
    },
    methods: {
        initPage() {
            let auth = getPageAuth(this.resourceGroup, this.$route.path)
            this.pageAuth = { ...this.pageAuth, ...auth }
            if (!this.pageAuth.view) {
                return false
            }
            this.loading = true
            this.getChartsList()
            this.resize()
            setTimeout(() => {
                window.onresize()
            }, 1)
        },
        initCharts(item, index) {
      // this.chartsData.map((item, index) => {
            let option = null

            switch (this.chartsList[index].chartType) {
                case "柱状图":
                    option = this.initBarCharts(item, index)
                    break
                case "散点图":
                    option = this.initScatterCharts(item, index)
                    break
                default:
                    break
            }

            let element = this.$refs["chartContainerRef" + index][0]
            element.style.width = element.parentNode.clientWidth + "px"
            element.style.height = element.parentNode.clientHeight + "px"
            let chartContainer = echarts.init(element)
            this.chartContainers[index] = chartContainer
            chartContainer.setOption(option)
      // })
        },
        initBarCharts(data, index) {
            let option = JSON.parse(JSON.stringify(BarOption.option))
            if (!data.values) {
                option.title.text = this.chartsList[index].chartName + "(数据缺失)"
                option.xAxis.show = false
                option.yAxis.show = false
                return option
            }
            option.series[0].data = data.values[0].y_value.map((item, index) => {
                return parseInt(item)
            })
            option.title.text = this.chartsList[index].chartName
            option.xAxis.data = data.values[0].x_value
            option.xAxis.name = data.x_name
            option.yAxis.name = data.y_name
            option.tooltip.formatter = this.barToolTips()
            return option
        }, // 对柱状图数据进行配置
        initScatterCharts(data, index) {
            let option = JSON.parse(JSON.stringify(ScatterOption.option))
            if (!data.values) {
                option.title.text = this.chartsList[index].chartName + "(数据缺失)"
                option.xAxis.show = false
                option.yAxis.show = false
                return option
            }
      // if(data.values[0].x_value.length>0){
      //    option.series[0].data = data.values[0].x_value.map((item,index) => {
      //      return [item,data.values[0].y_value[index]]
      //    })
      // }
            for (let [i, val] of data.values.entries()) {
                let mapData = val.x_value.map((item, index) => {
                    return [item, val.y_value[index]]
                })
                if (i === 0) {
                    option.series[i].data = [...mapData]
                } else {
                    option.series[1].data = [...mapData]
                }
            }
            option.title.text = this.chartsList[index].chartName
            option.xAxis.name = data.x_name
            option.yAxis.name = data.y_name //值设置
            option.tooltip.formatter = `{c} `
            option.xAxis.axisLabel = {
                show: true
            }
            return option
        }, // 散点图样式
        showCreateModal(type) {
      // 有新增权限才打开对话框
            if (this.pageAuth.add) {
                if (type && type === "create") {
                    this.openType = 0
                } else {
                    this.openType = 1
                }
                this.$refs["setChartModal"].showModal()
            }
        }, // 调用弹窗内部方法显示弹窗
        getChartsList() {
            AnalysisService.getAllCharts()
        .then(res => {
            if (res.code === 0) {
                res.data.length === 0 ? (this.noData = true) : (this.noData = false)
            // res.data.sort((a, b) => {
            //     return a.id - b.id
            // })
                this.chartsList = res.data
                this.getAllChartData()
            } else {
                this.$Message.error({
                    duration: 2.5,
                    content: res.message
                })
            }
        })
        .catch(err => {
            this.$Message.error({
                duration: 2.5,
                content: err.message
            })
        })
        }, // 获取图表信息
        getAllChartData() {
            this.chartsData =  Array.from({length:this.chartsList.length},()=>({}))
            this.chartsList.forEach(async (item, key) => {
                let param = {
                    id: "",
                    date: "1988-10-25",
                    data: {
                        chartId: item.id
                    }
                }
                const data = await this.getChartData(param, key, false)
                // console.log('000',item.id, data.id,key)
              // this.initCharts(data, key)
            })
            this.loading = false
      // var chartInterval = setInterval(() => {
      //     if (this.chartsData.length === this.chartsList.length) {
      //         this.chartsData.sort((a, b) => {
      //             return a.id - b.id
      //         })
      //         clearInterval(chartInterval)
      //         this.loading = false
      //         this.initCharts()
      //     }
      // }, 200)
        }, // 获取所有图表的具体数据
        getChartData(param, index, flag=true) {
            return new Promise(resolve => {
                AnalysisService.getChartData(param)
          .then(res => {
            let resolveData = null
              if (res.code === 0) {
                resolveData = res.data
                  if (typeof index === "number") {
                      res.data.id = param.data.chartId
                    flag?(this.chartsData[index] = res.data): this.chartsData.splice(index,1,resolveData)
                    flag&&this.initSingleChart(index)
                  } // 传入index时则是刷新
                  else {
                      res.data.id = param.data.chartId
                      this.chartsData.push(resolveData)
                  } // 非index时是全量加载
                // console.log('index.' , index, this.chartsData.length -1, this.chartsData)
                // const index =index??this.chartsData.length -1
              } else {
                resolveData = { id: param.data.chartId }
                if (typeof index === "number") {
                  this.chartsData.splice(index,1,resolveData)

                }else{
                  this.chartsData.push(resolveData)
                }
                //   this.$Message.error({
                //       duration: 2.5,
                //       content: res.message
                //   })
              }
            !flag&&this.initCharts(resolveData, index)
            resolve(resolveData)
          })
          .catch(err => {
              console.log(err)
            //   this.$Message.error({
            //       duration: 2.5,
            //       content: err.message
            //   })
          })
            })
        }, // 请求一个图表的数据
        deleteChart(index) {
            let param = {
                id: "",
                date: "1988-10-25",
                data: {
                    chartIds: [this.chartsList[index].id]
                }
            }
            let chart = document.getElementsByClassName("chart-content")

            AnalysisService.deleteChart(param)
        .then(res => {
            if (res.code === 0) {
                this.$Message.success({
                    duration: 2.5,
                    content: "删除图表成功"
                })
                document.getElementsByClassName("chart-content")[index].style =
              "display:none"
                this.deleteNum++
                if (this.deleteNum === this.chartsData.length) {
                    this.noData = true
                }
            } else {
                this.$Message.error({
                    duration: 2.5,
                    content: res.message
                })
            }
        })
        .catch(err => {
            this.$Message.error({
                duration: 2.5,
                content: err.message
            })
        })
        }, // 删除图表
        disposeChart(index) {
            if (this.chartContainers[index]) {
                this.chartContainers[index].dispose()
            }
        }, // 销毁图表
        handleEdit(index) {
            AnalysisService.getEditInfo(this.chartsList[index].id)
        .then(res => {
            if (res.code === 0) {
                this.editData = res.data
                setTimeout(() => {
                    this.showCreateModal()
                }, 10)
            } else {
                this.$Message.error({
                    duration: 2.5,
                    content: res.message
                })
            }
        })
        .catch(err => {
            this.$Message.error({
                duration: 2.5,
                content: err.message
            })
        })
        }, // 编辑图表
        clearEdit() {
            this.editData = {}
        }, // 关闭窗口时清空编辑数据
        handleRefresh(index) {
            let param = {
                id: "",
                date: "1988-10-25",
                data: {
                    chartId: this.chartsList[index].id
                }
            }
            this.getChartData(param, index)
        },
        initSingleChart(index) {
            this.disposeChart(index)
            let option = null
            switch (this.chartsList[index].chartType) {
                case "柱状图":
                    option = this.initBarCharts(this.chartsData[index], index)
                    break
                case "散点图":
                    option = this.initScatterCharts(this.chartsData[index], index)
                    break
                default:
                    break
            }

            let element = this.$refs["chartContainerRef" + index][0]
            element.style.width = element.parentNode.clientWidth + "px"
            element.style.height = element.parentNode.clientHeight + "px"
            let chartContainer = echarts.init(element)

            this.chartContainers[index] = chartContainer
            chartContainer.setOption(option)
        }, // 单独刷新一个图表
        refreshPage() {
            this.chartsList = []
            this.chartsData = []
            this.chartContainers = []
            this.deleteNum = 0
            this.initPage()
        }, // 创建成功后添加
        resize() {
            window.onresize = () => {
                this.chartContainers.forEach(itemContainer => {
                    if (itemContainer) {
                        itemContainer.resize()
                    }
                })
            }
        }, // 窗口变化的响应函数
        barToolTips() {
      /**  判断多点重合渲染问题 */

      // let X = params.value[0]; // X轴值
      // let Y = params.value[1]; // Y轴值
      // return `${X}：${Y}<br/>`;
            return `{b} : {c}`
        },
        exportImg(index) {
            const a = document.createElement("a")
            a.href = this.chartContainers[index].getDataURL({
                pixelRatio: 2,
                backgroundColor: "#fff"
            })
            a.setAttribute("download", this.chartsList[index].chartName)
            a.click()
        }, // 导出图表为图片
        amplChart(index) {
            this.$refs["amplModal"].showModal()
            this.amplIndex = index
        } // 放大图表
    }
}
</script>
