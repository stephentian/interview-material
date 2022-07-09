/**
 * @param: name
 * @return: undefined
 **/

// 考察知识点：闭包，事件轮询机制，链式调用，队列

class LazeMan {
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
    new Promise((resolve) => {
      const delay = seconds * 1000;
      const time = Date.now();
      while (Date.now() - time) {
        console.log("wake up after " + seconds);
      }
    });
    return this;
  }
}
