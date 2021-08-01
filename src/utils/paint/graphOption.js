export default {
  option: {
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    tooltip: {
      show: true,
      position: 'right',
      formatter: function (params) {
        // let str = ''
        // if (params.dataType === 'edge') {
        //   str = params.data.value
        // }
        // if (params.dataType === 'node') {
        //   str = params.data.labelName + ': ' + params.data.realValue
        // }
        // return str
        return params.data.value
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        label: {
          show: false,
          formatter: function (params) {
            return params.data.value
          }
        },
        draggable: false,
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [4, 6],
        edgeLabel: {
          show: false,
          formatter: function (params) {
            // console.log('edgeLabel:', params)
            return params.data.value
          }
        },
        roam: true,
        force: {
          repulsion: 150
        },
        lineStyle: {
          width: 0.5,
          opacity: 0.7
        },
        focusNodeAdjacency: true,
        data: [],
        links: []
      }
    ]
  }
}
