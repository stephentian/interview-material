// 深拷贝

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
}