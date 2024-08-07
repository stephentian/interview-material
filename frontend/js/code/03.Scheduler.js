/**
 * 异步任务调度器类，用于控制并发执行的任务数量。
 */
class Scheduler {
  constructor() {
    this.tasks = []
    this.working = []
    this.maxCount = 2
  }
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      // 为任务函数添加resolve方法，用于任务完成后通知调度器
      promiseCreator.resolve = resolve

      if (this.working.length < this.maxCount) {
        this.run(promiseCreator)
      } else {
        this.tasks.push(promiseCreator)
      }
    })
  }

  run(promiseCreator) {
    this.working.push(promiseCreator)

    promiseCreator().then(() => {
      promiseCreator.resolve()

      // 删除任务
      this.working.splice(this.working.findIndex(promiseCreator), 1)
      if (this.tasks.length > 0) this.run(this.tasks.shift())
    })
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })

const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output 2 3 1 4
// 1s 后输出 ’1'
// 0.5s 后输出’2'
// 0.8s 后输出 '3'
// 1.2s 后输出 '4'
