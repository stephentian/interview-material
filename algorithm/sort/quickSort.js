/**
 * author: stephentian
 * email: stephentian@foxmail.com
 * day: 2019-8-14
 **/

// 快速排序

const quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr
  }
  // 基准位置(理论上可以选取任意位置)
  let midIndex = Math.floor(arr.length / 2)
  let pivot = arr.splice(midIndex, 1)[0]
  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left.concat([pivot], quickSort(right)))
}

// 非递归快排
// 利用栈实现

const quick = arr => {
  let left = 0
  let right = arr.length - 1
  let stack = [[left, right]]

  while (stack.length > 0) {
    let now = stack.pop()
    if (now[0] >= now[1]) continue

    let i = now[0],
      j = now[1]
    // 基准值， 可以选前面，中间也行，也可以选后面
    let pivot = i

    while (i < j) {
      while (i < j && arr[j] >= arr[pivot]) j--

      while (i < j && arr[i] <= arr[pivot]) i++

      let temp = arr[pivot]
      arr[pivot] = arr[j]
      arr[j] = arr[i]
      arr[i] = temp
      pivot = i
    }
    stack.push([now[0], pivot - 1])
    stack.push([pivot + 1, now[1]])
  }

  return arr
}
