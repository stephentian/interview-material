# typescript

- [基础知识](#基础知识)
  - [any](#any)
  - [never](#never)
  - [unknown](#unknown)
  - [泛型](#泛型)
    - [泛型过滤](#泛型过滤)
- [例题](#例题)
  - [any 和 unknow](#any-和-unknow)
  - [interface 和 type](#interface-和-type)

## 基础知识

### any

any 任意类型，定义为 any 类型的变量允许被赋值为任意类型

### never

不存在的值的类型。

值会永不存在的两种情况：

1. 例如抛出异常
2. 函数中执行无限循环的代码（死循环）

never 是 typescript 的唯一一个 bottom type，它能够表示任何类型的子类型，所以能够赋值给任何类型

### unknown

ts 所有基础类型的父类型，它是安全版本的 any 类型

### 泛型

#### 泛型过滤

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

## 例题

### any 和 unknow

- any 会绕过类型检查，unknown 必须判断完类型才能使用

### interface 和 type

共同点：都可以用来定义 对象或者 函数 的形状

不同点：

- interface 可以重复声明，type 会报错
- interface 继承用 `extends`，type 使用 `&` 实现
- type 可以定义 元组，联合类型
- type 可以定义 基本类型的别名 `type myStrng = string`
