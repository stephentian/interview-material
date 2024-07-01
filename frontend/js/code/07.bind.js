/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-5
**/

// bind
// 2024-07-01
const bind = function(context, ...args) {
  return (...args2) => {
    return this.apply(context, args.concat(args2))
  }
}

// ES5

function myBind(context) {
  let self = this
  let args1 = [].slice.call(arguments, 1)
  let argArr = []
  for (let i = 0; i < args1.length; i++) {
    argArr.push('args1[' + i + ']')
  }
  return function () {
    for (let i = 0; i < arguments.length; i++) {
      argArr.push('arguments[' + i + ']')
    }
    context.fn = self
    let result = eval('context.fn(' + argArr + ')')
    delete context.fn
    return result
  }
}


// ES6

function myBind2(obj, ...arg1) {
  return (...arg2) => {
    return this.apply(obj, arg1.concat(arg2))
  }
}

function myBind3(obj, ...arg1) {
  return (...arg2) => {
    obj.fn = this
    let result = obj.fn(arg1.concat(arg2))
    delete obj.fn
    return result
  }
}
