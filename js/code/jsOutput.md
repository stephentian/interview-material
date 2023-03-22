<!-- 
* @description: js questions
* @author: stephentian
* @date: 2023-03-22
 -->
# js 输出

- [js 输出](#js-输出)
	- [作用域](#作用域)
	- [this](#this)
	- [运算符](#运算符)
	- [模版字符串](#模版字符串)
	- [对象字符串](#对象字符串)

## 作用域

```js
function sayHi() {
	console.log(name)
	console.log(age)
	var name = 'mike'
	let age = 19
}
sayHi()

// undefined
// ReferenceError
```

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1);
}

// 3 3 3
// 0 1 2
```

## this

```js
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius,
};

console.log(shape.diameter());
console.log(shape.perimeter());
// 20
// NaN
```

## 运算符

```js
let number = 0;
console.log(number++);
console.log(++number);
console.log(number);

// 0 2 2
```

## 模版字符串

```js
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = 'Lydia';
const age = 21;

getPersonInfo`${person} is ${age} years old`;

// ["", " is ", " years old"]
// Lydia
// 21

// 第一个参数的值始终是字符串值的数组。剩下的参数获取传递的表达式的值
```

## 对象字符串

```js
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
// 456
// a["[object Object]"] = 123
// a["[object Object]"] = 456
```
