/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-13
**/


// 防抖
/**
 * 函数防抖动封装。确保一个函数在特定时间间隔内只能调用一次。
 * @param {Function} fn 要执行的函数
 * @param {number} time 延迟时间，默认为1000毫秒
 * @return {Function} 返回一个防抖动的函数
 */

function debounce(fn, time = 1000) {
  let timer
  return function (...args) {
    const context = this // 箭头函数中不需要了
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, time)
  }
}

// 带立即执行的防抖动封装
function debounce2(fn, time = 1000, immediate = false) {
  let timer = null

  return function(...args) {
    const context = this
    if (immediate && !timer) {
      fn.apply(context, args)
    }

    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      // if (!immediate || !timer) {
      //   fn.apply(context, args);
      // }
      fn.apply(context, args);
      timer = null
    }, time)
  }
}

// 使用示例
const debouncedFn = debounce2(function(...args) {
  console.log('Function called：' + args);
}, 2000, true); // 设置immediate为true，首次调用立即执行

debouncedFn(1); // 立即执行
debouncedFn(2); // 不会立即执行，被后面任务覆盖
debouncedFn(3); // 同样等待2000ms后执行（覆盖上一个方法）