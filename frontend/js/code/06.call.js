/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-5
**/


// 2024-07-01
const call = function(context, ...args) {
  context = context || window

  const key = Symbol('key')
  context[key] = this

  const res = context[key](...args)

  delete context[key]

  return res
}

// ES5

function myCall(context) {
  let context = context || window
  context.fn = this
  let args = []
  for (let i = 1; i < arguments.length; i++) {
    let temp = 'arguments[' + i + ']'
    args.push(temp)
  }
  let result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}


function myCall2(context) {
  let context = context || window
  context.fn = this
  let args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

// ES6 
// function es6Call(context) {
//   let context = context || window
//   context.fn = this
//   let args = [...arguments].slice(1)
//   const result = context.fn(...args)
//   delete context.fn
//   return result
// }

// function myCall3(context) {
//   let context = context || window
//   context.fn = this
//   let args = []
//   for (let i = 1; i < arrguments.length; i++) {
//     let temp = 'arguments[' + i + ']'
//     args.push(temp)
//   }
//   let result = eval('context.fn(' + args + ')')
//   delete context.fn
//   return result
// }