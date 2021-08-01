<template>
  <div class="complex-query-mode-container">
    <filters
      v-model="filterValue"
      :fields="fields"
      @toggle-operator="filterChange"
      @filter-change="filterChange"
      @remove-filter="filterChange"
      @remove-group="filterChange"
    />

    <div class="filter-text">
      <p>{{ filterStr }}</p>
      <!--<p>{{ filterSearchStr }}</p>-->
    </div>

    <div class="btn-group">
      <gs-button
        type="primary"
        @click="search"
      >检 索
      </gs-button>
    </div>
  </div>
</template>

<script>
  import {Filters} from '@components/filters'
  import '@components/filters/lib/style/index.css'
  import { dd } from "@/utils/setting"

  import moment from 'moment'

  export default {
    components: {Filters},
    data () {
      let fields = []

      dd.complexQueryType.map(function (item) {
        fields.push({
          label: item.label,
          field: item.field,
          type: item.type,
          operators: [
//            {
//              label: '等于',
//              operator: 'equal',
//              key: 0
//            },
            {
              label: '不含',
              operator: 'not_contain', // notIn
              key: 2
            },
            {
              label: '包含',
              operator: 'contain', // in
              key: 1
            }
          ]
        })
      })

      return {
        fields,
        filterValue: {
          operator: 'and',
          filters: [
            {
              field: '',
              operator: '',
              value: ''
            }
          ]
        },
        filterStr: '',
        filterSearchStr: ''
      }
    },
    methods: {
      filterChange () {
        var me = this

        var filterStr = me.formatFilterValue(me.filterValue, 'label', 'label', false)

        me.filterStr = filterStr
        me.filterSearchStr = me.formatFilterValue(me.filterValue, 'field', 'operator', true)
      },
      formatFilterValue (filterValue, fieldType, findOperatorType, operatorBool) {
        var me = this
        var filterArray = []

        var operator = filterValue.operator || ''
        var filters = filterValue.filters || []

        if (operator && filters.length > 0) {
          filters.map(function (item) {
            if (item.filters && item.filters.length > 0) {
              filterArray.push('( ' + me.formatFilterValue(item, fieldType, findOperatorType, operatorBool) + ' )')
            } else {
              if (item.field) {
                var findField = me.fields.find(function (field) {
                  return field.field === item.field
                })

                if (findField && item.operator) {
                  var findOperator = findField.operators.find(function (oper) {
                    return oper.operator === item.operator
                  })

                  if (findOperator && item.value) {
                    var val = item.value

                    if (findField.type === 'date-range') {
                      val = moment(item.value[0]).format('YYYY-MM-DD') + '~' + moment(item.value[1]).format('YYYY-MM-DD')
                    }

                    filterArray.push(findField[fieldType] + ' ' + (findOperator[findOperatorType] || '') + ' ' + (val || ''))
                  }
                }
              }
            }
          })
        }

        return filterArray.join(' ' + (operatorBool ? operator : (operator === 'and' ? '并且' : '或者')) + ' ')
      },

      search () {
        var me = this
//        me.$emit('search', me.filterValue)
        me.$emit('search', me.filterSearchStr)
      }
    }
  }
</script>
