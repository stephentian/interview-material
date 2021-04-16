# Algorithm

## 目录

## 排序

地址: [Sort](https://github.com/stephentian/daily-js/tree/master/01-Algorithm/05-Sort)

##

## n 数之和

### 双数之和

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

2. 双指针

```js
const twoSum = function (nums, target) {
  
}
```

### 三数之和

地址: [3sum](https://leetcode-cn.com/problems/3sum/)
