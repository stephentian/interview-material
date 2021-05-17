// 柯里化

// 1. 实现 add(1)(2)(3)

function add(...args) {
  let sum = args.reduce((res, cur) => res + res)
  return function(...next) {
    return next.length ? add(sum, ...next) : sum
  }
}

function add(...args) {
  let f = add.bind(null, ...args)
  
}