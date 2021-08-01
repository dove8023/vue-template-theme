<template>
  <div class="chart-toolbox">
    <gs-popover
      ref="popover1"
      supernatant
      :arrow="false"
      :append-to-body="false"
      placement="bottom-end"
      :width="100"
      trigger="hover"
    >
      <ul class="opt-btn-wrap">
        <li class="btn-item" :class="{disabled:!pageAuth.edit}" @click="handleClickEdit(pageAuth.edit)" v-if="isData">修改图表</li>
        <li class="btn-item" :class="{disabled:!pageAuth.export}" @click="handleClickExportImg(pageAuth.export)" v-if="isData">导出图片</li>
        <li class="btn-item" :class="{disabled:!pageAuth.delete}" @click="confirmDelete(pageAuth.delete)">
          删除
        </li>
      </ul>
    </gs-popover>
    <img src="@/assets/images/icons/ampl.png" @click="handleAmpl" v-if="isData"/>
    <img src="@/assets/images/icons/refresh.png" @click="handleClickRefresh" v-if="isData"/>
    <img src="@/assets/images/icons/option.png" v-popover:popover1/>
    <gs-modal
      class="my-test-class"
      v-model="visible"
      title="删除确认"
      @confirm="handleConfirm"
      :closable="false"
    >
      确认删除图表吗？
    </gs-modal>
  </div>
</template>

<script>
  export default {
    name: "ChartToolbox",
    props: {
      chartIndex: {
        type: Number,
        required: true
      },
      isData: {
        type: Boolean,
        required: true
      },
      pageAuth: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        visible: false
      };
    },
    methods: {
      confirmDelete (auth) {
        if (auth) this.visible = true
      },
      handleConfirm () {
        this.visible = false
        this.$emit("deleteChart", this.chartIndex)
      },
      handleClickEdit (auth) {
        auth && this.$emit("handleEdit", this.chartIndex)
      },
      handleClickRefresh () {
        this.$emit("handleRefresh", this.chartIndex)
      },
      handleClickExportImg (auth) {
        auth && this.$emit('exportImg', this.chartIndex)
      },
      handleAmpl () {
        this.$emit('amplChart', this.chartIndex)
      }
    }
  };
</script>
