var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
var chnUnitChar = ['', '十', '百', '千']

let colorArr = ['#FFE094', '#528EA7', '#237FBB', '#295F75', '#F15057', '#FCB500', '#FFE094']

let commonFunc = {

  SectionToChinese(section: number) {
    var strIns = ''
    var chnStr = ''
    var unitPos = 0
    var zero = true

    while (section > 0) {
      var v = section % 10

      if (v === 0) {
        if (!zero) {
          zero = true

          chnStr = chnNumChar[v] + chnStr
        }
      } else {
        zero = false

        strIns = chnNumChar[v]

        var temp = chnUnitChar[unitPos]

        if (strIns === '一' && temp === '十') {
          strIns = temp
        } else {
          strIns += temp
        }

        chnStr = strIns + chnStr
      }

      unitPos++

      section = Math.floor(section / 10)
    }
    return chnStr
  },
  NumberToChinese(num: number) {
    var unitPos = 0
    var strIns = ''
    var chnStr = ''
    var needZero = false

    if (num === 0) {
      return chnNumChar[0]
    }

    while (num > 0) {
      var section = num % 10000

      if (needZero) {
        chnStr = chnNumChar[0] + chnStr
      }

      strIns = this.SectionToChinese(section)

      strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]

      chnStr = strIns + chnStr

      needZero = (section < 1000) && (section > 0)

      num = Math.floor(num / 10000)

      unitPos++
    }

    return chnStr
  },
  getCategoryColor(category: number) {
    return category > 6 ? colorArr[0] : colorArr[category]
  },
  getValueByLen(value: string, len: number) {
    return value.length > len ? value.substr(0, len) + '…' : value
  }
}

export default commonFunc
