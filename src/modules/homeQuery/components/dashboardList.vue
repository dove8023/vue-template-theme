<template>
  <div
    v-if="qaTableInfo.length>0"
    :class="{'box-shadow': qaTableInfo.length>0}"
    class="dashboard-list-container"
  >
    <div class="test dashboard-inner clearfix">
      <!--表格-->
      <div
        :class="{'table-wrap-no-graph': nodesList.length < 2}"
        class="table-wrap"
      >
        <div
          v-if="qaTableInfo.length > 0"
          class="single-result-container clearfix"
        >
          <div
            v-for="(data, index) in qaTableInfo"
            :key="index"
            class="margin-top8"
          >
            <h3
              :key="'title' + index"
              class="title"
            >{{ data.title }}</h3>
            <gs-table
              :key="'table' + index"
              :data="data"
              :show-header="false"
              :stripe="false"
              :class="{'single-data-style': qaTableInfo.length === 1}"
              class="single-result-table"
            >
              <gs-table-column
                v-for="(item, index) in tableItems"
                :key="index"
                :label="item.prop"
                :prop="item.prop"
                :show-overflow-tooltip="isShowOverflowTooltip"
              >
                <template slot-scope="scope">
                  {{ scope.row[item.prop] }}
                </template>
              </gs-table-column>
            </gs-table>
            <div
              :key="'clear' + index"
              class="clearfix"
            />
          </div>
        </div>
        <!--<div-->
        <!--v-if="qaTableInfo.length==0"-->
        <!--:class="{'height': rightWidth > 0}"-->
        <!--class="no-data-tip"-->
        <!--&gt;-->
        <!--请您问的再详细一些~-->
        <!--</div>-->
      </div>

      <!-- 图谱 -->
      <div
        v-if="nodesList.length > 1"
        class="graph-wrap"
      >
        <div
          id="data_graph_module"
          class="chart-module"
          style="width: 240px;height: 200px;"
        />
      </div>
    </div>

    <gs-mask
      :visible.sync="imgMaskVisible"
      show-close
      deep-dark
      close-on-click-mask
      fullscreen
    >
      <img
        :src="imgInfo.value"
        alt="imgInfo.key"
      >
    </gs-mask>
  </div>
</template>

<script type="es6">

  import Vue from 'vue'
  import * as echarts from 'echarts'

  import GraphOption from '@/utils/paint/graphOption'
  import QueryService from '@/service/queryService'
  // import FormatParamService from '../services/formatParamService'

  import FixRightAutoLeft from '@/components/public/fixRightAutoLeft'

  export default {
    components: {FixRightAutoLeft},
    props: {
      param: {
        type: Object,
        required: true
      },
      pageAuth: {
        type: Object
      }
    },
    data () {
      return {
        isShowOverflowTooltip: false,
        nodesList: [],
        rightWidth: 0, // 211px
        qaTableInfo: [],
        graphData: {
          nodes: [
            {
              id: 1,
              categoray: '井漏',
              label: 'abc',
              value: '节点的值',
              unit: '可选',
              source: '来源',
              others: {}
            },
            {
              id: 2,
              categoray: '井漏2',
              label: 'abc2',
              value: '节点的值2',
              unit: '可选2',
              source: '来源2',
              others: {}
            },
            {
              id: 3,
              categoray: '井漏2',
              label: 'abc2',
              value: '节点的值2',
              unit: '可选2',
              source: '来源2',
              others: {}
            }
          ],
          edges: [
            {
              id: 111,
              source_id: 1,
              target_id: 3,
              sourceLabel: '',
              targetLabel: '结束节点label',
              value: '关系'
            }
          ]
        },
        imgMaskVisible: false,
        imgInfo: {},
        dataGraphChart: null,
        tableItems: [
          {
            prop: 'label',
            width: 120
          },
          {
            prop: 'value',
            width: 160
          }
        ]
      }
    },
    mounted () {
      var me = this

      me.initModule()
    },
    methods: {
      initModule () {
        var me = this

        var param = me.param

        if (param.sentence) {
          me.getQATableInfo()
        } else {
          me.qaTableInfo = []
        }
      },
      getQATableInfo () {
        var me = this
        QueryService.getRHistory(me.param).then(
          res => {
            if (res.data) {
              me.initGraph()

              me.qaTableInfo = []

              let tempObj = res.data
              let tempKeys = Object.keys(tempObj)

              tempKeys.forEach((key, index) => {
                if (!me.qaTableInfo[0]) {
                  Vue.set(me.qaTableInfo, 0, [])
                }
                if (typeof tempObj[key] === 'string') {
                  if(tempObj[key] != '未找到答案！'){ // 返回值不为'未找到答案'
                    me.qaTableInfo[0].title = me.param.sentence
                    me.qaTableInfo[0].splice(me.qaTableInfo[0].length, 0, {
                      label: key,
                      value: tempObj[key]
                    })
                  }
                } else if(Object.keys(tempObj[key]).length > 0){ // 如果返回值类型不为string并且不为空
                  if (!me.qaTableInfo[index]) {
                    Vue.set(me.qaTableInfo, index, [])
                  }
                  me.qaTableInfo[index].title = key
                  // me.qaTableInfo[index].splice(0, 0, {
                  //   label: key,
                  //   value: ''
                  // })
                  let attrKeys = Object.keys(tempObj[key])
                  attrKeys.forEach((attrKey, attrIndex) => {
                    // me.qaTableInfo[index].splice(attrIndex + 1, 0, {
                    me.qaTableInfo[index].splice(attrIndex, 0, {
                      label: attrKey,
                      value: tempObj[key][attrKey]
                    })
                  })
                }
              })
              // 当搜索条件不存在时清空数据
              if(!this.param.sentence){
                this.qaTableInfo = [];
              }
            }
          }
        )
      },

      initGraph () {
        if(!this.pageAuth.result_query){
          return false
        }
        var me = this
        me.nodesList = []

        QueryService.getQAGraph(me.param).then(function (res) {
          var nodes = res.data.node || []
          var edges = res.data.edge || []

          me.nodesList = nodes

          setTimeout(function () {
            if (nodes.length > 1) {
              me.rightWidth = 211
              me.initNodeGraph(nodes, edges)
            } else {
              me.rightWidth = 0
            }
          }, 10)
        })
      },

      initNodeGraph (nodes, edges) {
        var me = this

        var option = GraphOption.option
        var graphModule = document.getElementById('data_graph_module')

        if (graphModule) {
          option.series[0].data = nodes.map(function (item) {
            return {
              name: item.id,
              info: item,
              labelName: `${item.category}:${item.name}`,
              realValue: `${item.category}:${item.name}`,
              value: `${item.category}:${item.name}`,
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
              source: item.source_id.toString(),
              target: item.target_id.toString(),
              value: item.value
            }
          })

          me.dataGraphChart = echarts.init(graphModule)

          me.dataGraphChart.setOption(option)
        }
      }
    }
  }
</script>
