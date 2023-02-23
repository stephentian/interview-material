/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2023-02-23
 **/

// 扁平化

const arr = [1, 2, [3, 4, [5], 6], 7]

// 一、递归

// 利用 map

function flattenMap(arr) {
	const res = arr.map(item => {
		if (Array.isArray(item)) {
			return flattenMap(item)
		} else {
			return [item]
		}
	})
	return [].concat(res)
}

// for of

function flattenForOf(arr, res = []) {
	for (const element of arr) {
		if (Array.isArray(element)) {
			flattenForOf(element, res)
		} else {
			res.push(element)
		}
	}
	return res
}

// 二、扩展运算符

function flattenSome(arr) {
	while(arr.some(item => Array.isArray(item))) {
		arr = [].concat(...arr)
	}
	return arr
}