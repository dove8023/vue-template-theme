<template>
  <gs-table
    ref="baseTable"
    :data="tableConfig.data"
    :row-key="tableConfig.handleRowKey"
    :stripe="false"
    :style="{width: tableConfig.width, 'max-width': tableConfig.maxWidth}"
    class="base-table"
    @select="tableConfig.select"
    @select-all="tableConfig.selectAll"
  >
    <gs-table-column
      v-if="tableConfig.showSelection"
      :reserve-selection="true"
      type="selection"
      fixed
    />

    <gs-table-column v-if="tableConfig.showImg" width="36" class="img-column">
      <template slot-scope="scope">
        <i :class="getFileType(scope.row.fileName)" class="file-type-icon" />
      </template>
    </gs-table-column>

    <!--<gs-table-column-->
    <!--v-for="(item, index) in tableConfig.columns"-->
    <!--:key="index"-->
    <!--:width="item.width"-->
    <!--:min-width="item.minWidth"-->
    <!--:prop="item.prop"-->
    <!--:label="item.label"-->
    <!--:show-overflow-tooltip="!item.notShowTip"-->
    <!--:data-align="item.align"-->
    <!--&gt;-->

    <!--<template-->
    <!--slot-scope="scope"-->
    <!--&gt;-->
    <!--<gs-table-tags-->
    <!--v-if="item.tag"-->
    <!--:tags="scope.row[item.prop] || []"-->
    <!--:show-count="1"-->
    <!--/>-->
    <!--<hot-scale-->
    <!--v-if="item.hotScale"-->
    <!--:hot-scale="scope.row.hotScale || 0"-->
    <!--/>-->
    <!--<span-->
    <!--v-if="showProp(item)"-->
    <!--:style="{color: item.colorFn && item.colorFn(scope.row), background: item.backgroundFn && item.backgroundFn(scope.row)}"-->
    <!--&gt;-->
    <!--{{ item.labelFn ? item.labelFn(scope.row) : scope.row[item.prop] }}-->
    <!--</span>-->
    <!--</template>-->
    <!--</gs-table-column>-->

    <gs-table-column
      v-for="(item, index) in tableConfig.columns"
      :key="index"
      :width="item.width"
      :min-width="item.minWidth"
      :prop="item.prop"
      :label="item.label"
      :render-header="tableConfig.renderHeader"
      :show-overflow-tooltip="!item.notShowTip"
      :data-align="item.align"
    >
      <template slot-scope="scope">
        <gs-table-tags v-if="item.tag" :tags="scope.row[item.prop] || []" :show-count="1" />
        <hot-scale v-if="item.hotScale" :hot-scale="scope.row.hotScale || 0" />
        <span
          v-if="showProp(item)"
          :style="{color: item.colorFn && item.colorFn(scope.row), background: item.backgroundFn && item.backgroundFn(scope.row)}"
        >{{ item.labelFn ? item.labelFn(scope.row) : scope.row[item.prop] }}</span>
      </template>
    </gs-table-column>

    <gs-table-column
      v-if="tableConfig.operList && tableConfig.operList.length"
      :label="tableConfig.operThText || '操作'"
      :width="tableConfig.operList.length === 1 ? '80' : tableConfig.operWidth"
    >
      <template slot-scope="scope">
        <gs-button
          v-for="(oper, index) in tableConfig.operList"
          :key="index"
          type="text"
          class="table-options"
          @click="oper.event(scope.row, scope.$index)"
        >{{ oper.label ? oper.label: oper.labelFn(scope.row) }}</gs-button>
      </template>
    </gs-table-column>
  </gs-table>
</template>

<script>
import hotScale from './hotScale.vue'

export default {
  name: 'BaseTable',
  components: {
    hotScale
  },
  props: {
    tableConfig: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  watch: {},
  mounted () {
  },
  methods: {
    showProp (item) { // 没有tag 没有hotScale 则显示prop
      return !(item.tag || item.hotScale)
    },
    getFileType (fileName) {
      let extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()

      let word = ['doc', 'docx', 'docm', 'dotx', 'dotm']
      let ppt = ['ppt', 'pptx', 'pptm', 'ppsx', 'ppam']
      let excel = ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam']

      if (word.indexOf(extension) > -1) {
        return `gs-icon-word`
      } else if (ppt.indexOf(extension) > -1) {
        return `gs-icon-powerpoint`
      } else if (excel.indexOf(extension) > -1) {
        return `gs-icon-excel`
      } else {
        return `gs-icon-${extension}`
      }
    }
  }
}
</script>
