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
      default: '曲线图'
    },
    // {
    //   data: ['bar', 'bar2'], // 图例
    //   align: 'left' // 对齐方向
    // }
    legend: {
      type: Object || Array,
      default () {
        return {}
      }
    },
    xAxisData: {
      type: Array,
      default () {
        return null
      },
      required: false
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
    xAxis: {
      type: Array,
      default () {
        return null
      }
    },
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
          name: 'line',
          type: 'line',
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
      visible: true,
      myGraph: HTMLFormElement,
      option: {
      }
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
        tooltip: {
          trigger: 'axis',
          confine: true
        },
        legend: {
          data: _this.legend,
          align: 'left',
          width: 500
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: _this.xAxis ? _this.xAxis : {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            interval: 0
          },
          axisLabel: {
            interval: 0,
            rotate: -45
          },
          data: _this.xAxisData
        },
        yAxis: _this.yAxis,
        series: _this.series
      })
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
