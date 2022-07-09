/**
 * @description: LRU least recently uses 最近最常使用
 * @author: stephen
 * @date: 2022-07-09
 **/

class LRU {
  constructor(n) {
    this.size = n;
    this.data = new Map();
  }
  put(domain, info) {
    if (this.map.has(key)) this.map.delete(key);

    if (this.data.size >= this.size) {
      // 删除最不常用数据
      const firstKey = [...this.data.keys()][0];
      this.data.delete(firstKey);
    }
    this.data.set(domain, info);
  }
  get(domain) {
    if (!this.data.has(domain)) return -1;

    const info = this.data.get(domain);
    this.data.delete(domain);
    this.data.set(domain, info);
    return info;
  }
}
