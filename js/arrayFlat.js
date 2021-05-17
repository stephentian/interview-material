// 数组扁平化

const target = [1, 2, [3, 4], [5, [6]]]

// 1.  ES6

arr1 = arr.flat(target)

// 2. 字符串化

let str = JSON.stringify(target)

// 2.1 split

arr2 = str.replace(/(\[|\])/g, '').split(',')

// 2.2 replace + JSON.parse

str = str.replace(/(\[|\])/g, '')
str = '[' + str + ']'
arr3 = JSON.parse(str)

// 3. 递归

let res = []
let fn = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    Array.isArray(arr[i]) ? fn(item) : res.push(item)
  }
}

// 4. reduce

function flattern(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flattern(cur) : cur)
  }, [])
}

// 5 扩展运算符

while (arr.some(Array.isArray)) {
  arr = [].concat(...arr)
}
