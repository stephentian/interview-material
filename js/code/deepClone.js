/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2023-04-25
 **/

// 深拷贝

// 一行代码的深拷贝
function cloneJSON(source) {
	return JSON.parse(JSON.stringify(source))
}
// 递归爆栈
// cloneJSON(createData(10000)); // Maximum call stack size exceeded
// 循环引用 报错
// cloneJSON(a) // Uncaught TypeError: Converting circular structure to JSON

// 生成指定深度和每层广度的代码
function createData(deep, breadth = 0) {
	var data = {}
	var temp = data

	for (var i = 0; i < deep; i++) {
		temp = temp['data'] = {}
		for (var j = 0; j < breadth; j++) {
			temp[j] = j
		}
	}

	return data
}
// createData(1, 2); // 1层深度，每层有2个数据 {data: {0: 0, 1: 1}}

function clone(target) {
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {}
    for (const key in target) {
      cloneTarget[key] = clone(target[key])
    }
    return cloneTarget
  } else {
    return target
  }
}



// 深拷贝优化
// 正则、时间类型处理
// 函数处理
// 循环引用问题

function deepClone(obj, hash= new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Date) return new Date(obj)
  if (typeof obj !== 'object') return obj
  if (hash.has(obj)) return hash.get(obj) // 处理循环引用

  const copy = new obj.constructor()
  hash.set(obj, copy)

  for (const key in obj) {
    // 原型链的值不拷贝
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key], hash)
    }
  }

  return copy
}