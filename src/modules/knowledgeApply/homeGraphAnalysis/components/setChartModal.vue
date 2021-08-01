<template>
  <gs-modal
    v-model="visible"
    :title="openType ? '修改图表' : '创建图表'"
    width="1100px"
    :class="chartType"
    @cancel="closeModal"
    @close="closeModal"
    @confirm="handlecommitChart"
  >
    <div class="create-container">
      <div class="left-chart">
        <h3>图表预览</h3>
        <div class="preview-header">
          <h3 class="preview-title">
            {{ isChart ? previewName : "未创建标题" }}
          </h3>
          <img
            src="@/assets/images/icons/refresh.png"
            class="refresh-btn"
            @click="getPreviewData"
          >
        </div>
        <div v-if="isChart" ref="chartContainerRef" class="preview-chart" />
        <div v-if="!isChart" class="preview-chart empty-preview">
          <img src="@/assets/images/icons/noData.png">
          <span>当前图表无数据</span>
        </div>
        <div v-if="this.chartData.type === '柱状图'" class="limit-number">
          <span>显示条目数</span>
          <gs-input-number
            v-model="chartData.blockNum"
            :disabled="limitNumber"
            min="0"
          />
        </div>
      </div>

      <div class="right-content">
        <gs-form
          ref="chartData"
          class="chart-form"
          :rules="formRules"
          :model="chartData"
        >
          <gs-form-item label="图表类型">
            <gs-radio-group
              v-model="chartData.type"
              class="form-radio"
              type="button"
              :disabled="this.editData.chartType ? true : false"
              @change="handleRadioChange"
            >
              <gs-radio label="柱状图">
                <img src="@/assets/images/icons/barChart.png">
                柱形图
              </gs-radio>
              <gs-radio label="散点图">
                <img src="@/assets/images/icons/scatterChart.png">
                散点图
              </gs-radio>
            </gs-radio-group>
          </gs-form-item>

          <gs-form-item label="名称" class="form-name" prop="name">
            <gs-input
              v-model="chartData.name"
              class="name-input"
              placeholder="输入图表名称"
              :style="lengthWarning"
            />
            <span>{{ chartData.name.length }}/20</span>
          </gs-form-item>

          <gs-form-item label="筛选器">
            <div
              v-for="(item, index) in chartData.filters"
              :key="index"
              class="form-filter-group"
            >
              <gs-cascader-select
                v-model="chartData.filters[index].attr"
                class="filter-cascader"
                placeholder="选择数据"
                filterable
                clearable
                :options="filterOptions"
                @active-item-change="handleItemChange($event, 'filter')"
                @change="handleFilterChange($event, index)"
              />
              <gs-select
                v-model="chartData.filters[index].calculation"
                class="filter-select"
              >
                <gs-option
                  v-for="(item, index) in calculationOptions"
                  :key="index"
                  :label="item.text"
                  :value="item.label"
                />
              </gs-select>
              <gs-input-number
                v-if="chartData.filters[index].type === '数值'"
                v-model="chartData.filters[index].key"
                class="filter-input"
                placeholder="输入值"
              />
              <gs-input
                v-if="chartData.filters[index].type === '字符串'"
                v-model="chartData.filters[index].key"
                class="filter-input"
                placeholder="输入值"
              />
              <gs-date-picker
                v-if="chartData.filters[index].type === '日期'"
                v-model="chartData.filters[index].key"
                class="filter-input"
                type="date-time-range"
                format="YYYY-MM-DD HH:mm:ss"
              />

              <img
                v-if="chartData.filters.length > 1"
                src="@/assets/images/icons/delete.png"
                class="cancel-btn"
                @click="deleteFilter(index)"
              >
            </div>
            <div class="add-btn" @click="addFilter">
              +添加条件
            </div>
          </gs-form-item>

          <gs-form-item label="X轴" class="select-parameter" prop="xProId">
            <gs-cascader-select
              ref="cascaderSelect"
              v-model="chartData.xProId"
              placeholder="选择X轴数据"
              :options="x_Options"
              @active-item-change="
                (val, data) => handleItemChange(val, 'xAxis', data)
              "
              @change="handleXAxisChange"
            />
          </gs-form-item>

          <gs-form-item label="计算方式" class="select-calculation">
            <gs-select v-model="chartData.xCallType">
              <gs-option
                v-for="(item, index) in this.xCallTypeOption"
                :key="index"
                :value="item"
                :label="item"
              />
            </gs-select>
          </gs-form-item>

          <gs-form-item label="Y轴" class="select-parameter" prop="yProId">
            <gs-cascader-select
              v-model="chartData.yProId"
              placeholder="选择Y轴数据"
              :options="x_Options"
              :disabled="this.chartData.type === '柱状图'"
            />
            <!-- 此处由于y轴不可选，为了显示统一绑定x轴选项 -->
          </gs-form-item>

          <gs-form-item label="计算方式" class="select-calculation">
            <gs-select v-model="chartData.yCallType">
              <gs-option
                v-for="(item, index) in this.yCallTypeOption"
                :key="index"
                :value="item"
                :label="item"
              />
            </gs-select>
          </gs-form-item>

          <gs-form-item
            v-if="this.chartData.type === '散点图'"
            class="check-emulate"
          >
            <gs-checkbox v-model="chartData.emulate">
              数据拟合
            </gs-checkbox>
          </gs-form-item>
        </gs-form>
      </div>
    </div>
  </gs-modal>
