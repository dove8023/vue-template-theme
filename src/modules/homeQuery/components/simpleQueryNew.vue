<template>
  <div class="simple-query-mode-container">
    <div
      class="query-group-form"
    >
      <fix-right-auto-left :width="60">

        <!--检索条件输入框-->
        <div slot="left">

          <gs-search
            v-if="!isQueryDateType"
            v-model="queryVal"
            :loading="queryLoading"
            placeholder="请输入检索内容"
            class="query-text"
            @keyup.enter.native="resSearch"
          />

          <div
            v-if="isQueryDateType"
            class="query-date-form"
          >
            <date-interval
              :start.sync="startDate"
              :end.sync="endDate"
            />
          </div>
        </div>

        <!--检索按钮-->
        <div slot="right">
          <gs-button
            type="primary"
            class="query-btn "
            @click="resSearch"
          >检索
          </gs-button>

          <gs-button
            v-if="false"
            type="default"
            class="query-btn res-query-btn"
          >在结果中检索
          </gs-button>
        </div>
      </fix-right-auto-left>

    </div>

    <!-- 展示检索条件 -->
    <div
      v-if="false"
      class="query-form-list text-left"
    >
      <fix-left-auto-right :width="64">
        <span slot="left">检索条件</span>
        <span slot="right">
          <gs-tag
            v-for="(tag, i) in queryTagList"
            :key="tag.uid"
            label-max-width="120"
            closable
            class="query-tag"
            @close="closeTag(i)"
          >
            {{ tag.name }}
          </gs-tag>

          <span
            v-if="queryTagList.length > 0"
            class="pointer primary-text"
            @click="cleanTag"
          >清除所有</span>
        </span>
      </fix-left-auto-right>
    </div>

  </div>
</template>

<script>
  import FixLeftAutoRight from '../../../components/fixLeftAutoRight'
  import FixRightAutoLeft from '../../../components/fixRightAutoLeft'
  import DateInterval from '../../../components/dateInterval/dateInterval'

  export default {
    components: {
      FixLeftAutoRight,
      FixRightAutoLeft,
      DateInterval
    },
    props: {
      queryTagListObj: {
        type: Object,
        required: true
      },
      searchRandom: {
        type: Number,
        required: true
      },
      similarPushObj: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        queryVal: '',
        queryTagList: [],
        startDate: '',
        endDate: '',
        isQueryDateType: false,
        searchTimer: null,
        timerInterval: 1000,
        queryValList: [],
        queryLoading: false
      }
    },
    watch: {
      searchRandom: function (newVal) {
        var me = this
        me.search()
      },
      'similarPushObj.searchTag': {
        handler (newVal) {
          var me = this
          if (newVal) {
            me.queryVal = newVal
            me.resSearch()
          }
        }
      }
    },
    mounted () {
      this.queryTagList = this.queryTagListObj.queryTagList
    },
    methods: {
      addQueryTag () {
        var me = this

        var queryType = {
          data: 'key_words',
          key: 2,
          label: '关键词'
        }

        if (queryType && me.queryVal.replace(/\s/g, '') !== '') {
          var findTag = me.queryTagList.find(function (item) {
            if (me.isQueryDateType) {
              return item.typeKey === queryType.key &&
                item.queryText[0] === me.startDate &&
                item.queryText[1] === me.endDate
            } else {
              return item.typeKey === queryType.key &&
                item.queryText.replace(/\s/g, '') === me.queryVal.replace(/\s/g, '')
            }
          })

          if (!findTag) {
            if (me.isQueryDateType) {
              me.queryTagList.push({
                name: queryType.label + '：' + me.startDate + '~' + me.endDate,
                typeKey: queryType.key,
                typeLabel: queryType.label,
                typeData: queryType.data,
                queryText: [me.startDate, me.endDate],
                uid: +(new Date())
              })
            } else {
              me.queryTagList.push({
                name: me.queryVal,
                typeKey: queryType.key,
                typeLabel: queryType.label,
                typeData: queryType.data,
                queryText: me.queryVal,
                uid: +(new Date())
              })
            }

            me.search()
          }
        }
      },

      closeTag (index) {
        var me = this

        me.queryTagList.splice(index, 1)

        me.search()
      },
      cleanTag () {
        var me = this

        me.queryTagList = []

        me.search()
      },

      search () {
        var me = this

        clearTimeout(me.searchTimer)

        me.searchTimer = setTimeout(function () {
          me.$emit('search', me.queryTagList)
        }, me.timerInterval)
      },
      resSearch () {
        var me = this

        me.queryTagListObj.queryTagList = []

        me.queryTagList = me.queryTagListObj.queryTagList

        setTimeout(function () {
          me.addQueryTag()
        }, 500)
      }
    }
  }
</script>
