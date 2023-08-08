# node

- [Event Loop](#event-loop)
	- [process.nextTick](#processnexttick)
	- [setImmediate 和 setTimeout](#setimmediate-和-settimeout)
	- [保证 setImmediate 比 setTimeout 快](#保证-setimmediate-比-settimeout-快)
	- [浏览器的 Event Loop 区别](#浏览器的-event-loop-区别)
- [require 和 fs.readFile 区别](#require-和-fsreadfile-区别)

## Event Loop

宏任务的优先级

1. `timer` (`setTimeout`, `setInterval`)
2. `pending` 上一个未执行完的 I/O callbacks
3. `idle`, prepare (系统内部)
4. `poll` (检索新的 I/O 事件 callback)
5. `check` (`setImmediate`)
6. `close callbacks` (回调关闭, 比如 `socket.on('close'), http.close()`)

- Node11 之前：微任务会在任意两个阶段之间执行
- Node11 之后：一个阶段里的一个宏任务(setTimeout,setInterval和setImmediate)就立刻执行微任务队列，跟浏览器趋于一致

### process.nextTick

不属于任何的 Event Loop 阶段，Node在遇到这个API时，Event Loop 根本就不会继续进行，会马上停下来执行 process.nextTick()

nextTick 执行完后才会继续 Event Loop

### setImmediate 和 setTimeout

NodeJS 中 setTimeout(cb, 0) 最小执行时间 1ms, 浏览器中 setTimeout 最小为 4ms

- 如果 性能够好, 1ms 内，进入 Event Loop，那就推入 timer 之间执行
- 超过 1ms，被推入 下一个 Event Loop

### 保证 setImmediate 比 setTimeout 快

1. 'poll' 阶段执行 `fs.readFile` callback
2. callback 中 存在 setImmediate, 下一个阶段 `check`
3. 优先执行 setImmediate

```js
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, 'a.json'), (err) => {
 if (err) {
  console.log('err: ', err)
 }

 setTimeout(() => {
  console.log('setTimeout')
 })

 setImmediate(() => {
  console.log('setImmediate')
 })
})
```

### 浏览器的 Event Loop 区别

1. 浏览器环境下，microtask 的任务队列是每个 macrotask 执行完之后执行。
2. node 中，microtask 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 microtask 队列的任务。

## require 和 fs.readFile 区别

读取 JSON 文件，

require = fs.readFileSync + JSON.parse

require 引入对象，而 fs.readFile 引入文本
