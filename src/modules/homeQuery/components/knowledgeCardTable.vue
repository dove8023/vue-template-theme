<template>
  <div
    class="knowledge-card-container margin-top16 "
  >
    <h3 class="title">相关知识</h3>

    <h5 class="table-title">{{ data.title }}</h5>
    <div
      v-if="data && data.list && data.list.length > 0"
      class="knowledge-card-table scroll-container"
    >
      <gs-table
        :data="data && data.list"
        :show-header="false"
        :stripe="false"
      >
        <gs-table-column
          prop="label"
          class-name="text-right"
        />
        <gs-table-column
          prop="value"
        />
      </gs-table>
    </div>
    <div
      v-else
    >
      未检索到相关知识
    </div>

  </div>
</template>

<script type="es6">

  import service from '../../../service/queryService'

  export default {
    name: 'KnowledgeCard',
    components: {},
    props: {
      para: {
        type: Object,
        required: true
      },
      pageAuth: {
        type: Object
      }
    },
    data () {
      return {
        data: {
          title: '',
          list: []
        }
      }
    },
    computed: {},
    watch: {
      'para.sentence' () {
        this.getCardTable()
      }
    },
    mounted () {
      this.getCardTable()
    },
    methods: {
      getCardTable () {
        if(!this.pageAuth.result_query){
          return false
        }
        const me = this
        if (me.para.sentence !== '') {
          service.getCardTable(me.para)
            .then(
              res => {
                if (res && res.data) {
                  me.data = res.data
                } else {
                  me.$Message.error('获取知识卡片数据出错')
                }
              },
              err => {
                me.$Message.error(err.errorMessage || '获取知识卡片数据出错')
              }
            ).catch(
            res => {
              me.$Message.error(res.message || '获取知识卡片数据出错')
            }
          )
        } else {
          me.data.title = ''
          me.data.list = []
        }
      }
    }
  }
</script>
