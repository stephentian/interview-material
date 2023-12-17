/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-12
**/

// new

function myNew1(obj) {
  let subObj = {}
  subObj.__proto__ = obj.prototype
  // 让 this 指向新的对象
  let res = obj.call(subObj)
  return typeof res === 'object' ? res : subObj
}

function myNew2() {
  let obj = {}
  // 拿到构造函数, 删除数组第一项，并返回删除项
  let fn = [].shift.call(arguments)
  obj.__proto__ = fn.prototype
  let res = fn.apply(obj, arguments)
  return typeof res === 'object' ? res : subObj
}
