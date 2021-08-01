<template>
  <gs-modal
    v-model="visible"
    width="1000px"
    :show-cancel="false"
    :show-confirm="false"
    :show-footer="false"
    :closable="false"
  >
    <div class="ampl-header">
      <h3>{{ title }}</h3>
      <div class="close-ampl" @click="closeAmpl">
        <img src="@/assets/images/icons/closeAmpl.png" />
        <span>退出全屏</span>
      </div>
    </div>
    <div class="ampl-chart-content" ref="chartContainerRef"></div>
    <img 
    class="last-btn" 
    src="@/assets/images/icons/leftArrow.png" 
    @click="handlePageChange('last')"/>
    <img
    class="next-btn" 
    src="@/assets/images/icons/rightArrow.png" 
    @click="handlePageChange('next')"/>
  </gs-modal>
</template>

<script>
import chartsOptions from "../method/initChartOption";
import * as echarts from 'echarts'

export default {
  name: "amplModal",
  props: {
    chartsList: {
      type: Array,
      required: true
    },
    chartsData: {
      type: Array,
      required: true
    },
    amplIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      index: 0,
      title: "",
      chartContainer: {}
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    initPage() {
      this.index = this.amplIndex;
      this.title = this.chartsList[this.index].chartName;

      this.initChart(this.index);
    },
    closeAmpl() {
      this.visible = false;
      this.disposeChart()
      this.chartContainer = {}
    },
    initChart(index) {
      this.disposeChart();
      let option = null;
      switch (this.chartsList[index].chartType) {
        case "柱状图":
          option = chartsOptions.initAmplBarOption(
            this.chartsData[index],
            this.chartsList[index]
          );
          break;
        case "散点图":
          option = chartsOptions.initAmplScatterOption(
            this.chartsData[index],
            this.chartsList[index]
          );
          break;
        default:
          break;
      }
      let chartContainer = echarts.init(this.$refs["chartContainerRef"]);
      this.chartContainer = chartContainer;
      this.chartContainer.setOption(option);
    },
    disposeChart() {
      if (this.chartContainer._dom) {
        this.chartContainer.dispose();
      }
    },
    handlePageChange(type) {
      if (type === "last") {
        if (this.index > 0) {
          this.index--;
        } else {
            this.$Message.warning({
              duration: 2.5,
              content: '已经是第一个图表了！'
            });
        }
      }else if(type === 'next'){
        if(this.index <　this.chartsData.length - 1){
            this.index ++
        }
        else{
            this.$Message.warning({
              duration: 2.5,
              content: '已经是最后一个图表了！'
            });
        }
      }
    }
  },
  watch: {
    visible() {
      this.initPage();
    },
    index(value){
       this.title = this.chartsList[value].chartName;
       this.initChart(value)
    }
  }
};
</script>
