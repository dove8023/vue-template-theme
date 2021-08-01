<template>
  <div class="simple-query-mode-container">
    <div
      class="query-group-form"
    >
      <fix-right-auto-left :width="60">
        <!--检索条件输入框-->
        <div slot="left">

          <fix-left-auto-right :width="100">

            <!--检索条件类型选择-->
            <div slot="left">
              <gs-select
                :value="queryTypeVal"
                class="query-type-select"
                @change="queryTypeChange"
              >
                <gs-option
                  v-for="item in queryType"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </gs-select>
            </div>

            <!--条件输入-->
            <!--:datalist="queryValList"-->
            <!--:input-search="onRemoteSearch"-->

            <div slot="right">
              <gs-search
                v-if="!isQueryDateType"
                v-model="queryVal"
                :loading="queryLoading"
                placeholder="请输入检索内容"
                class="query-text"
                @keyup.enter.native="resSearch"
                @search="resSearch"
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
          </fix-left-auto-right>
        </div>
        <!--检索按钮-->
        <div slot="right">
          <gs-button
            v-if="false"
            type="default"
            class="query-btn res-query-btn"
            @click="addQueryTag"
          >在结果中检索
          </gs-button>
        </div>
      </fix-right-auto-left>

    </div>
  </div>
</template>

<script>
  import FixLeftAutoRight from '@/components/public/fixLeftAutoRight'
  import FixRightAutoLeft from '@/components/public/fixRightAutoLeft'
  import DateInterval from '@/components/public/dateInterval'
  import { dd } from "@/utils/setting"
  //  import QueryService from '@/service/queryService'

  export default {
    components: {FixLeftAutoRight, FixRightAutoLeft, DateInterval},
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
        queryType: dd.queryType,
        queryTypeVal: 0,
        queryVal: '',
        queryTagList: [],
        startDate: '',
        endDate: '',
        isQueryDateType: false,
        searchTimer: null,
        timerInterval: 10,
        queryValList: [],
        queryLoading: false
      }
    },
    watch: {
      searchRandom: function (newVal) {
        var me = this
        me.queryVal = ''
        me.resSearch()
      },
      'similarPushObj.searchTag': {
        handler (newVal) {
          var me = this
          if (newVal) {
            me.queryVal = newVal
            me.queryTypeVal = me.filterQueryTypeValByData(me.similarPushObj.searchType)
            me.resSearch()
          }
        }
      }
    },
    mounted () {
      this.queryTagList = this.queryTagListObj.queryTagList
    },
    methods: {
//      综合 全文 关键字等检索范围的切换
      queryTypeChange (queryType) {
        var me = this

        me.queryTypeVal = queryType

        me.isQueryDateType = (queryType === 6)
      },

      // 添加检索条件tag
      addQueryTag () {
        var me = this

        var queryType = me.filterQueryType(me.queryTypeVal)

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
                name: queryType.label + '：' + me.queryVal,
                typeKey: queryType.key,
                typeLabel: queryType.label,
                typeData: queryType.data,
                queryText: me.queryVal,
                uid: +(new Date())
              })
            }

            me.search()
          }
        } else {
          me.queryTagList = []
          me.queryTagList.push({
            name: queryType.label + '：' + me.queryVal,
            typeKey: queryType.key,
            typeLabel: queryType.label,
            typeData: queryType.data,
            queryText: me.queryVal,
            uid: +(new Date())
          })
          me.search()
        }
      },

      filterQueryTypeValByData (data) {
        var me = this

        var findType = me.queryType.find(function (item) {
          return item.data === data
        })

        return (findType && findType.key) || 0
      },

      // 获取检索类型
      filterQueryType (key) {
        var me = this

        var findType = me.queryType.find(function (item) {
          return item.key === key
        })

        return findType
      },
      // emit
      search () {
        var me = this

        clearTimeout(me.searchTimer)

        me.searchTimer = setTimeout(function () {
          me.$emit('search', me.queryTagList)
        }, me.timerInterval)
      },
      // 点击检索按钮的事件
      resSearch () {
        var me = this

        me.queryTagListObj.queryTagList = []

        me.queryTagList = me.queryTagListObj.queryTagList

        setTimeout(function () {
          me.addQueryTag()
        }, 10)
      }
    }
  }
</script>
