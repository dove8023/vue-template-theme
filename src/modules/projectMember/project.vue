<template>
  <div class="project-contain">
    <p>我的项目</p>
    <div class="project-content">
      <section class="header-setting">
        <gs-button type="primary">添加用户</gs-button>
        <gs-search
          :placeholder="searchTip"
          :width="327"
          v-model="searchValue"
          class="header-setting-search"
          @search="userSearch"
          @clear="getUserList"
        >
          <template slot="prepend">
            <gs-select v-model="prependValue">
              <gs-option
                v-for="(item,i) in preOptions"
                :key="i + '-' + item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value"
              />
            </gs-select>
          </template>
        </gs-search>
      </section>

      <section class="table-contain">
        <gs-tables
          v-loading="loading"
          :data="projectData"
          :pagination.sync="pagination"
          paging
          @page-change="pageChange"
          @size-change="sizeChange"
        >
          <gs-tables-column label='项目名称' prop='name'>
            <template slot-scope="row">
              <a>{{ row.name }}</a>
            </template>
          </gs-tables-column>
          <gs-tables-column label='描述' prop='desc' />
          <gs-tables-column label='创建人' prop='creator' />
          <gs-tables-column label='创建时间' prop='create_time' />
          <gs-tables-column label='操作'>
            <template slot-scope="row">
              <gs-button type="text-primary">修改</gs-button>
              <gs-button type="text-primary">删除</gs-button>
            </template>
          </gs-tables-column>
        </gs-tables>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      searchValue: '',
      prependValue: 'name',
      preOptions: [
        {
          label: "项目名称",
          value: "name"
        },
        {
          label: "创建人",
          value: "creator"
        }
      ],
      pagination: {
        total: 1,
        current: 1,
        pageSize: 10,
        pageSizes: [5, 10, 15],
        layout: 'pagesizes,total,totalpage,pager,jumpbtn'
      },
      projectData: []
    }
  },
  computed: {
    searchTip: function () {
      for (let val of this.preOptions) {
        if (val.value === this.prependValue) {
          return '请输入' + val.label
        }
      }
    }
  },
  methods: {
    userSearch () {

    },
    getUserList () {

    },
    pageChange () {

    },
    sizeChange () {

    }
  }
}
</script>

<style lang="scss">
  .project-contain {
    padding: 24px;
    .project-content {
      padding: 20px;
      .header-setting {
        .header-setting-search {
          float: right;
          .gs-select-wrap {
            width: 90px;
          }
        }
      }

      .table-contain {
        margin: 20px 0;
      }
    }
  }
</style>