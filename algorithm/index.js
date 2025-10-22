/**
 * author: stephentian
 * email: tianre96@gmail.com
 * day: 2024-04-21
 **/

/**
 * 该函数用于将两个二进制字符串相加。
 * @param {string} a - 第一个二进制字符串。
 * @param {string} b - 第二个二进制字符串。
 * @returns {string} - 两个二进制字符串相加后的结果。
 */
var addBinary = function (a, b) {
  let ans = ''
  let num = 0 // 进位
  let i = a.length - 1
  let j = b.length - 1
  for (; i >= 0 || j >= 0; i--, j--) {

    let m = i >= 0 ? parseInt(a[i]) : 0
    let n = j >= 0 ? parseInt(b[j]) : 0
    // 补 0

    let sum = num
    sum = sum + m
    sum = sum + n

    ans = ans + sum % 2 // 拼接 1
    num = Math.floor(sum / 2)
  }

  ans = ans + (num == 1 ? num : '') // 判断最后是否进位
  return ans.split('').reverse().join('');
};

addBinary('11', '1')

const nextBigerNum = (nums) => {
  const len = nums.length
  const res = new Array(len).fill(-1)
  const stack = []

  for (let i = 0; i< len*2 -1; i++) {

  }
}

const dfs = (node, nodeList = []) => {
  nodeList.push(node.val)

  if (node.children && node.children.length) {
    for (let child of node.children) {
      dfs(child, nodeList)
    }
  }

  return nodeList
}