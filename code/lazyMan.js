/**
 * @param: name
 * @return: undefined
 **/

// 考察知识点：闭包，事件轮询机制，链式调用，队列

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
		const task = () => {
			return new Promise((resolve) => {
				// const delay = seconds * 1000
				// const time = Date.now()
				// while (Date.now() - time) {
				// 	console.log('wake up after ' + seconds)
				// }
				setTimeout(resolve, seconds * 1000)
			}).then(() => {
				console.log(`Wake up after ${seconds}`)
			})
		}

		// 把函数放到第一个执行
		this.tasks.unshift(task)

		return this
	}
}

const lazyManA = new LazyMan('A')

// lazyManA.sleepFirst(2).eat('meal')
lazyManA.eat('meal').sleepFirst(2)
// This is A !
// Eat meal!

// lazyManA.sleep(2).eat('meal')
// This is A ! //（停顿 2 秒）
// task run after 2s 
// Eat meal!