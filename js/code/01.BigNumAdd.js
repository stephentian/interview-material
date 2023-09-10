// 大数相加

// 1. 补 0
// 2. temp = num1 + num2 + carry
// 3. 进位 carry = temp > 9 ? 1 : 0
// 4. 当前位 sum = temp % 10 + sum
// 5. 最终 sum = carry === '1' ? '1' + sum : sum

function addStrings(num1, num2) {
  while (num1.length < num2.length) '0' + num1
  while (num2.length < num1.length) '0' + num2

  let temp
  let sum = ''
  let carry = 0
  for (let i = num1.length; i >= 0; i--) {
    const temp = +num1[i] + +num2[i] + carry
    sum = (temp % 10) + sum
    carry = temp > 9 ? 1 : 0
  }
  return carry === 1 ? '1' + res : res
}
