/**
 * @description: LRU least recently uses 最近最少最常使用
 * @author: StephenTian
 * @date: 2022-07-09
 **/

class LRU {
	constructor(n) {
		this.size = n
		this.cache = new Map()
	}
	get(key) {
		if (!this.cache.has(key)) return -1

		const value = this.cache.get(key)
		this.cache.delete(key)
		this.cache.set(key, value)
		return value
	}
	set(key, value) {
		if (this.cache.has(key)) this.cache.delete(key)

		if (this.cache.size >= this.size) {
			// 删除最不常用数据
			// 可迭代对象的第一个值
			// this.cache.delete(this.cache.keys().next().value);
			const firstKey = [...this.cache.keys()][0]
			this.cache.delete(firstKey)
		}
		this.cache.set(key, value)
	}
}

// es5

function LRUCache(size) {
  this.size = size
  this.cache = {}
  this.queue = []
}

LRUCache.prototype.get = function (key) {
  if (key in this.cache) {
    var value = this.cache[key]
		this.queue.splice(this.queue.indexOf(key), 1)
		this.queue.push(key)
		return value
  } else {
    return -1
  }
}

LRUCache.prototype.set = function (key, value) {
  if (key in this.cache) {
    this.cache[key] = value
    this.queue.splice(this.queue.indexOf(key), 1)
    this.queue.push(key)
  } else {
    if (this.queue.length >= this.size) {
      var oldestKey = this.queue[0]
			delete this.cache[oldestKey]
			this.queue.shift()
    }

    this.cache[key] = value
    this.queue.push(key)
  }
}