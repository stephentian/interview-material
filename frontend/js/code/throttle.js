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
    if (timeSiceLastCall < time) {

      return
    }

    lastCall = now
    fn.apply(context, args)

    // if (!timer) {
    //   timer = setTimeout(() => {
    //     fn.apply(context, args)
    //     timer = null
    //   }, time);
    // }
    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, time);
  }
}

function throttle1(fn, delay) {
  let canUse = true
  return function () {
    if (canUse) {
      fn.apply(this, arguments)
      canUse = false
      setTimeout(() => {
        canUse = true
      }, delay);
    }
  }
}

function throttle2(func, limit) {  
  let lastFunc;  
  let lastRan;  
  return function() {  
      const context = this;  
      const args = arguments;  
      if (!lastRan) {  
          func.apply(context, args);  
          lastRan = Date.now();  
      } else {  
          clearTimeout(lastFunc);  
          lastFunc = setTimeout(function() {  
              if ((Date.now() - lastRan) >= limit) {  
                  func.apply(context, args);  
                  lastRan = Date.now();  
              }  
          }, limit - (Date.now() - lastRan));  
      }  
  };  
}

// underscore 版本
function throttle3(func, wait, options) {  
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

const throttledLogTime = throttle1(logTime, 1000); // 限制为每秒调用一次 

const throttleFn = throttle2(function(...args) {
  console.log('throttle called：' + args);
}, 500);

// throttleFn(1);
// throttleFn(2);
// throttleFn(3);

console.time("throttleFn")
for (let i = 0; i < 10; i++) {
  // throttleFn(i);
  throttledLogTime(i);
}
console.timeEnd("throttleFn")

setTimeout(() => {}, 5000); // 10s

// function throttle3(fn, delay = 1000) {
//   let timer = null
//   return function () {
//     if ()
//   }
// }