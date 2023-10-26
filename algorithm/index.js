var addBinary = function (a, b) {
  let ans = ''
  let num = 0 // 进位
  debugger
  let i = a.length - 1
  let j = b.length - 1
  for (; i >= 0 || j >= 0; i--, j--) {

    let m = i >= 0 ? parseInt(a[i]) : 0
    let n = j >= 0 ? parseInt(b[j]) : 0
    // 补 0

    let sum = num
    sum = sum + m
    sum = sum + n

    debugger
    ans = ans + sum % 2 // 拼接 1
    num = Math.floor(sum / 2)
  }

  ans = ans + (num == 1 ? num : '') // 判断最后是否进位
  return ans.split('').reverse().join('');
};

addBinary('11', '1')