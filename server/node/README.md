# node

## Event Loop

1. `timer` (`setTimeout`, `setInterval`)
2. I/O callbacks
3. `idls`, prepare (系统内部)
4. `poll` (检索新的 I/O 事件)
5. `check` (setImmediate)
6. `close callbacks` (回调关闭, 比如 `socket.on('close')`)

- 微任务会在两个阶段之间执行。
- 每个阶段都有一个执行队列 (先进先出)，只有全部执行完才进入下一个

### process.nextTick

不属于任何的 Event Loop 阶段，Node在遇到这个API时，Event Loop根本就不会继续进行，会马上停下来执行 process.nextTick()

nextTick 执行完后才会继续 Event Loop
