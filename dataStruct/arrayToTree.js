// 原始无序数组数据
const arr = [     
  { id: 6, name: '部门6', pId: 3 },
  { id: 2, name: '部门2', pId: 1 },
  { id: 3, name: '部门3', pId: 1 },
  { id: 4, name: '部门4', pId: 2 },
  { id: 1, name: '公司总部', pId: 0 },
  { id: 5, name: '部门5', pId: 3 },
]

// 每个对象都有一个id（自身标识）和pId（父级标识）
// pId为0或null的节点通常是根节点（如例子中的公司总部）
// 其他节点通过pId指向其父节点

console.log('原始无序数组:');
console.log(arr);

// 方法一：使用filter和对象引用
// 利用了对象引用类型，浅拷贝
// 缺点: 改变了 arr
function arrTranslateTree(arr) {
  // 创建数组副本以避免修改原数组
  let arrCopy = JSON.parse(JSON.stringify(arr));
  let data = arrCopy.filter(item => {
    item.children = arrCopy.filter(e => {
      return item.id === e.pId
    })
    return !item.pId
  })
  return data
}

// 方法二：使用映射表
function arrToTree(arr) {
  // 建立id到节点的映射
  let data = {}
  const res = []

  for(let i in arr) {
    data[arr[i].id] = arr[i]
  }
  
  arr.forEach(item => {
    if(data[item.pId]) {
      if (!data[item.pId].children) data[item.pId].children = []
      data[item.pId].children.push(item)
    } else {
      res.push(item)
    }
  })
  return res
}

// 方法三：递归实现
function arrToTreeRecursive(arr) {
  // 找到根节点
  const rootNodes = arr.filter(item => !item.pId || item.pId === 0);
  
  // 递归查找子节点
  function findChildren(node) {
    const children = arr.filter(item => item.pId === node.id);
    if (children.length > 0) {
      node.children = children;
      children.forEach(child => findChildren(child));
    }
    return node;
  }
  
  return rootNodes.map(node => findChildren(node));
}

console.log('\n方法一结果 (arrTranslateTree):');
console.log(JSON.stringify(arrTranslateTree(arr), null, 2));

console.log('\n方法二结果 (arrToTree):');
console.log(JSON.stringify(arrToTree(arr), null, 2));

console.log('\n方法三结果 (arrToTreeRecursive):');
console.log(JSON.stringify(arrToTreeRecursive(arr), null, 2));