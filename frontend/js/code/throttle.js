/**
* author: stephentian
* email: stephentian@foxmail.com
* day: 2019-8-13
**/

// 节流 throttle

function throttle(fn, time) {
  let timer = null
  let lastCall = 0
  return function() {
    let context = this,
      args = arguments

    const now = Date.now()
    const timeSiceLastCall = now - lastCall
    if (timeSiceLastCall < time) return

    lastCall = now
    fn.apply(context, args)

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, time);
    }
  }
}

// 方法执行完回调版
function throttle1(fn, delay) {
  let timer = null
  return function (...args) {

    // 判断是否执行完上一个
    if (!timer) {

      fn.apply(this, args)
      timer = setTimeout(() => {
        timer = null
        canUse = true
      }, delay);
    }
  }
}

// underscore 版本
function throttleUnderscore(func, wait, options) {  
  var context, args, result;  
  var timeout = null;  
  var previous = 0;  
  if (!options) options = {};  
  var later = function() {  
      previous = options.leading === false ? 0 : Date.now();  
      timeout = null;  
      result = func.apply(context, args);  
      if (!timeout) context = args = null;  
  };  

  return function() {  
      var now = Date.now();  
      if (!previous && options.leading === false) previous = now;  

      var remaining = wait - (now - previous);  
      context = this;  
      args = arguments;  

      if (remaining <= 0 || remaining > wait) {  
          if (timeout) {  
              clearTimeout(timeout);  
              timeout = null;  
          }  
          previous = now;  
          result = func.apply(context, args);  
          if (!timeout) context = args = null;  
      } else if (!timeout && options.trailing !== false) {  
          timeout = setTimeout(later, remaining);  
      }  
      return result;  
  };  
};

// 使用示例

function logTime(...args) {  
  console.log("logTime: ", args + " - " + new Date().toLocaleTimeString());  
}

const throttledLogTime = throttleUnderscore(logTime, 1000);

const throttleFn = throttle(function(...args) {
  console.log('throttle called：' + args);
}, 500);

// throttleFn(1);
// throttleFn(2);
// throttleFn(3);

console.time("throttleFn")
for (let i = 0; i < 100000000; i++) {
  // throttleFn(i);
  throttledLogTime(i);
}
console.timeEnd("throttleFn")

setTimeout(() => {}, 5000); // 5s