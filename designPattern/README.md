# design pattern

- [design pattern](#design-pattern)
  - [观察者模式](#观察者模式)
    - [使用 Proxy 实现观察者模式](#使用-proxy-实现观察者模式)

## 观察者模式

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

### 使用 Proxy 实现观察者模式

观察目标: `person`
观察者: `print`

```js
const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
```

思路：

- 定义了一个 Set, 观察者集合
- `observable` 函数返回一个原始对象的 Proxy 代理, 拦截赋值操作
- 拦截函数 set 中，执行所有观察者

```js
const observers = new Set();

const observe = fn => observers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  observers.forEach(observer => observer());
  return result;
}
```
