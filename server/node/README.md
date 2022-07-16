# node

## Event Loop

1. `timer` (`setTimeout`, `setInterval`)
2. I/O callbacks
3. `idls`, prepare (系统内部)
4. `poll` (检索新的 I/O 事件)
5. `check` (setImmediate)
6. `close callbacks` (回调关闭, 比如 `socket.on('close')`)

- Node11 之前：微任务会在任意两个阶段之间执行。
- Node11 之后：一个阶段里的一个宏任务(setTimeout,setInterval和setImmediate)就立刻执行微任务队列，跟浏览器趋于一致

### process.nextTick

不属于任何的 Event Loop 阶段，Node在遇到这个API时，Event Loop根本就不会继续进行，会马上停下来执行 process.nextTick()

nextTick 执行完后才会继续 Event Loop
