<template>
  <div class="custom-select-wrap">
    <div class="left">
      <div class="title bold">所有成员</div>
      <gs-search :datalist="list" :matcher="matcher" class="full" placeholder="搜索" />
      <div v-if="filterList.length === 0" class="no-member">没有搜索结果</div>
      <template v-else>
        <gs-checkbox
          :disabled="noData"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="onChange"
        >全选</gs-checkbox>
        <gs-scrollbar :wrap-style="{ 'height': '300px' }">
          <gs-checkbox-group v-model="selectedList">
            <gs-checkbox v-for="item in filterList" :label="item" :key="item">{{ item }}</gs-checkbox>
          </gs-checkbox-group>
        </gs-scrollbar>
      </template>
    </div>
    <div class="right">
      <div class="title">已选择{{ selectedList.length }}项</div>
      <gs-search :datalist="selectedList" :matcher="selectedMatcher" class="full" placeholder="搜索" />
      <div v-if="selectedFilterList.length === 0" class="no-member">左侧选择成员</div>
      <gs-scrollbar v-else :wrap-style="{ 'height': '330px' }">
        <div v-for="item in selectedFilterList" :key="item" class="selected-item">
          <span style="cursor: pointer;">{{ item }}</span>
          <i class="gs-icon-close" @click="deleteItem(item)" />
        </div>
      </gs-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      filterList: [], // 左侧过滤的列表
      selectedList: [], // 选中的列表
      selectedFilterList: [] // 选中过滤列表
    }
  },
  computed: {
    noData () {
      return this.list.length === 0
    }
  },
  watch: {
    selectedList (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update', newVal)
        let allListLen = this.list.length
        let status = (newVal.length !== allListLen) || this.noData
        this.checkAll = !status
        // 至少有一个选中值
        if (status && newVal.length > 0) {
          this.isIndeterminate = true
        } else { // 没有选中值或者是全选中
          this.isIndeterminate = false
        }
      }
    }
  },
  methods: {
    /**
     * 过滤所有的表格数据
     */
    matcher (value, list) {
      this.filterList = list.filter((data) => data.includes(value || ''))
    },

    /**
     *  过滤右侧选中数据
     */
    selectedMatcher (value, list) {
      this.selectedFilterList = list.filter((data) => data.includes(value || ''))
    },

    /**
     * 全选checkbox的值变化
     */
    onChange () {
      // 全选
      if (this.checkAll) {
        // 此处全选是所有的表,暂时修改为过滤的表
        this.selectedList = this.filterList
      } else {
        this.selectedList = []
      }
    },

    /**
     * 右侧点击删除
     * */
    deleteItem (row) {
      let selected = this.selectedList
      let index = selected.findIndex(item => item === row)
      let arr = JSON.parse(JSON.stringify(selected))
      arr.splice(index, 1)
      this.selectedList = arr
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-select-wrap {
  display: flex;
  justify-content: space-between;
  background: #fff;

  .title {
    margin-bottom: 15px;

    &.bold {
      font-weight: bold;
    }
  }

  .left,
  .right {
    flex: 1;
    padding: 20px;

    .no-member {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 330px;
      opacity: 0.25;
      font-size: 14px;
      color: #000000;
    }

    .gs-search.full {
      width: 100%;
    }
  }

  .left {
    border-right: 1px solid #d9d9d9;
    padding-right: 20px;

    .gs-scrollbar {
      height: 300px !important;
    }
  }

  .right {
    margin-left: 0;
    padding-left: 20px;

    .selected-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      height: 30px;
      padding-left: 10px;
      font-size: 12px;
      color: #000000;
      opacity: 0.85;

      .gs-icon-close {
        display: none;
        cursor: pointer;
        position: absolute;
        right: 8px;
        top: 0;
        line-height: 30px;
      }

      &:hover {
        background-color: #ecf2fe;

        .gs-icon-close {
          display: block;
          // color: $primary-color;
          color: #0073E8;
        }
      }
    }

    .gs-scrollbar {
      height: 330px !important;
    }
  }
}

.custom-select-wrap {
  border: 1px solid #d9d9d9;

  .gs-checkbox-group {
    display: block;
  }

  label.gs-checkbox {
    display: flex;
    align-items: center;
    height: 30px;
    margin-left: 0 !important;
  }
  .gs-scrollbar-wrap {
    overflow-x: hidden;
  }
}
</style>
