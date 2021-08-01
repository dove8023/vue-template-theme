/**
 * @method--通过树形结构子节点遍历获取(已选+半选中)状态下节点key值集合
 */
export const filterTreeKeys = function(nodes) {
  let set = new Set()
  let getParentFunc = function(node) {
    set.add(node.$node.key)
    if (node.$node.parentKey && !set.has(node.$node.parentKey)) {
      getParentFunc(node.$node.parent)
    } else {
      return null
    }
  }
  nodes.forEach(item => {
    getParentFunc(item)
  })
  return [...set]
}

export const trvalLevel = function(item) {
  let levelName = []
  while (item) {
    levelName.push(item.data.name)
    item = item.$node.parent
  }
  levelName.reverse()
  levelName = levelName.join('/')
  return levelName
}   // 遍历得出节点当前存在的层级
