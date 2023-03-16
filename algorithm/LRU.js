/**
 * @description: LRU least recently uses 最近最常使用
 * @author: stephen
 * @date: 2022-07-09
 **/

class LRU {
  constructor(n) {
    this.size = n
    this.cache = new Map()
  }
  set(key, value) {
    if (this.map.has(key)) this.map.delete(key)

    if (this.cache.size >= this.size) {
      // 删除最不常用数据
      // this.cache.delete(this.cache.keys().next().value);
      const firstKey = [...this.cache.keys()][0]
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }
  get(key) {
    if (!this.cache.has(key)) return -1

    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }
}
