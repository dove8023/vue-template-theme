<template>
  <div class="public-table-component">
    <gs-table :data="showData" stripe class="public-table" @selection-change="selectionChange">
      <gs-table-column v-if="tableDeal.isMultiManage" type="selection" />
      <gs-table-column
        v-for="(item, index) in tableItems"
        :label="item.label"
        :align="item.children?'center':'left'"
        :key="index"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            v-if="(!scope.row.showChange || item.prop==='fileName') && item.prop!=='analogyResult'"
          >{{ formatDate(item.prop, scope.row[item.prop]) }}</span>

          <gs-tooltip
            v-if="scope.row.showChange && item.prop!=='fileName' && item.prop!=='publishTime'"
            :append-to-body="true"
            placement="right"
            effect="light"
            popper-class="input-tooltip-popper"
          >
            <span>
              <gs-input v-model="scope.row[item.prop]" placeholder="多个并列词以分号隔开" />
              <i class="gs-icon-question-circle-o" />
            </span>
            <span slot="template" class="slot-title">多个并列词以分号隔开</span>
          </gs-tooltip>
          <gs-date-picker
            v-if="scope.row.showChange && item.prop==='publishTime'"
            v-model="scope.row[item.prop]"
            :append-to-body="true"
            format="YYYY-MM-DD"
            input-type="input"
            class="date-publish-time"
            style="width: 100%;"
            @change="change(scope.row, scope.row[item.prop])"
          />
          <span
            v-if=" item.prop==='analogyResult' && scope.row[item.prop]==='正常'"
            style="background-color:#009900;color:#ffffff"
          >{{ scope.row[item.prop] }}</span>
          <span
            v-if=" item.prop==='analogyResult' && scope.row[item.prop]==='偏大'"
            style="background-color:red;color:#ffffff"
          >{{ scope.row[item.prop] }}</span>
          <span
            v-if=" item.prop==='analogyResult' && scope.row[item.prop]==='偏小'"
            style="background-color:#990066;color:#ffffff"
          >{{ scope.row[item.prop] }}</span>
        </template>

        <div v-if="item.children">
          <gs-table-column v-for="(i, iindex) in item.children" :label="i.label" :key="iindex">
            <template slot-scope="scope">{{ scope.row[i.prop] }}</template>
          </gs-table-column>
        </div>
      </gs-table-column>
      <gs-table-column v-if="tableDeal.isShow" label="操作">
        <template slot-scope="scope">
          <gs-button
            v-for="(i, iindex) in tableDeal.methods"
            :key="iindex"
            :disabled="i.disabledInfo && i.disabledInfo.status"
            :title="i.disabledInfo && i.disabledInfo.status?i.disabledInfo.title:''"
            type="text-primary"
            @click="i.callback(scope.row)"
          >{{ i.name }}</gs-button>
        </template>
      </gs-table-column>
    </gs-table>
    <gs-pagination
      :current="pagination.currentPage"
      :page-size="pagination.currentSize"
      :page-sizes="pagination.sizeArray"
      :total="pagination.total"
      style="margin-top:20px"
      layout="pagesizes,pager"
      @page-size-change="sizeChange"
      @page-change="beforeJump"
    />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'PublicTable',
  props: {
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableItems: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableDeal: {
      type: Object,
      default: function () {
        return {
          isShow: false,
          methods: []
        }
      }
    },
    pagination: {
      type: Object,
      default: function () {
        return {
          currentSize: 10,
          currentPage: 1,
          sizeArray: [5, 10, 15],
          total: 0
        }
      }
    }
  },
  data () {
    return {
      // pagination: {
      //   currentSize: 10,
      //   currentPage: 1,
      //   sizeArray: [5, 10, 15]
      // }
      showData: []
    }
  },
  computed: {
    // showData () {
    //   return this.tableData
    //   // return this.tableData.slice((this.pagination.currentPage - 1) * this.pagination.currentSize, this.pagination.currentPage * this.pagination.currentSize)
    // }
  },
  watch: {
    tableData: {
      handler () {
        this.showData = this.tableData
        this.showData.forEach((item) => {
          if (item.publishTime) {
            item.publishTimeStr = item.publishTime
            item.publishTime = this.getMomentObj(item.publishTime)
          }
        })
      }
    }
  },
  mounted () {
  },
  methods: {
    sizeChange (size) {
      this.pagination.currentPage = 1
      this.pagination.currentSize = size
    },
    beforeJump (page) {
      this.pagination.currentPage = page
    },
    selectionChange (selection) {
      this.$emit('selectionChange', selection)
    },
    getMomentObj (stringDate, formatter) {
      return moment.utc(stringDate, 'YYYY-MM-DD')
    },
    formatDate (prop, momentObj, row) {
      if (prop === 'publishTime' && momentObj === null) {
        return ''
      } else if (prop === 'publishTime' && typeof momentObj === 'object') {
        return momentObj.format('YYYY-MM-DD')
      } else {
        return momentObj
      }
    },
    change (row) {
      if (row.publishTime === '' || row.publishTime === null) {
        row.publishTimeStr = ''
      } else {
        row.publishTime = moment.utc(row.publishTime, 'YYYY-MM-DD')
        row.publishTimeStr = row.publishTime.format('YYYY-MM-DD')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gs-table.no-fixed td,
.gs-table.no-fixed th {
  padding: 0px;
}
</style>

