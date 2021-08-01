import { dd } from "@/utils/setting"

export default {
  getFields () {
    var fields = []

    dd.complexQueryType.map(function (item) {
      fields.push({
        label: item.label,
        field: item.field,
        type: item.type,
        operators: [
          {
            label: '等于',
            operator: 'equal',
            key: 0
          },
          {
            label: '不含',
            operator: 'notIn',
            key: 2
          },
          {
            label: '包含',
            operator: 'in',
            key: 1
          }
        ]
      })
    })

    return fields
  }
}

