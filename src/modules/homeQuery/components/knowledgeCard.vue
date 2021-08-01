<template>
  <div
    class="knowledge-card-container"
  >
    <h3 class="title">知识卡片</h3>
    <template
      v-if="data.length > 0"
    >
      <div
        v-for="(item, index) in data"
        :key="index"
        class="img-card-wrapper"
      >
        <img
          :src="getImgUrl(item.url)"
          class="card-img"
        >
        <div class="card-img-txt">
          <p class="card-img-title">
            {{ item.title }}
          </p>
          <div class="card-img-opr">
            <span
              class="card-img-opr-view"
              @click="viewImg(item.url)"
            >
              查看大图
            </span>
            <span
              class="card-img-opr-download"
              @click="downloadImg(item.url)"
            >
              下载原图
            </span>
          </div>
        </div>
      </div>
    </template>
    <div
      v-else
    >
      未检索到相关卡片知识
    </div>

    <!-- 展示大图 -->
    <gs-modal
      v-model="cardImgModal.visible"
      :show-cancel="false"
      :show-confirm="false"
      class="card-img-modal"
      width="800px"
      title="知识卡片大图"
      @cancel="close"
    >
      <img
        :src="curImgUrl"
        class="card-big-img"
      >
    </gs-modal>
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
        cardImgModal: {
          visible: false
        },
        curImgUrl: '',
        data: []
      }
    },
    computed: {},
    watch: {
      'para.sentence' () {
        this.getCardImg()
      }
    },
    mounted () {
      this.getCardImg()
    },
    methods: {
      getCardImg () {
        if(!this.pageAuth.result_query){
          return false
        }
        const me = this
        me.data = []
        if (me.para.sentence !== '') {
          service.getCardPhoto(me.para)
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
        }
      },
      getImgUrl (url) {
        return window.epApp.configs.urlPrefix.queryApi + url
      },
      viewImg (url) {
        this.curImgUrl = this.getImgUrl(url)
        this.cardImgModal.visible = true
      },
      downloadImg (url) {
        service.downloadImg(url)
      },
      close () {
        this.cardImgModal.visible = false
        this.curImgUrl = ''
      }
    }
  }
</script>
