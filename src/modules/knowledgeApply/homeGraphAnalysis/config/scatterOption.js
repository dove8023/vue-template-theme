// import echarts from 'echarts'

export default {
    option: {
        title: {
            text: "",
            textStyle: {
                color: "rgba(0,0,0,0.85)",
                fontSize: "15",
                fontFamily: "MicrosoftYaHei-Bold"
            },
            top: 10,
            left: 10
        },
        tooltip: {
            trigger: 'item',
            // formatter: function (params) {
            //   let param = params[0]
            //   // return `东经：${param.value[0]}<br/>北纬：${param.value[1]}<br/>${param.value[2]}`
            //   return `东经：${param.value[0]}<br/>北纬：${param.value[1]}`
            // }
        },
        grid: {
            left: "5%",
            right: "4%",
            bottom: "10%",
            containLabel: true
        },
        xAxis: {
            nameGap: "25",
            nameLocation: 'middle',
            axisLine: { show: false },
            axisTick: { show: false }
        },
        yAxis: {
            nameGap: "20",
            axisLine: { show: false },
            axisTick: { show: false },
            nameLocation: 'middle',
        },
        series: [{
            name: 'scatter',
            type: 'scatter',
            symbolSize: 10,
            itemStyle: {
                normal: {
                    color: '#A9C0FF'
                }
            },
            data: []
        }, {
            name: 'line',
            type: 'line',
            showSymbol: false,
            smooth: false,
            data: []
        }]
    }
}