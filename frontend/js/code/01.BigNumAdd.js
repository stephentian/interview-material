// 大数相加

// 使用 字符串的形式相加

// 1. 补 0
// 2. temp = num1 + num2 + carry
// 3. 进位 carry = temp > 9 ? 1 : 0
// 4. 当前位 sum = temp % 10 + sum
// 5. 最终判断是否进位 sum = carry === '1' ? '1' + sum : sum

function addStrings(num1, num2) {
  num1 = num1 + ''
  num2 = num2 + ''
  const maxLength = Math.max(num1.length, num2.length)

  num1 = num1.padStart(maxLength, '0')
  num2 = num2.padStart(maxLength, '0')

  let sum = ''
  let carry = 0

  for (let i = num1.length - 1; i >= 0; i--) {
    const temp = +num1[i] + +num2[i] + carry
    sum = (temp % 10) + sum
    carry = temp > 9 ? 1 : 0
  }

  return carry === 1 ? '1' + sum : sum
}

// addStrings(1234, 123) // 1357

Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1

console.log("Math.pow(2, 53): ", Math.pow(2, 53));
console.log("Math.pow(2, 53) + 1 精度丢失: ", Math.pow(2, 53) + 1);
console.log("大数相加: ", addStrings(Math.pow(2, 53), 1));