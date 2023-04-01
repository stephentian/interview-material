<!-- 
* @description: js questions
* @author: stephentian
* @date: 2023-03-22
 -->
# js 输出

- [js 输出](#js-输出)
  - [作用域](#作用域)
  - [闭包](#闭包)
  - [this](#this)
  - [运算符](#运算符)
  - [模版字符串](#模版字符串)
  - [对象字符串](#对象字符串)
  - [模块导入导出](#模块导入导出)
  - [import 顺序](#import-顺序)
  - [Object.defineProperty](#objectdefineproperty)
  - [reduce](#reduce)
  - [generator 生成器](#generator-生成器)
    - [yield 和 yield\*](#yield-和-yield)
  - [异步函数](#异步函数)
    - [promise](#promise)
  - [async await](#async-await)
  - [for await](#for-await)
  - [解构赋值](#解构赋值)
  - [let const](#let-const)
  - [NaN](#nan)
  - [Object.seal \& Object.freeze](#objectseal--objectfreeze)

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
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
// 1 undefined 2
```

## 闭包

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

```js
const output = `${[] && 'Im'}possible! You should${'' && `n't`} see a therapist after so much JavaScript lol`;

// Impossible! You should see a therapist after so much JavaScript lol
// && 左边为 true 返回右边
// 为 false 返回左边
```

```js
const one = false || {} || null;
const two = null || false || '';
const three = [] || 0 || true;

console.log(one, two, three);
// {} "" []
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

## 模块导入导出

```js
// counter.js
let counter = 10;
export default counter;

// index.js
import myCounter from './counter';
myCounter += 1;
console.log(myCounter);

// Error
// 导入的模块是 只读的, 不能修改
```

```js
// sum.js
export default function sum(x) {
  return x + x;
}

// index.js
import * as sum from './sum';
// 如何调用 sum 方法

// sum.default(1)
```

## import 顺序

```js
// index.js
console.log('running index.js');
import { sum } from './sum.js';
console.log(sum(1, 2));

// sum.js
console.log('running sum.js');
export const sum = (a, b) => a + b;
// running sum.js, running index.js, 3

// 使用import关键字，所有导入的模块都会被预先解析。
// 导入的模块首先运行，导入模块的文件中的代码随后执行。
// CommonJS中的require（）和import的区别！使用require（），您可以在代码运行时按需加载依赖项。
// require
// running index.js, running sum.js, 3
```

## Object.defineProperty

defineProperty 默认不可枚举

```js
const person = { name: 'Lydia' };

Object.defineProperty(person, 'age', { value: 21 });

console.log(person);
console.log(Object.keys(person));
// { name: "Lydia", age: 21 }, ["name"]
```

## reduce

```js
[1, 2, 3, 4].reduce((x, y) => console.log(x, y));

// 1 2 and undefined 3 and undefined 4
```

## generator 生成器

```js
function* startGame() {
  const answer = yield 'Do you love JavaScript?';
  if (answer !== 'Yes') {
    return "Oh wow... Guess we're done here";
  }
  return 'JavaScript loves you back';
}

const game = startGame();
console.log(/* 1 */); // Do you love JavaScript?
console.log(/* 2 */); // JavaScript loves you back

// game.next().value and game.next("Yes").value

// 调用game.next（“true”）.value时，先前的 yield 将被传递给 next（）函数的参数值所取代，在这种情况下为“是”。变量答案的值现在等于 “true”。
```

### yield 和 yield*

yield 用来返回一个值并暂停函数的执行，等待下一次调用 next() 方法时继续执行；
yield* 用来委托另一个生成器函数或可迭代对象，将其迭代器对象的值依次返回。

```js
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }


function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield* generator1();
  yield 3;
}
const gen2 = generator2();

console.log(gen2.next()); // { value: 1, done: false }
console.log(gen2.next()); // { value: 2, done: false }
console.log(gen2.next()); // { value: 3, done: false }
console.log(gen2.next()); // { value: undefined, done: true }
```

## 异步函数

```js
const myPromise = Promise.resolve(Promise.resolve('Promise'));

function funcOne() {
  setTimeout(() => console.log('Timeout 1!'), 0);
  myPromise.then(res => res).then(res => console.log(`${res} 1!`));
  console.log('Last line 1!');
}

async function funcTwo() {
  const res = await myPromise;
  console.log(`${res} 2!`)
  setTimeout(() => console.log('Timeout 2!'), 0);
  console.log('Last line 2!');
}

funcOne();
funcTwo();
// Last line 1!
// Promise 2!
// Last line 2!
// Promise 1!
// Timeout 1!
// Timeout 2!
```

### promise

```js
const myPromise = () => Promise.resolve('I have resolved!');

function firstFunction() {
  myPromise().then(res => console.log(res + "111"));
  console.log('second1');
}

async function secondFunction() {
  console.log(await myPromise());
  console.log('second2');
}

firstFunction();
secondFunction();

// second1
// I have resolved!111
// I have resolved!
// second2
```

```js
const promise1 = Promise.resolve('First')
const promise2 = Promise.resolve('Second')
const promise3 = Promise.reject('Third')
const promise4 = Promise.resolve('Fourth')

const runPromises = async () => {
	const res1 = await Promise.all([promise1, promise2])
	const res2  = await Promise.all([promise3, promise4])
	return [res1, res2]
}

runPromises()
	.then(res => console.log(res))
	.catch(err => console.log(err))

// Third

// A: [['First', 'Second'], ['Fourth']]
// B: [['First', 'Second'], ['Third', 'Fourth']]
// C: [['First', 'Second']]
// D: 'Third'
// D
```

Promise.all() 方法会等待所有的 Promise 对象都被解决后才会返回结果，所以在等待 Promise.all([promise3, promise4]) 返回结果的过程中，promise3 的错误原因会被抛出，导致整个 Promise.all() 返回一个被拒绝的 Promise 对象。

使用 .catch() 方法处理该错误时，控制台只会打印出该错误原因字符串 'Third'，而不是一个数组。

## async await

```js
async function getData() {
	return await Promise.resolve('OK!')
}

const data = getData()
console.log(data)

// Promise {<pending>}

// 如果需要 打印 OK!
// data.then(res => console.log(res))
```

async 函数总是返回一个 promise。调用 getData() 会返回一个 `pending` 状态的 promise.

## for await

```js
async function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield Promise.resolve(i);
  }
}

(async () => {
  const gen = range(1, 3);
  for await (const item of gen) {
    console.log(item);
  }
})();

// 1 2 3
```

## 解构赋值

```js
const { firstName: myName } = { firstName: 'Lydia' };

console.log(firstName);

// ReferenceError: firstName is not defined

// const { firstName } = { firstName: 'Lydia' };
// ES5 version:
// var firstName = { firstName: 'Lydia' }.firstName;
// console.log(firstName); // "Lydia"

const { firstName: myName } = { firstName: 'Lydia' };
// ES5 version:
// var myName = { firstName: 'Lydia' }.firstName;

console.log(myName); // "Lydia"
console.log(firstName); // Uncaught ReferenceError: firstName is not defined
```

## let const

```js
function checkAge(age) {
  if (age < 18) {
    const message = "Sorry, you're too young.";
  } else {
    const message = "Yay! You're old enough!";
  }

  return message;
}

console.log(checkAge(21));
// ReferenceError
```

```js
function compareMembers(person1, person2 = person) {
  if (person1 !== person2) {
    console.log('Not the same!');
  } else {
    console.log('They are the same!');
  }
}
const person = { name: 'Lydia' };
compareMembers(person);

// They are the same!
```

```js
let name = 'Lydia';

function getName() {
  console.log(name);
  let name = 'Sarah';
}

getName();

// ReferenceError
```

## NaN

```js
const name = 'Lydia Hallie';
const age = 21;

console.log(Number.isNaN(name));
console.log(Number.isNaN(age));

// false
// false

console.log(isNaN(name));
console.log(isNaN(age));
// true
// false
```

`Number.isNaN` 用于判断是否为 `NaN`

## Object.seal & Object.freeze

```js
const person = { name: 'Lydia Hallie' };

Object.seal(person);
// 如何修改 person
// person.name = "Evan Bacon"
// Object.seal 可以防止添加新属性，删除已存在熟悉
```

```js
const person = {
  name: 'Lydia Hallie',
  address: {
    street: '100 Main St',
  },
};

Object.freeze(person);
// 如何修改 person
// person.address.street = "101 Main St"
// Object.freeze 
// 无法添加、修改或删除任何属性
// 但它只是简单地冻结对象，如果属性是一个对象，那这个属性是可以修改的


## 箭头函数

```js
let config = {
  alert: setInterval(() => {
    console.log('Alert!');
  }, 1000),
};

config = null;

// setInterval 回调仍将每秒调用一次
// 当 config 对象被设置为 null 时，对象本身被释放，但是属性 alert 中的定时器函数并没有被释放。因为该定时器函数被设置为箭头函数，它引用了外部的作用域，即 config 对象，所以在定时器内部依然可以访问 config 对象。

// 因此，尽管 config 对象已经被释放，但是定时器函数依然可以每秒调用一次，并输出 'Alert!'。
```
