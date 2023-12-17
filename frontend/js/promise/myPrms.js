const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPrms(cb) {
  this.state = PENDING
  this.value = void 0
  this.reason = void 0
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  this.resolve = function (value) {
    if (value instanceof MyPrms) {
      return value.then(this.resolve, this.reject)
    }
    if (this.state === PENDING) {
      this.state = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(cb => cb())
    }
  }
  this.reject = function (reason) {
    if (this.state === PENDING) {
      this.state = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(cb => cb())
    }
  }

  try {
    cb(this.resolve, this.reject)
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

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x)
    return reject(new TypeError('Chaining cycle detected for promise!'))

  if (x instanceof MyPrms) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
