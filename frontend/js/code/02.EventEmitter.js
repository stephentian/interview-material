// EventEmitter

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
    if (!name || !this.events[name]) return false

    if (!fn || (fn && !~this.events[name].indexOf(fn))) {
      this.events[name] = null
      return
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
