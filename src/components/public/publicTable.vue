<template>
  <div class="public-table-component">
    <gs-table
      :data="showData"
      :stripe="false"
      class="public-table"
    >
      <gs-table-column
        v-for="(item, index) in tableItems"
        :label="item.label"
        :key="index"
        :width="item.width || 80"
      >
        <template slot-scope="scope">
          {{ scope.row[item.prop] }}
        </template>
      </gs-table-column>
    </gs-table>
    <gs-pagination
      :current="pagination.currentPage"
      :page-size="pagination.currentSize"
      :page-sizes="pagination.sizeArray"
      :total="tableData.length"
      style="margin-top:20px"
      layout="pagesizes,pager"
      @page-size-change="sizeChange"
      @page-change="beforeJump"
    />
  </div>
</template>
<script>
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
    }
  },
  data () {
    return {
      pagination: {
        currentSize: 10,
        currentPage: 1,
        sizeArray: [5, 10, 15]
      }
    }
  },
  computed: {
    showData () {
      return this.tableData.slice((this.pagination.currentPage - 1) * this.pagination.currentSize, this.pagination.currentPage * this.pagination.currentSize)
    }
  },
  watch: {

  },
  methods: {
    sizeChange (size) {
      this.pagination.currentPage = 1
      this.pagination.currentSize = size
    },
    beforeJump (page) {
      this.pagination.currentPage = page
    }
  }
}
</script>
