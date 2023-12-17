/**
 * @description: mvvm
 * @author: stephen
 * @date: 2022-07-02
 **/

// es6
class Vue {
  constructor(options) {
		this.$options = options;
		this._data = options.data
		this._methods = options.methods

    //数据监听
		observe(this._data)

		new Compile(options.el, this)
	}

	observe(value) {
    return new Observer(value);
  }

	_proxy(vm, key) {
    Object.keys(this._data).foreach(key => {
			Object.defineProperty(this._data, key, {
        enumerable: false,
        configurable: true,
        get() {
          return this._data[key]
        },
        set(newValue) {
          this._data[key] = newValue
        }
      })
		})
	}
}

class Observer {
  constructor(value) {
    this.data = data
    this.walk(data)
  }
  walk(data) {
    const self = this
    Object.keys(data).forEach(function(key) {
      self.defineReactive(data, key, data[key])
    })
  }

  defineReactive() {
    const dep = new Dep()

    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: true,
      get() {
        if (Dep.target) {
          // 添加订阅者
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newValue) {

        dep.notify()
      }
    })
  }
}

class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

class Watcher {
  constructor(vm, cb) {
    this.cb = cb

    Dep.target = this
  }

  update() {
    this.cb.call(this.vm)
  }
}

Dep.target = null

class Compile {}
