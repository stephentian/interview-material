# Algorithm

## 目录

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [排序](#%E6%8E%92%E5%BA%8F)
- [动态规划](#)
- [n 数之和](#n-%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [双数之和](#%E5%8F%8C%E6%95%B0%E4%B9%8B%E5%92%8C)
  - [三数之和](#%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 排序

地址: [Sort](https://github.com/stephentian/daily-js/tree/master/01-Algorithm/05-Sort)

## 动态规划

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

2. 数组

    ```js
    const twoSum = function (nums, target) {
      
    }
    ```

### 三数之和

地址: [3sum](https://leetcode-cn.com/problems/3sum/)

### 四数之和

leetcode: [4sum](https://leetcode-cn.com/problems/4sum/)
