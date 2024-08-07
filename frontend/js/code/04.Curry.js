// 柯里化

// 1. 实现 add(1)(2)(3)

// 箭头函数

// const add = x => y => z => x + y + z;

// 支持以下功能
// add(1, 2, 3)
// add(1, 2)(3)
// add(1)(2, 3)

// 无限累加
// function add(...args) {
//   let sum = args.reduce((res, cur) => res + res)
//   return function (...next) {
//     return next.length ? add(sum, ...next) : sum
//   }
// }
// 最后需要调用，传入空参数触发

function curry(fn, ...args) {
  // fn.length 表示 fn 接收参数个数
  // 大于等于 接收参数个数 直接执行
  // 小于 返回 继续接收参数
  return args.length === fn.length ? fn(...args) : (..._args) => curry(fn, ...args, ..._args)
}

const curryFn = (fn) => {
  return function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (..._args) => curried(...args, ..._args)
  }
}

const curry2 = (fn) => {
  return curried = (...args) => {
    return args.length >= fn.length ? fn(...args) : (..._args) => curried(...args, ..._args)
  }
}

function add(x, y, z) {
  return x + y + z
}

// test

const curriedAdd = curry2(add)

console.log("curriedAdd(1, 2, 3)", curriedAdd(1, 2, 3))
console.log("curriedAdd(1, 2)(3)", curriedAdd(1, 2)(3))
console.log("curriedAdd(1)(2, 3)", curriedAdd(1)(2, 3))