<template>
  <div style="width: 100%; height: 100%;">
    <div
      ref="graphMain"
      class="grap-container"
      style="width:100%;height:400px"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import * as echarts from 'echarts'

export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: '柱状图'
    },
    // {
    //   data: ['bar', 'bar2'], // 图例
    //   align: 'left' // 对齐方向
    // }
    legend: {
      type: Object,
      default () {
        return {}
      }
    },
    xAxisData: {
      type: Array,
      default () {
        return []
      }
    },
    // {
    //         type: 'value',
    //         name: '水量',
    //         min: 0,
    //         max: 250,
    //         interval: 50,
    //         axisLabel: {
    //             formatter: '{value} ml'
    //         }
    //     },
    yAxis: {
      type: Array,
      default () {
        return []
      }
    },
    // [{
    //       name: 'bar',
    //       type: 'bar',
    //       data: data1,
    //       animationDelay: function (idx) {
    //         return idx * 10
    //       }
    //     }, {
    //       name: 'bar2',
    //       type: 'bar',
    //       data: data2,
    //       animationDelay: function (idx) {
    //         return idx * 10 + 100
    //       }
    //     }]
    series: {
      type: Array,
      default () {
        return [{
          name: 'bar',
          type: 'bar',
          data: [],
          animationDelay: function (idx) {
            return idx * 10
          }
        }]
      }
    }
  },
  data () {
    return {
      myGraph: HTMLFormElement
    }
  },
  computed: {
  },
  watch: {
  },
  created () {

  },
  mounted () {
    let me = this
    setTimeout(() => {
      me.init()
    }, 100)
    window.onresize = function () {
      me.resize()
    }
  },
  methods: {
    handleConfirm () {
      this.init()
    },
    close () {

    },
    beforeClose () {

    },
    init () {
      let _this = this
      this.myGraph = echarts.init(this.$refs.graphMain)
      this.myGraph.setOption({
        title: {
          text: _this.title
        },
        legend: _this.legend,
        toolbox: {
        // y: 'bottom',
          orient: 'vertical',
          feature: {
            magicType: {
              type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        tooltip: {},
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          data: _this.xAxisData,
          type: 'category',
          silent: false,
          splitLine: {
            show: false
          },
          axisTick: {
            interval: 0
          },
          axisLabel: {
            interval: 0,
            rotate: -45
          }
        },
        yAxis: _this.yAxis,
        series: _this.series,
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
          return idx * 5
        }
      })
      setTimeout(() => {
        _this.myGraph.resize()
      }, 100)
    },
    resize () {
      this.myGraph.resize({
        width: 900,
        height: 400
      })
    }
  }
}
</script>
