export default {
  option: {
    title: {
      text: '饼状图统计'
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
      data: [],
      selected: {}
    },
    series: [
      {
        name: '统计',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: [],
        label: {
          normal: {
            formatter: '{b} : {c} ({d}%)'
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
