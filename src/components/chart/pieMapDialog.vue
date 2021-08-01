<template>
  <div>
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
      default: '饼图'
    },
    // {
    //   data: ['bar', 'bar2'], // 图例
    //   align: 'left' // 对齐方向
    // }
    legend: {
      type: Array,
      default () {
        return []
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
    }, 500)
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
          text: _this.title,
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: _this.legend,

          selected: _this.legend
        },
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
