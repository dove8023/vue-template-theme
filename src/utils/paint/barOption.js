export default {
  option: {
    title: {
      text: '柱形统计图'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}'
    },
    legend: {
      align: 'right',
      right: 10
    },
    xAxis: {
      data: [],
      type: 'category',
      silent: false,
      splitLine: {
        show: false
      },
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'bar',
        type: 'bar',
        data: [],
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        animationDelay: function (idx) {
          return idx * 10
        }
      }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5
    }
  }
}
