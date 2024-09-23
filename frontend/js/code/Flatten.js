/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2023-04-25
 **/

// 扁平化

const arr = [1, 2, [3, 4, [5], 6], 7]

// 1. ES6 flat

// flat(depth): 创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组
// depth: 可选，递归的深度，默认为 1
function flattenEs6(params) {
  return params.flat(Infinity)
}


// 2. 字符串化
let str = JSON.stringify(target)
// JSON.stringify(arr)
// '[1,2,[3,4,[5],6],7]'

// 2.1 split

arr2 = str.replace(/(\[|\])/g, '').split(',')
// 2.2 replace + JSON.parse

str = str.replace(/(\[|\])/g, '')
str = '[' + str + ']'
arr3 = JSON.parse(str)


// 3. reduce

function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}


// 4. 利用 map

function flattenMap(arr) {
  const res = arr.map((item) => {
    if (Array.isArray(item)) {
      return flattenMap(item)
    } else {
      return [item]
    }
  })
  return [].concat(res)
}


// 5. for of

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
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

// 使用 栈
// 会检查每个值的深度

function flattenStack(arr) {
  const stack = [...arr]
  const res = []

  while (stack.length) {
    const next = stack.pop()
    // const next = stack.shift()
    if (Array.isArray(next)) {
      stack.push(...next)
      // stack.unshift(...next)
    } else {
      res.push(next)
    }
  }

  // 反转原数组顺序
  return res.reverse()
  // return res
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

const obj = { a: 1, b: { c: '123', d: 0 }, e: [1, 2, 3] }
const obj1 = {
  a: 1,
  b: { c: '123', d: 0 },
  e: [1, 2, 3],
  f: null,
  g: undefined
}

// 缺点: null 值没有了
flattenObj(obj)
// {
//     "a": 1,
//     "b.c": "123",
//     "b.d": 0,
//     "e[0]": 1,
//     "e[1]": 2,
//     "e[2]": 3
// }
flattenObj(obj1)
// {
//     "a": 1,
//     "b.c": "123",
//     "b.d": 0,
//     "e[0]": 1,
//     "e[1]": 2,
//     "e[2]": 3,
//     "g": undefined
// }

// 保留 null

let flattenObject = (obj) => {
  let res = {}

  let flatten = (res, obj, keyName) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flatten(res, obj[key], `${keyName}.${key}`)
      } else {
        res[`${keyName}.${key}`] = obj[key]
      }
    }
  }

  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flatten(res, obj[key], `${key}`)
    } else {
      res[key] = obj[key]
    }
  }

  return res
}

flattenObject(obj1)
// {
//     "a": 1,
//     "b.c": "123",
//     "b.d": 0,
//     "e.0": 1,
//     "e.1": 2,
//     "e.2": 3,
//     "f": null,
//     "g": undefined
// }

// 树结构扁平化 tree

let tree = [
  {
    id: 1,
    name: '1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '2',
        pid: 1,
        children: []
      },
      {
        id: 3,
        name: '3',
        pid: 1,
        children: [
          {
            id: 4,
            name: '4',
            pid: 3,
            children: []
          }
        ]
      }
    ]
  }
]

function flattenTreeReduce(tree) {
  return tree.reduce((list, item) => {
    const { children, ...res } = item
    return list.concat(
      res,
      children && children.length ? flattenTreeReduce(children) : []
    )
  })
}

// {
//     "id": 1,
//     "name": "1",
//     "pid": 0,
//     "children": [
//         {
//             "id": 2,
//             "name": "2",
//             "pid": 1,
//             "children": []
//         },
//         {
//             "id": 3,
//             "name": "3",
//             "pid": 1,
//             "children": [
//                 {
//                     "id": 4,
//                     "name": "4",
//                     "pid": 3,
//                     "children": []
//                 }
//             ]
//         }
//     ]
// }