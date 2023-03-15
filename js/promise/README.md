# promise

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
