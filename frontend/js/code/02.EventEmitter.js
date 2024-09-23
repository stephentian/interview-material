// EventEmitter
// 核心方法: `on, emit, off, once`

class EventEmitter {
  constructor() {
    super()
    this.events = {}
  }
  on(name, fn) {
    if (!name || !fn) return false

    this.events[name] = this.events[name] || []
    this.events[name].push(fn)
  }
  emit(name, ...arg) {
    if (!name || !this.events[name]) return false

    const cbs = this.events[name]
    cbs.forEach(fn => fn.call(this, ...arg))
  }
  off(name, fn) {
    if (!name) {
      throw new Error('Event name is required !')
    }

    if (!this.events[name]) {
      throw new Error(`Event ${name} does not exist !`)
    }

    if (!fn || (fn && !~this.events[name].indexOf(fn))) {
      this.events[name] = []
      return true
    }

    const index = this.events[name].indexOf(fn)
    this.events[name].splice(index, 1)
  }
  once(name, fn) {
    if (!name || !fn) return false

    const onceFn = (...args) => {
      fn.apply(this, args)
      this.off(name, fn)
    }
    this.on(name, onceFn)
    return this
  }
}