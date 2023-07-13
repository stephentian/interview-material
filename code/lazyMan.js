/**
 * @param: name
 * @return: undefined
 **/

// 问题描述
// 实现一个LazyMan，可以按照以下方式调用:
// LazyMan("Hank")
// 输出：
// Hi! This is Hank!

// LazyMan("Hank").sleep(5).eat("dinner")
// 输出：
// Hi! This is Hank!
// （等待 5 秒...）
// Wake up after 5s
// Eat dinner~

// LazyMan("Hank").eat("dinner").eat("supper")
// 输出：
// Hi This is Hank!
// Eat dinner ~
// Eat supper ~

// LazyMan("Hank").sleepFirst(2).eat("supper")
// 输出：
// （等待 2 秒）
// Wake up after 2s
// Hi This is Hank!
// Eat supper

// 考察知识点：闭包，事件轮询机制，链式调用，队列
// 执行任务不能紧跟在插入任务的后面执行，等所有任务都进队了，才开始执行任务队列。
// 借助 setTimeout 函数，将他们分进两个事件队列就好了

class LazyMan {
  constructor(name) {
    this.tasks = [];
    const task = () => {
      console.log(`This is ${name} !`);
      this.next();
    };
    this.tasks.push(task);

    setTimeout(() => {
      this.next();
    }, 0);
  }
  next() {
    if (!this.tasks.length) return
 
    let task = this.tasks.shift();
    task && task();
  }

  sleep(time, first = false) {
    let task = () => {
      setTimeout(() => {
        console.log(`task run after ${time}s`);
        this.next();
      }, time * 1000);
    };

    // 优先执行，需放置在队首
    if (first) {
      this.tasks.unshift(task);
    } else {
      this.tasks.push(task);
    }
    // 链式调用
    return this;
  }

  eat(food) {
    let task = () => {
      console.log(`Eat ${food}!`);
      this.next();
    };
    this.tasks.push(task);

    return this;
  }

  sleepFirst(seconds) {
    const self = this
		const task = () => {
			return new Promise((resolve) => {
				// const delay = seconds * 1000
				// const time = Date.now()
				// while (Date.now() - time) {
				// 	console.log('wake up after ' + seconds)
				// }
				setTimeout(resolve, seconds * 1000)
			}).then(() => {
        console.log(`Wake up after ${seconds}s`)
        self.next()
			})
		}

		// 把函数放到第一个执行
		this.tasks.unshift(task)

		return this
	}
}

function lazyMan(name) {
  return new LazyMan(name)
}

// lazyMan('Hank')

// lazyMan("Hank").sleep(5).eat("dinner")

// lazyMan("Hank").eat("dinner").eat("supper")

lazyMan("Hank").sleepFirst(2).eat("supper")

// lazyMan('A')
// const lazyManA = new LazyMan('A')

// lazyManA.sleepFirst(2).eat('meal')
// lazyManA.eat('meal').sleepFirst(2)
// This is A !
// Eat meal!

// lazyManA.sleep(2).eat('meal')
// This is A ! //（停顿 2 秒）
// task run after 2s 
// Eat meal!