# Algorithm

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [排序](#%E6%8E%92%E5%BA%8F)
- [动态规划](#%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92)
- [n 数之和](#n-%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [双数之和](#%E5%8F%8C%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [三数之和](#%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [四数之和](#%E5%9B%9B%E6%95%B0%E4%B9%8B%E5%92%8C)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 排序

地址: [Sort](https://github.com/stephentian/daily-js/tree/master/01-Algorithm/05-Sort)

## 动态规划

诀窍:

## 经典例题

### N数之和

诀窍:

- 暴力法
- 排序 + 双指针(左右指针) + 去重

#### 双数之和

1. 暴力法

    ```js
    const twoSum = function (nums, target) {
      for (let i = 0; i < nums.length-1; i++) {
        for (let j = i+1; j <nums.length; j++) {
          if (nums[i] + nums[j] === target) {
            return [i, j]
          }
        }
      }
    }
    ```

2. 哈希表

    ```js
    const twoSum = function (nums, target) {
      let map = new Map()
      for(let i = 0, len = nums.lengths; i< len; i++) {
        if (map.has(target - nums[i])) {
          return [ map.get(target - nums[i]), i ]
        } else {
          map.set(nums[i], i)
        }
      }
      return []
    }
    ```

#### 三数之和

地址: [3sum](https://leetcode-cn.com/problems/3sum/)

1. 暴力法, 3 个 `for` 循环
2. 排序 + 双指针

    ```js
    // 时间复杂度 O(n^2)
    // sort 排序可以做到 nlogn (nlogn < n^2)
    const threeSum = function(nums) {
      if (nums === null || nums.length < 3) return []
      let res = []
      const len = nums.length
      nums.sort((a, b) => a - b)

      for(let i = 0; i < len; i++) {
        if (nums[i] > 0) break; // 和为 0
        if (i>0 && nums[i] == nums[i-1]) continue // 去重

        let L = i + 1
        let R = len - 1
        while(L < R) {
          const sum = nums[i] + num[L] + nums[R]
          if(sum == 0) {
            res.push([nums[i], nums[L], nums[R]])
            while(L < R && nums[L] === nums[L+1]) L++  // 去重
            while(L < R && nums[R] === nums[R-1]) R--  // 去重
            L++;
            R--
          }
          else if (sum < 0) L++;
          else if (sum > 0) R--
        }
      }
      return res
    }
    ```

#### 四数之和

leetcode: [4sum](https://leetcode-cn.com/problems/4sum/)

排序 + 双指针

```js
const fourSum = function(nums, target) {
  if (nums === null || nums.length < 4) return []
  let res = []
  let len = nums.length
  
  nums.sort((a, b) => a - b)

  for(let i = 0; i < len; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue
    for (let j = i + 1; j < len - 2; j++) {
      if (j > i + 1; nums[j] === nums[j-1]) continue

      let L = j + 1
      let R = len - 1
      while(L < R) {
        let sum = nums[i] + nums[j] + nums[L] + nums[R]
        if (sum === target) {
          res.push([nums[i], nums[j], nums[L], nums[R]])
          while(L < R && nums[L] === nums[L + 1]) L++
          while(L < R && nums[R] === nums[R - 1]) R--
          L++
          R-- 
        }
        else if (sum < target) L++
        else if (sum > target) R--
      }
    }
  }
  return res
}
```

#### n 数之和

```js
const nSum = function(nums, target) {
  const recursion = (index, N, temp) => {
    if (index === len || N < 3) return

    for(let i = index; i < len; i ++) {
      if (i > index && nums[i] === nums[i - 1]) continue

      if (N > 3) {
        recursion(i + 1, N - 1, [nums[i], ...temp])
        continue
      }

      // 3 数和
      let L = i + 1
      let R = len - 1
      while(L < R) {
        let sum = nums[i] + nums[L] + nums[R] + temp.reduce((x, y) => x + y)
        if (sum === target) {
          res.push([...temp, nums[i], nums[L], nums[R]])
          while(L < R && nums[L] === nums[L + 1]) L++
          while(L < R && nums[R] === nums[R - 1]) R--
          L++
          R-- 
        }
        else if (sum < target) L++
        else if (sum > target) R--
      }
    }
  }

  let res = []
  let len = nums.length
  nums.sort((a, b) => a - b)
  // 假如为 4 数之和, N = 4
  recursion(0, 4, [])
  return res
}
```
