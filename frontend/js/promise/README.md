# promise

- [简介](#简介)
- [基本用法](#基本用法)
- [Promise.all](#promiseall)
  - [过滤失败请求](#过滤失败请求)

## 简介

Promise 是异步编程的一种解决方案。类似一个容器，里面保存着三种状态，到了某种状态才会结束。

1. pending（进行中）、fulfilled（已成功）和rejected（已失败）

缺点：

1. 无法取消 Promise
2. 于 pending 状态时，无法得知目前进展到哪一个阶段
如果某些事件不断地反复发生，一般来说，使用 Stream 模式是比部署 Promise 更好的选择。

## 基本用法

```js
const promise = new Promise((resolve, reject) => {
  const success = ajax.get(xxx)

  if (success) {
    resolve(value)
  } else {
    reject('error')
  }
})
```

## Promise.all

### 过滤失败请求

使用 Promise.all 进行 5 个请求，若其中一个失败了，怎么让其他4个成功返回？

每个promise，都会在执行成功的时候resolve，执行失败时 reject，那么，只要我们在执行失败的时候，也返回一个变量而不执行 reject;

Promise.all 是接收一个数组，使用 map 方法去掉数组里面每一个 promise 执行失败时的 reject

```js
let p1 = Promise.resolve(1)
let p2 = Promise.resolve(2)
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
     reject(3)
  }, 2000);
})

let all = Promise.all([p1, p2, p3].map((p) => p.then(res => res).catch(err => false)))

all.then((res) => {
  console.log(res, res.filter(Boolean)) // 2s 后打印 [1, 2, false], [1, 2]
}).catch((err) => {
  console.log('err', err)
})
```
