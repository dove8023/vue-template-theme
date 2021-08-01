import moment from 'moment'
import FormatFields from './formatFields'

var fields = FormatFields.getFields()

export default {
  formatParam (param) {
    var me = this

    var formatForm = {}

    var filter = null
    var paging = null
    var order = null

    if (param.queryForm) {
      if (param.queryForm.filter && param.queryForm.filter['operator']) {
        filter = me.formatFilterValue(param.queryForm.filter)
      } else if (param.queryForm.filter && param.queryForm.filter[0]) {
        filter = {
          contact_type: 1,
          children: []
        }

        filter.children = param.queryForm.filter.map(function (item) {
          return {
            filter_on: item.typeData,
            filter_values: item.queryText,
            filter_type: 1
          }
        })
      }

      if (param.queryForm.groupForm) {
        var groupForm = param.queryForm.groupForm

        if (!filter) {
          filter = {
            contact_type: 1,
            children: []
          }
        }

        for (var attr in groupForm) {
          if (groupForm[attr].type) {
            filter.children.push({
              filter_on: groupForm[attr].type,
              filter_values: (groupForm[attr].groupType && groupForm[attr].groupType === 'date-range' ? groupForm[attr].formatKey : groupForm[attr].key),
              filter_type: (groupForm[attr].groupType && groupForm[attr].groupType === 'date-range' ? 3 : 0)
            })
          }
        }
      }
    }

    if (filter && filter.children.length > 0) {
      formatForm.filter = filter
    }

    if (param.pageSize) {
      paging = {
        page_size: param.pageSize,
        page_index: param.pageIndex
      }

      formatForm.paging = paging
    }

    if (param.order) {
      order = {
        column: param.order.data || 'title',
        direction: 1
      }

      formatForm.order = order
    }

    return formatForm
  },
  formatFilterValue (filterValue) {
    var me = this

    var newFilter = {
      contact_type: filterValue.operator === 'and' ? 1 : 0,
      children: []
    }

    var operator = filterValue.operator || ''
    var filters = filterValue.filters || []

    if (operator && filters.length > 0) {
      filters.map(function (item) {
        if (item.filters && item.filters.length > 0) {
          newFilter.children.push(me.formatFilterValue(item))
        } else {
          if (item.field) {
            var findField = fields.find(function (field) {
              return field.field === item.field
            })

            if (findField && item.operator) {
              var findOperator = findField.operators.find(function (oper) {
                return oper.operator === item.operator
              })

              if (findOperator && item.value) {
                var val = item.value

                if (findField.type === 'date-range') {
                  val = [moment(item.value[0]).format('YYYY-MM-DD'), moment(item.value[1]).format('YYYY-MM-DD')]
                }
                newFilter.children.push({
                  filter_on: item.field,
                  filter_values: val,
                  filter_type: findOperator.key
                })
              }
            }
          }
        }
      })
    }

    return newFilter
  }
}
