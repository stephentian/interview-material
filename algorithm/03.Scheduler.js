// 异步并发调度器

class Scheduler {
  constructor() {
    this.tasks = []
    this.working = []
    this.maxCount = 2
  }
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
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

// 用例

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
