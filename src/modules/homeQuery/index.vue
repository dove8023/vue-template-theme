<template>
  <div class="home-query-container hidden-height">
    <div class="content-layout-container scroll-container customer">
        <noViewAuth v-if="!pageAuth.view" />
        <div v-else class="query-module-container">
          <gs-loading v-if="loading" text="加载中…" />

          <div v-else>
            <query-form
              :page-auth="pageAuth"
              :query-form.sync="queryForm"
              :similar-push-obj="similarPushObj"
            />
            <query-list
              :page-auth="pageAuth"
              :query-form="queryForm"
              :similar-push-obj="similarPushObj"
            />
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import QueryForm from './components/queryForm.vue'
import QueryList from './components/queryListNew.vue'
import noViewAuth from '../../components/public/noViewAuth.vue'
import { mapGetters } from 'vuex'
import { getPageAuth } from '../../utils/comUtils'

export default {
  components: {
    QueryForm,
    QueryList,
    noViewAuth
  },
  data () {
    return {
      queryForm: {
        queryMode: true
      },
      similarPushObj: { searchTag: '', searchType: 0 },
      loading: false,
      pageAuth: {
        view: false,
        download: false,
        result_query: false
      }
    }
  },
  computed: {
    ...mapGetters(['resourceGroup'])
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let auth = getPageAuth(this.resourceGroup, this.$route.path)
      this.pageAuth = { ...this.pageAuth, ...auth }
      this.pageAuth.result_query = false // 代码直接屏蔽在结果中搜索
    }
  }
}
</script>
