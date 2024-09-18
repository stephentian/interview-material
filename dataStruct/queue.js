/**
 * @description: 队列
 * @author: stephentian
 * @date: 2022-05-03
 **/

class MyQueue {
	constructor(items) {
		this._list = items ? Array.from(items) : []
		this._listReversed = []
	}

	get length() {
		return this._list.length + this._listReversed.length
	}

	clear() {
		this._list.length = 0
		this._listReversed.length = 0
	}
	// 入队 向队列尾部添加新的项
	enqueue(item) {
		this._list.push(item)
	}
	// 出队 移除队列的第一项（即排在队列最前面的项）并返回被移除的元素
	dequeue() {
		if (this._listReversed.length === 0) {
			if (this._list.length === 0) return undefined
			if (this._list.length === 1) return this._list.pop()
			if (this._list.length < 16) return this._list.shift()
			// webpack 源码优化
			// shift 时间复杂度 O(n)
			// pop 时间复杂度 O(1), reverse + pop 时间复杂度 O(n)
			// 长度大于 16 使用 reverse + pop 代替 shift
			const temp = this._listReversed
			this._listReversed = this._list
			this._listReversed.reverse()
			this._list = temp
		}

		return this._listReversed.pop()
	}

	delete(item) {
		const i = this._list.indexOf(item)
		if (i >= 0) {
			this._list.splice(i, 1)
		} else {
			const i = this._listReversed.indexOf(item)
			if (i >= 0) this._listReversed.splice(i, 1)
		}
	}
}