</template>

<script>
import ScatterOption from "../config/scatterOption"
import BarOption from "../config/barOption"
import AnalysisService from "@/service/analysisService"
import KnowledgeManageService from "@/service/knowledgeManageService"

export default {
    name: "",
    components: {},
    props: {
        editData: {
            type: Object,
            required: true
        },
        openType: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            visible: false,
            previewName: "",
            checkbox: false,
            chartData: {
                name: "",
                type: "柱状图",
                filters: [
                    {
                        attr: [],
                        calculation: "",
                        key: "",
                        type: ""
                    }
                ],
                xProId: [],
                yProId: [],
                xCallType: "",
                yCallType: "",
                blockNum: 6,
                emulate: false
            },
            chartContainers: {}, // 预览图表
            formRules: {
                name: [
                    {
                        trigger: "blur",
                        required: true,
                        validator(rule, v, cb) {
                            if (v) {
                                if (v.length > 20) {
                                    cb(new Error("名称长度不能超过20字"))
                                } else {
                                    cb()
                                }
                            } else {
                                cb(new Error("图表名称不能为空"))
                            }
                        }
                    }
                ],
                xProId: [
                    {
                        trigger: "change",
                        type: "array",
                        message: "x轴参数不能为空",
                        required: true
                    }
                ],
                yProId: [
                    {
                        trigger: "change",
                        type: "array",
                        message: "y轴参数不能为空",
                        required: true
                    }
                ]
            },
            isChart: true, //图表是否展示的flag
            chartOption: {}, // 图表参数
            filterOptions: [], //实体加属性选择器的选项
            x_Options: [], //实体加属性选择器的选项
            y_Options: [], //实体加属性选择器的选项
            bodyNodes: [], // 所有的本体列表
            calculationOptions: [
                {
                    value: 0,
                    label: "=",
                    text: "等于"
                },
                {
                    value: 1,
                    label: "<>",
                    text: "不等于"
                },
                {
                    value: 2,
                    label: ">",
                    text: "大于"
                },
                {
                    value: 3,
                    label: "<",
                    text: "小于"
                },
                {
                    value: 4,
                    label: ">=",
                    text: "大于等于"
                },
                {
                    value: 5,
                    label: "<=",
                    text: "小于等于"
                },
                {
                    value: 6,
                    label: "=~",
                    text: "包含"
                }
            ], // 计算方式选项
            xCallTypeOption: [],
            yCallTypeOption: [],
            limitNumber: true,
            lengthWarning: {}, // 控制名称长度警告样式
            keyInputType: "", //筛选器的输入框类型
            similarNodes: []
        }
    },
    computed: {
        nameLength() {
            return this.chartData.name.length
        },
        chartType() {
            switch (this.chartData.type) {
                case "柱状图":
                    return "chart-bar-modal"
                    break
                case "散点图":
                    return "chart-scatter-modal"
                    break
            }
        }
    },

    watch: {
        nameLength(value) {
            if (value > 20) {
                this.lengthWarning = {
                    border: "1px solid #c5394a"
                }
            } else {
                this.lengthWarning = {}
            }
        }
    },
    mounted() {},
    destroy() {
        window.onresize = null
    },
    methods: {
        showModal() {
            this.visible = true
            this.getBodyNodes()
            this.initPage()
        }, // 显示modal函数
        closeModal() {
            this.chartData = {
                name: "",
                type: "柱状图",
                filters: [
                    {
                        attr: [],
                        calculation: "",
                        key: "",
                        type: ""
                    }
                ],
                xProId: [],
                yProId: [],
                xCallType: "",
                yCallType: "",
                blockNum: 6,
                emulate: false
            }
            this.$refs["chartData"].resetFields() // 重置表单校验
            this.disposeChart() // 销毁图表
            this.chartContainers = {}
            this.visible = false
            this.$emit("clearEdit") // 清空编辑数据
            this.similarNodes = [] // 清空x筛选
        }, // 关闭modal函数
        initPage() {
            if (this.editData.chartType) {
                this.isChart = true
                this.initEditData()
        // this.chartOption = chart;
        // setTimeout(() => {
        //   this.initCharts();
        // }, 10); // v-if的判断好像带有异步成分，直接执行并不能获取到节点
            } else {
                this.isChart = false
            }
        },
        initCharts() {
            this.disposeChart()
            let option = null
            switch (this.chartData.type) {
                case "柱状图":
                    option = this.initBarCharts()
                    break
                case "散点图":
                    option = this.initScatterCharts()
                    break
                default:
                    break
            }
            this.previewName = this.chartData.name

            let chartContainer = echarts.init(this.$refs["chartContainerRef"])
            this.chartContainers = chartContainer
            this.chartContainers.setOption(option)
        }, // 初始加载图形
        initBarCharts() {
            let data = this.chartOption
            let option = JSON.parse(JSON.stringify(BarOption.option))
            option.series[0].data = data.values[0].y_value.map((item, index) => {
                return parseInt(item)
            })
            option.xAxis.data = data.values[0].x_value
            option.xAxis.name = data.x_name
            option.yAxis.name = data.y_name //值设置
            option.tooltip.formatter = `{b} : {c}`
            return option
        }, // 对柱状图数据进行配置
        initScatterCharts() {
            let data = this.chartOption
            let option = JSON.parse(JSON.stringify(ScatterOption.option))
            for (let [i, val] of data.values.entries()) {
                let mapData = val.x_value.map((item, index) => {
                    if (item === null) {
                        return
                    }
                    return [item, val.y_value[index]]
                })
                if (i === 0) {
                    option.series[i].data = [...mapData]
                } else {
                    option.series[1].data = [...mapData]
                }
            }
            option.xAxis.name = data.x_name
            option.yAxis.name = data.y_name //值设置
            option.tooltip.formatter = `{c}`
            option.xAxis.axisLabel = {
                show: true
            }
            return option
        }, // 对散点图数据进行配置
        addFilter() {
            this.chartData.filters.push({
                attr: [],
                calculation: "",
                key: "",
                type: ""
            })
        }, // 点击添加条件按钮添加一条属性
        deleteFilter(index) {
            this.chartData.filters.splice(index, 1)
        }, // 删除点击的属性
        getBodyNodes() {
            const param = {
                id: "",
                date: "1988-10-25",
                data: {}
            }

            KnowledgeManageService.bodyManage
        .allBodyNodes(param)
        .then(res => {
            if (res.code === 0) {
                let bodyNodes = res.data.schema.nodes
                this.bodyNodes = bodyNodes.map(item => {
                    return {
                        value: {
                            id: item.nodeId,
                            name: item.value
                        },
                        label: item.value,
                        children: []
                    }
                }) // 保存本体列表
                this.setFilterOption() //初始化筛选器本体列表
                this.setXAxisOption() //初始化x轴本体列表
                if (this.editData.chartType) {
                    if (this.editData.substanceQueryInfo) {
                        let body = this.filterOptions.filter(item => {
                            return item.label === this.editData.substanceQueryInfo.label
                        })
                        this.getAttrs(body[0].value.id, "filter")
                    } else {
                        this.getAttrs(this.editData.xproVertexSchemaId, "xAxis")
                    }
                } // 当处于编辑状态时，进行操作
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
        }, // 获取本体列表
        getAttrs(id, type, data) {
            let ids = []
            ids.push(id)

            let param = {
                id: "",
                date: "1986-07-08",
                data: {
                    schema: {
                        nodeIds: ids
                    }
                }
            }

            KnowledgeManageService.bodyManage
        .nodeAttrsUnique(param)
        .then(res => {
            if (res.code === 0) {
                let id = res.data.schema.nodes[0].nodeId
                let attrs = res.data.schema.nodes[0].attrs.map(item => {
                    return {
                        value: {
                            name: item.name,
                            type: item.type,
                            id: item.pid
                        },
                        label: item.name
                    }
                }) // 处理属性列表
                this.bodyNodes.forEach(item => {
                    if (item.value.id === id) {
                        item.children = attrs
                    }
                }) //　将查询到的属性列表赋予本体
                if (this.editData.substanceQueryInfo && type === "filter") {
                    this.editfilters()
                } // 编辑状态时，对筛选器和x轴进行选定
                else if (this.editData.chartType && type === "xAxis") {
                    console.log("编辑")
                    this.setXAxisOption()
                    this.editXproId()
                } else if (type === "filter") {
                    this.setFilterOption()
                    this.setXAxisOption()
                } else if (type === "xAxis") {
                    console.log("正常")
                    this.setXAxisOption()
                }
            } else {
                this.$Message.error({
                    duration: 2.5,
                    content: res.message
                })
            }
            data && (data.loading = false)
        })
        .catch(err => {
            this.$Message.error({
                duration: 2.5,
                content: err.message
            })
        })
        }, // 根据本体查询属性
        setFilterOption() {
            let noFilter = true
            this.chartData.filters.forEach(result => {
                if (result.attr.length > 0) {
                    noFilter = false
                    this.filterOptions = this.bodyNodes.filter(item => {
                        return item.value.id === result.attr[0].id
                    })
                }
            })
            if (noFilter) {
                this.filterOptions = this.bodyNodes
            }
        }, // 配置本体列表选项,确保筛选器的本体都是同一个
        setXAxisOption() {
            this.x_Options = JSON.parse(JSON.stringify(this.bodyNodes))
            if (this.similarNodes.length > 0) {
                this.filterXOptions()
            } // 有相似节点时对节点进行筛选,没有时设置为全量
            this.x_Options.forEach((item, index) => {
                if (item.children.length > 0 && this.chartData.type === "柱状图") {
                    let attr = item.children.filter(e => {
                        return e.value.type === "数值" || e.value.type === "字符串"
                    })
                    item.children = attr
                } else if (
          item.children.length > 0 &&
          this.chartData.type === "散点图"
        ) {
                    let attr = item.children.filter(e => {
                        return e.value.type === "数值"
                    })
                    item.children = attr
                }
            })
        }, // 设置x轴选项，筛选掉所有日期属性
        handleItemChange(value, type, data) {
            this.bodyNodes.forEach(item => {
                if (item.value.id === value[0].id && item.children.length === 0) {
                    data.loading = true
                    this.getAttrs(value[0].id, type, data)
                }
            }) // 已经有数据的本体不再发送请求
        }, // 选择本体后触发事件获取属性，并给级联选择器对应选项加入children
        handleFilterChange(value, index) {
            if (value.length > 0) {
                this.chartData.filters[index].type = value[1].type
                this.getFilterNodes(value) //获取相似节点
            } else {
                this.chartData.filters = [
                    {
                        attr: [],
                        calculation: "",
                        key: "",
                        type: ""
                    }
                ]
                this.chartData.filters[index].type = ""
                this.chartData.filters[index].calculation = ""
                this.chartData.filters[index].key = ""
                this.chartData.filters[index].attr = []
            }
            this.clearxy()
            this.setFilterOption()

            let noFilter = true
            this.chartData.filters.map(item => {
                if (item.attr.length > 0) {
                    noFilter = false
                }
            })
            if (noFilter) {
                this.similarNodes = []
                this.setXAxisOption()
            } // 筛选器清空后,要清空掉相似节点
        }, // 筛选器属性选择后，控制x轴选项和输入值的类型
        clearxy() {
            this.chartData.xProId = []
            this.chartData.xCallType = ""
            this.chartData.yProId = []
            this.chartData.yCallType = ""
        }, // 选择筛选器后清空xy轴的选项
        disposeChart() {
            if (this.chartContainers._dom) {
                this.chartContainers.dispose()
            }
        }, // 有图形时清除图形
        handleXAxisChange(value) {
            if (this.chartData.type === "柱状图") {
                if (value[1].type === "数值") {
                    this.xCallTypeOption = ["分组"]
                    this.chartData.xCallType = "分组"
                    this.limitNumber = false
                } else {
                    this.xCallTypeOption = ["原数"]
                    this.chartData.xCallType = "原数"
                    this.limitNumber = true
                }
                this.chartData.yProId = value //让y轴的值等于x轴
            } else if (this.chartData.type === "散点图") {
                if (value[1].type === "数值") {
                    this.xCallTypeOption = ["原数", "取对数"]
                    this.chartData.xCallType = "原数"
                    this.limitNumber = false
                }
            }

      // this.y_Options = this.bodyNodes.filter(item => {
      //   return item.value.id === value[0].id;
      // }); // y与x的本体必须相同，这一步目前无用，不删除有待扩展
            this.handleYAxisChange(value)
        }, // 根据x轴选项，确定计算方式选项，并确定y轴选项
        handleYAxisChange(value) {
            if (this.chartData.type === "柱状图") {
                this.yCallTypeOption = ["计数"]
                this.chartData.yCallType = "计数"
            } else if (this.chartData.type === "散点图") {
                this.yCallTypeOption = ["原数", "取对数"]
                this.chartData.yCallType = "原数"
            }
        }, //根据y轴选择的值设置计算方式选项
        getFilterNodes(value) {
            if (
        this.x_Options.length > 1 ||
        (this.x_Options === 1 && this.x_Options[0].value.id != value[0].id) // 当筛选器选择结果的本体与x轴选项相同时，就不发送查找相似节点的请求
      ) {
                let param = {
                    id: "",
                    date: "1988-10-25",
                    data: {
                        nodes: [value[0].id]
                    }
                }

                AnalysisService.searchSimilarNodes(param)
          .then(res => {
              if (res.code === 0) {
                  this.similarNodes = res.data
                  this.setXAxisOption()
                  if (this.editData.chartType && this.editData.substanceQueryInfo) {
                      if (
                  this.editData.xproVertexSchemaName ===
                  this.editData.substanceQueryInfo.label
                ) {
                          this.editXproId()
                      } else {
                          this.getAttrs(this.editData.xproVertexSchemaId, "xAxis")
                      } //　当筛选器和x轴的本体不同是,再请求一下x轴的属性，否则直接设置
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
            }
        }, // 根据筛选器获取x轴选项
        filterXOptions() {
            let nodes = []

      // console.log('this.similarNodes: ', this.similarNodes);
      // console.log('this.x_Options: ', this.x_Options);

            this.similarNodes.map(similar => {
                let node = this.x_Options.filter(item => {
                    return item.value.id === similar.nodeId
                })
                return node.length && nodes.push(node[0])
            })
            this.x_Options = nodes
        }, //根据相似节点来返回x轴的选项
        getPreviewData() {
            if (this.chartData.xProId.length === 0) {
                this.$Message.warning({
                    duration: 2,
                    content: "请选择x轴参数"
                })
                this.chartOption = {}
                this.disposeChart()
                this.chartContainers = {}
                this.isChart = false
            } else {
                let param = this.handleCommitParam("preview")
                AnalysisService.previewChart(param)
          .then(res => {
              if (res.code === 0) {
                  this.isChart = true
                  this.chartOption = res.data
                  setTimeout(() => {
                      this.initCharts()
                  }, 10)
              } else {
                  this.$Message.error({
                      duration: 2.5,
                      content: res.message
                  })
                  this.chartOption = {}
                  this.disposeChart()
                  this.chartContainers = {}
                  this.isChart = false
              }
          })
          .catch(err => {
              this.$Message.error({
                  duration: 2.5,
                  content: err.message
              })
          })
            }
        }, // 获取预览数据
        commitChartData(param) {
            AnalysisService.saveOrUpdate(param)
        .then(res => {
            if (res.code === 0) {
                this.$Message.success({
                    duration: 2.5,
                    content: this.editData.chartType ? "修改图表成功" : "创建图表成功"
                })
                this.$emit("refreshPage", res.data, this.chartData)
                this.closeModal()
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
        }, // 提交选项数据创建图表
        handleCommitParam(type) {
            let param = {
                id: "",
                date: "1988-10-25",
                data: {
                    xProId: this.chartData.xProId[1].id,
                    yProId: this.chartData.yProId[1].id,
                    xCallType: this.chartData.xCallType,
                    yCallType: this.chartData.yCallType,
                    blockNum: this.chartData.blockNum,
                    emulate: this.chartData.emulate,
                    substanceQueryInfo: {
                        label: "",
                        attributeConditions: []
                    }
                }
            }
            if (type === "save") {
                param.data.chartName = this.chartData.name
                param.data.chartType = this.chartData.type
                param.data.id = "-1"
            } else if (type === "edit") {
                param.data.chartName = this.chartData.name
                param.data.chartType = this.chartData.type
                param.data.id = this.editData.id
            }

            this.chartData.filters.forEach(item => {
                if (item.attr.length > 0) {
                    param.data.substanceQueryInfo.label = item.attr[0].name
                    let condition = {
                        name: item.attr[1].name,
                        type: item.type,
                        operator: item.calculation,
                        value: item.key
                    }
                    param.data.substanceQueryInfo.attributeConditions.push(condition)
                }
            }) // 添加筛选器数据
            return param
        }, // 图表参数设置
        handlecommitChart() {
            this.$refs["chartData"].validate(valid => {
                if (valid) {
                    let param = {}
                    if (this.editData.chartType) {
                        param = this.handleCommitParam("edit")
                    } else {
                        param = this.handleCommitParam("save")
                    }
                    this.commitChartData(param)
                } else {
                    return false
                }
            })
        }, // 发送创建请求前，进行表单验证
        handleRadioChange() {
            this.clearxy()
            this.disposeChart()
            this.setXAxisOption()
            this.isChart = false
            this.$refs["chartData"].resetFields()
        }, // 切换图形类型时清空xy值,销毁图表,重置x轴选项
        initEditData() {
            let res = this.editData
            this.chartData.name = res.chartName
            this.chartData.type = res.chartType
            this.chartData.blockNum = res.blockNum < 0 ? 0 : res.blockNum
            this.chartData.emulate = res.emulate
        }, // 对修改图表数据进行初始化操作
        editfilters() {
            this.chartData.filters = []
            let body = this.filterOptions.filter(e => {
                return e.label === this.editData.substanceQueryInfo.label
            }) // 找到与初始值统一的本体
            this.editData.substanceQueryInfo.attributeConditions.forEach(item => {
                let attr = []
                attr.push(body[0].value)
                body[0].children.forEach(at => {
                    if (at.label === item.name) {
                        attr.push(at.value)
                    }
                })
                let filter = {
                    key: item.value,
                    type: item.type,
                    calculation: item.operator ? item.operator : "",
                    attr: attr
                }
                this.chartData.filters.push(filter)
            }) // 从option选项中拿到value值，让级联选择器回显
            this.getFilterNodes(this.chartData.filters[0].attr)
            this.setFilterOption() // 搜寻相似项
        }, // 当处于编辑状态时给筛选器栏位进行数据设置
        editXproId() {
            let bodyX = this.x_Options.filter(item => {
                return item.label === this.editData.xproVertexSchemaName
            })
            let bodyY = this.x_Options.filter(item => {
                return item.label === this.editData.yproVertexSchemaName
            })
            let attrX = []
            let attrY = []

            attrX.push(bodyX[0].value)
            attrY.push(bodyY[0].value)
            bodyX[0].children.forEach(at => {
                if (at.label === this.editData.xproName) {
                    attrX.push(at.value)
                }
            })
            bodyY[0].children.forEach(at => {
                if (at.label === this.editData.yproName) {
                    attrY.push(at.value)
                }
            })
            this.chartData.xProId = attrX // 设置x轴初始值
            this.chartData.yProId = attrY // 设置y轴初始值
            this.handleXAxisChange(attrX) // 设置x轴计算方式选项
            this.handleYAxisChange(attrY) // 设置y轴计算方式选项
            this.chartData.xCallType = this.editData.xCallType
            this.chartData.yCallType = this.editData.yCallType
            this.getPreviewData()
      // this.editData = {}
        }
    }
}
</script>
