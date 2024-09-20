const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPrms(cb) {
  this.state = PENDING
  this.value = void 0
  this.reason = void 0
  this.onFulfilledCallbacks = [] // 成功的回调函数
  this.onRejectedCallbacks = []

  this.resolve = function (value) {
    if (value instanceof MyPrms) {
      return value.then(this.resolve, this.reject)
    }

    // 只有在 pending 状态下才能调用 resolve
    if (this.state === PENDING) {
      this.state = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn())
    }
  }
  this.reject = function (reason) {
    if (this.state === PENDING) {
      this.state = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }
  }

  try {
    cb(this.resolve, this.reject) // 传入两个方法参数，执行方法
  } catch (error) {
    this.reject(error)
  }
}

MyPrms.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : error => {
          throw error
        }

  let promise2 = new MyPrms((resolve, reject) => {
    if (this.state === FULFILLED) {
      // setTimeout 模拟 promise
      // 也可以用 queueMicrotask, setImmediate 等
      // 实际 Promise 和语言本身相关，具体行为由 JS 引擎实现
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (this.state === REJECTED) {
      setTimeout(() => {
        try {
          let x = onRejected(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }

    if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        try {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })

      this.onRejectedCallbacks.push(() => {
        try {
          let x = onRejected(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
  })
}

MyPrms.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

// 辅助函数，处理循环引用
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x)
    return reject(new TypeError('Chaining cycle detected for promise!'))

  if (x instanceof MyPrms) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
