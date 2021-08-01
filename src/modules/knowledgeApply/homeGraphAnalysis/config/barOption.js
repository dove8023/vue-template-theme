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
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter:{
        
      }
    },
    grid: {
      left: "5%",
      right: "4%",
      bottom: "10%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: [],
      axisTick: {
        show: false
      },
      axisLabel:{
        rotate:"45"
      },
      nameLocation: "middle",
      nameGap: "45"
    },
    yAxis: {
      type: "value",
      nameLocation: "middle",
      nameGap: "20"
    },
    series: [
      {
        name: "bar",
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4877FB"
        },
        data: []
      }
    ]
  }
};
