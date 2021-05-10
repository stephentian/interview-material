# 继承

JavaScript 本身不提供 `class` 实现( es6 提供了语法糖)，想要继承得基于原型。

继承都基于两种方式：

- 原型链，即子类的原型指向父类的实例从而实现原型共享。
- 构造函数，即通过js的apply、call实现子类调用父类的属性、方法；

## 目录

## 有哪些继承方式

- 原型链继承
- 构造函数继承
- 组合继承
- 原型式继承
- 寄生式继承
- 寄生组合式继承
- ES6 extends

## 原型链继承

要点：将父类实例作为子类的原型

```js
Sub.prototype = new Super()
Sub.prototype.constructor = Sub
```

优点：

- 简单、易懂
- 父类方法可以复用

缺点：

- 不能传参
- 父子构造函数的原型对象之间有共享问题

## 构造函数继承

要点：改变父类构造函数的 `this` 指向

```js
function Child(age) {
  Parent.call(this, age)
  // Parent.apply(this, arguments)
}
```

优点：

- 简单，不存在共享问题
- 可以传参

缺点：

- 没有继承原型链上的方法

## 组合继承

要点：原型链 + 构造函数

```js
function Child(age) {
  Parent.call(this, age)
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

优点：

- 解决了构造继承和原型链继承的缺点
- 父类的方法可以被复用
- 可以传参

缺点：

- 父类的构造函数被执行了两次
- 子类实例的属性存在两份。造成内存浪费

## 原型式继承

要点：借用 中间对象 实现原型继承，本质是对象的浅复制(`Object.create()`)

```js
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
Child = object(Parent)
```

优点：

- 父类方法可以复用

缺点：

- 不能传参
- 子类原型共享问题

## 寄生式继承

要点：封装原型式继承，创建一个封装继承过程的函数

```js
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
function inherit(o) {
  let clone = object(o)
  clone.say = function() {
    // ...
  }
  return clone
}
```

优点：

- 扩展父类方法

缺点：

- 不能传参
- 子类原型共享问题

## 寄生组合式继承

最常用的继承模式

要点：寄生继承跟组合继承的结合版

```js
// 1
function Child(age) {
  Parent.call(this, age)
  this.name = name
}
(function () {
  let F = function () {}
  F.prototype = Parent.prototype
  Child.prototype = new F()
  Child.prototype.constructor = Child
})()

// 2
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
function inherit(child, parent) {
  let prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}
function Child(age) {
  Parent.call(this, age)
}
inherit(Child, Parent)


// 3
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
function Child(age) {
  Parent.call(this, age)
}
```

优点：

- 解决了 组合继承唯一缺点：不用调用两次父类

缺点：

- 较为复杂

## ES6 extends

要点：class 语法糖, super

优点：

- 简单，易懂

缺点：

- 依赖 js 适配版本
