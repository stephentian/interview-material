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

// 对象扁平化

function flattenObj(obj) {
	const newObj = {}
	function format(o, pre) {
		for (let key in o) {
			if (typeof o[key] === 'object') {
				if (!pre) {
					format(o[key], key)
				} else {
					if (Array.isArray(o)) {
						format(o[key], pre + '[' + key + ']')
					} else {
						format(o[key], pre + '.' + key)
					}
				}
			} else {
				if (!pre) {
					newObj[key] = o[key]
				} else {
					if (Array.isArray(o)) {
						newObj[pre + '[' + key + ']'] = o[key]
					} else {
						newObj[pre + '.' + key] = o[key]
					}
				}
			}
		}
	}

	format(obj, null)
	return newObj
}

const obj = { a: 1, b: { c: '123', d: 0}, e: [1, 2, 3]}

flattenObj(obj)
// {
//     "a": 1,
//     "b.c": "123",
//     "b.d": 0,
//     "e[0]": 1,
//     "e[1]": 2,
//     "e[2]": 3
// }
