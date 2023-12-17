# typescript

- [基础知识](#基础知识)
  - [any](#any)
  - [never](#never)
  - [unknown](#unknown)
  - [in](#in)
  - [keyof](#keyof)
  - [Pick](#pick)
  - [泛型](#泛型)
- [例题](#例题)
  - [any 和 unknow](#any-和-unknow)
  - [interface 和 type](#interface-和-type)
  - [遍历一个对象类型，将不想要的类型标记为 never](#遍历一个对象类型将不想要的类型标记为-never)
  - [TS 类型过滤](#ts-类型过滤)

## 基础知识

### any

any 任意类型，定义为 any 类型的变量允许被赋值为任意类型

### never

不存在的值的类型。

值会永不存在的两种情况：

1. 例如抛出异常
2. 函数中执行无限循环的代码（死循环）

never 是 typescript 的唯一一个 bottom type，它能够表示任何类型的子类型，所以能够赋值给任何类型

值为 never 的 key，使用索引访问接口，值是无法被访问到的

```ts
// type Value = {  
//   name: "zero2one";   
//   age: 23  
// }["name" | "age"]  
// 等价于 type Value = "zero2one" | 23 

type Value = {  
  name: "zero2one";   
  age: never  
}["name" | "age"]  
// 等价于 type Value = "zero2one" 
```

### unknown

ts 所有基础类型的父类型，它是安全版本的 any 类型

### in

 in 可以遍历枚举类型，可以理解为 JavaScript 中的 `for in`

```ts
type Keys = 'a' | 'b' | 'c' | 'd'  
type Obj = {
  [T in Keys]: string;  // 遍历 Keys，把每个 key 都赋值 string 类型  
}  
/* 等价于   
  type Obj = {  
    a: string;  
    b: string;  
   c: string;  
   d: string;  
  } 
 */ 
```

### keyof

索引类型查询操作符，理解为 JavaScript 中的 Object.keys

```ts
interface Example {  
 a: string;  
  b: string;  
  c: number;  
  d: boolean;  
}  
type Keys = keyof Example   // 等价于 type Keys = 'a' | 'b' | 'c' | 'd' 
```

### Pick

筛选出类型 T 中指定的某些属性

```ts
// Pick 类型的实现
type Pick<T, K extends keyof T> = {  
    [P in K]: T[P];  
} 
```

```js
interface A {  
  a: 1;  
  b: 2;  
  c: 3;  
  d: 4;  
}  
type C = Pick<A, 'a' | 'c'>  // 等价于 type C = { a: 1; c: 3 } 
```

### 泛型

## 例题

### any 和 unknow

- any 会绕过类型检查
- unknown 必须判断完类型才能使用

### interface 和 type

共同点：都可以用来定义 对象或者 函数 的形状

不同点：

- interface 可以重复声明，type 会报错
- interface 继承用 `extends`，type 使用 `&` 实现
- type 可以定义 元组，联合类型
- type 可以定义 基本类型的别名 `type myStrng = string`

### 遍历一个对象类型，将不想要的类型标记为 never

```ts
type MarkUnwantedTypesAsNever<Source, Condition> ={  
  [K in keyof Source]: Source[K] extends Condition ? K : never  
} 
```

```ts
interface Example {  
    a: string; // ✅   
    b: string; // ✅    
    c: number; // ❌   
    d: boolean; // ❌   
}  
// 只要 Example 类型中的 string 类型的 key，非 string 的就标记为 never  
type MyType = MarkUnwantedTypesAsNever<Example, string>  
/*  
 等价于：  
 type MyType = {  
  a: 'a';  
  b: 'b';  
  c: never;  
  d: never;  
 }  
*/ 
```

### TS 类型过滤

相关地址: [TS 类型过滤](https://developer.51cto.com/article/699154.html)

```ts
type FilterConditionally<Source, Condition> = Pick<  
  Source,   
  {  
    [K in keyof Source]: Source[K] extends Condition ? K : never  
  }[keyof Source]  
>;
```

从一个对象类型中过滤出想要的元素

```ts
interface Example {  
    a: string; // ✅   
    b: string; // ✅    
    c: number; // ❌   
    d: boolean; // ❌   
}  
type NewType = FilterConditionally<Sample, string>  
/*  
 NewType 最终结果为：  
 {  
  a: string;  
  b: string 
 }  
*/
```
