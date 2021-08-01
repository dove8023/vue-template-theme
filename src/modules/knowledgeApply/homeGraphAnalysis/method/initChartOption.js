import BarOption from "../config/barOption";
import ScatterOption from "../config/scatterOption";

export default {
    initAmplBarOption :(data,info) =>{
        let option = JSON.parse(JSON.stringify(BarOption.option));
        if(!data.values){
          option.title.text = info.chartName+'(数据缺失)';
          option.xAxis.show = false
          option.yAxis.show = false
          return option
        }
        option.series[0].data = data.values[0].y_value.map((item) => {
          return parseInt(item);
        });
        option.xAxis.data = data.values[0].x_value;
        option.xAxis.name = data.x_name;
        option.yAxis.name = data.y_name;
        option.tooltip.formatter = `{b} : {c}`
        return option;
    },

    initAmplScatterOption:(data,info)=>{
        let option = JSON.parse(JSON.stringify(ScatterOption.option));
        if(!data.values){
          option.title.text = info.chartName+'(数据缺失)';
          option.xAxis.show = false
          option.yAxis.show = false
          return option
        }
        if(data.values[0].x_value.length>0){
            option.series[0].data = data.values[0].x_value.map((item,index) => {
              return [item,data.values[0].y_value[index]]
            })
         }
        option.xAxis.name = data.x_name;
        option.yAxis.name = data.y_name;
        option.tooltip.formatter = `{c}`
        return option;
    }
  }