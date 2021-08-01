<template>
  <div>
    <gs-popover
      ref="popover"
      :width="200"
      placement="top"
      trigger="hover"
      supernatant
      class="member-table-popver"
    >
      <p>共{{ row.project_number }}个项目</p>
      <ul>
        <li v-for=" (val,index) in row.project_infos" :key="index">{{ val.project_name }}</li>
      </ul>
    </gs-popover>
    <div class="member-table-tooltips">
      <span v-popover:popover class="member-table-tooltips-text">{{ authorityArr.toString() }}</span>
      <span>共 {{ row.project_number }} 个</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => { }
    },
    index: {
      type: Number,
      default: null
    }
  },
  computed: {
    authorityArr () {
      let arr = []
      for (let val of this.row.project_infos) {
        arr.push(val.project_name)
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
.member-table-popver {
  &.gs-popover {
    padding: 16px !important;
    ul {
      margin-top: 5px;
      li {
        padding: 10px 0 0 0;
      }
    }
  }
  .member-table-tooltips {
    display: flex;
    .member-table-tooltips-text {
      max-width: 50px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
