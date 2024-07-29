/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2023-05-09
 **/

// 解决同步调用失败重新尝试问题
// 若在判断次数以内则依据返回结果，否则重新尝试执行随机数生成函数，超过判断次数则抛出异常

Promise.retry = function(fn, times, delay) {
  return new Promise((resolve, reject) => {
    const innerFn = function() {
      fn().then(resolve).catch(e => {

        console.log(`还剩${times}次...`)
        if (times === 0) {
          reject(e)
        } else {
          times--
          setTimeout(innerFn, delay)
        }
      })
    }

    return innerFn()
  })
}

function getUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('error')
    }, 1000)
  })
}

Promise.retry(getUser, 3, 1000).then(res => {
  console.log('res: ', res)
})