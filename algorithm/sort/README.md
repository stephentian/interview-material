# 排序

## 目录

- [排序](#排序)
  - [目录](#目录)
  - [冒泡排序](#冒泡排序)
    - [改进](#改进)
  - [快速排序](#快速排序)
  - [插入排序](#插入排序)
  - [选择排序](#选择排序)
  - [希尔排序](#希尔排序)
  - [归并排序](#归并排序)

## 冒泡排序

时间复杂度：O(n^2)
空间复杂度：O(1)

思路：

1. 比较相邻元素。如果前一个比后一个大，就交换他们。
2. 对每一对相邻元素遍历比对大小，做完之后，最后的元素会是最大的数，把它抛出。
3. 对除去最后元素的数组（因为最后是最大）重复以上步骤。
4. 比对的数组越来越小，直到没有数字比对。

```js
function bubbleSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1]
        arr[j + 1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

### 改进

1. 记录最后一次交换的位置 pos。因为最后一次交换位置之后项，都已经排好序了，所以下次遍历的时候
   遍历到这个位置 pos 就好了，不需要遍历整个数组。

   ```js
   function bubbleSort(arr) {
     let i = arr.length - 1
     while (i > 0) {
       let pos = 0
       for (let j = 0; j < i; j++) {
         if (arr[j] > arr[j + 1]) {
           pos = j
           // 交换
           let temp = arr[j]
           arr[j] = arr[j + 1]
           arr[j + 1] = temp
         }
       }
       i = pos
     }
   }
   ```

2. 冒泡排序每一次排序可以得到最大值，或者最小值。可以考虑利用每次排序使用正向和反向冒泡，这样一次可以得出最大值和最小值；排序次数可以少几乎一半。

   ```js
   function bubbleSort(arr) {
     let min = 0
     let max = arr.length - 1
     let temp, j
     while (min < max) {
       for (j = min; j < max; j++) {
         if (arr[j] > arr[j + 1]) {
           // 前比后大，交换
         }
       }
       max-- // 找出来最大值, 最大值位置往前移
       for (j = max; j > min; j--) {
         if (arr[j] < arr[j - 1]) {
           // 前比后小，交换
         }
       }
       min++
     }
     return arr
   }
   ```

## 快速排序

时间复杂度：O(n\*log n)
空间复杂度：O(log n)

思路：

1. 先从数列中取出一个数作为“基准”；
2. 将比这个“基准”小的数全放到“基准”的左边，大于或等于的数全放到“基准”的右边。
3. 再对左右区间重复第二步，直到各区间只有一个数。

```js
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
  return quickSort(left).concat([pivot], quickSort(right))
}
```

循环来实现快速排序

```js
function quickSort(arr) {  
  let stack = [];  
  let result = [];  
  let temp = [];  
  let len = arr.length;  
  let stackTop;  
  let leftEnd;  
  let rightEnd;  
  let pivot;  
  let i;  
  let j;  
  
  while (stack.length > 0 || arr.length > 1) {  
    if (arr.length > 1) {  
      stackTop = stack.pop();  
      leftEnd = stackTop[0];  
      rightEnd = stackTop[1];  
      pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];  
      for (i = leftEnd; i < arr.length; i++) {  
        if (arr[i] < pivot) {  
          temp.push(arr[i]);  
        } else {  
          break;  
        }  
      }  
      for (j = arr.length - 1; j >= rightEnd; j--) {  
        if (arr[j] > pivot) {  
          arr.splice(j + 1, 0, pivot);  
        } else {  
          break;  
        }  
      }  
      arr = temp.concat(arr.slice(leftEnd, rightEnd), temp);  
      result = result.concat(arr.slice(leftEnd, rightEnd));  
      arr = arr.slice(leftEnd + 1, rightEnd).concat([pivot]).concat(arr.slice(rightEnd + 1));  
    } else {  
      stack.push([0, arr.length - 1]);  
    }  
  }  
  return result;  
}
```

## 插入排序

插入排序的工作方式像许多人排序一手扑克牌。开始时，我们的左手为空并且桌子上的牌面向下。然后，我们每次从桌子上拿走一张牌并将它插入左手中正确的位置。为了找到一张牌的正确位置，我们从右到左将它与已在手中的每张牌进行比较。拿在左手上的牌总是排序好的。

时间复杂度：O(n^2)
空间复杂度：O(1)

思路：

1. 假定第一个元素是排好序的；
2. 取下一个元素 i，取该元素的值为 key，i 左边的元素为 j = i - 1；
3. 当 i 左边的元素不是最后一个元素 (j>=0)，并且 该元素的值大于 i 的值(`arr[j] > key`)；说明该元素需要移到下一个位置( arr[j+1] = arr[j])；
4. 继续往左遍历( `j--` )，重复 `3` 步骤；
5. 将 key 值放到最后遍历到的位置(arr[j+1] = key)。
6. 重复 `2-5` 步骤，直到遍历完( `i < arr.length; i++` )。

```js
function insertSort(arr) {
  if (arr.length <= 1) {
    return arr
  }

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }

  return arr
}
```

## 选择排序

时间复杂度：O(n^2)
空间复杂度：O(1)

思路：

1. 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置；
2. 从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾；
3. 重复第二步，直到所有元素均排序完毕。

```js
function selection(arr) {
  if (arr.length <= 1) {
    return arr
  }
  let minIndex, temp
  for (let i = 0; i < arr.length - 1; i++) {
    minIndex = i
    // 再循环一遍，找最小的数
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    // 找到最小数后和 arr[i] 互换位置
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  return arr
}
```

## 希尔排序

> shell sort

希尔排序（Shell Sort）是插入排序的一种更高效的改进版本，也被称为缩小增量排序（Diminishing Increment Sort）。它的基本思想是将待排序的数组分成若干个子序列，对每个子序列进行插入排序，逐步缩小增量，最后再对整个序列进行一次插入排序。

希尔排序的时间复杂度为O(nlogn)到O(n^2)之间，具体取决于所选择的增量序列。其中最常用的增量序列是希尔增量，即把数组长度除以2的若干次方，直到为1为止。

时间复杂度：O(n log n)
空间复杂度：O(1)

思路：

1. 在希尔排序中最重要的是分组，我们先找到一个间隔，每隔一定的间隔将这些数字排位一组；
2. 对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至 1 时，整个文件恰被分成一组，算法便终止。

```js
function shellSort(arr) {
  // 算间隔
  let gap = Math.floor(arr.length / 2)

  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i]
      let j = i

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = temp
    }
    gap = Math.floor(gap / 2)
  }

  return arr
}
```

## 归并排序

> merge sort

归并排序采用分治法（Divide and Conquer）。将已有序的子序列合并，得到完全游戏的序列。

将两个有序表合成有序表，成为 2-路归并。

思路：

1. 将长度 n 的序列分为两个长度为 n/2 的子序列；
2. 对两个子序列才有归并排序。

```js
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  let len = Math.floor(arr.length / 2)
  let left = arr.slice(0, len)
  let right = arr.slice(len, arr.length)

  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  let res = []

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      res.push(left.shift())
    } else {
      res.push(right.shift())
    }
  }

  while (left.length) {
    res.push(left.shift())
  }

  while (right.length) {
    res.push(right.shift())
  }

  return res
}
```
