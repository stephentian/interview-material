# 前端工程

- [前端工程](#前端工程)
  - [工程化、组件化、模块化](#工程化组件化模块化)
  - [模块化规范](#模块化规范)
    - [CommonJS](#commonjs)
    - [AMD](#amd)
    - [CMD](#cmd)
    - [ES Module](#es-module)
    - [CommonJS 和 ES6 Module区别](#commonjs-和-es6-module区别)
    - [为什么 CommonJS 可以循环引用](#为什么-commonjs-可以循环引用)
  - [前端构建工具演变流程](#前端构建工具演变流程)
  - [Webpack](#webpack)
    - [webpack 发展史](#webpack-发展史)
    - [打包器](#打包器)
    - [webpack 优势](#webpack-优势)
  - [Grunt](#grunt)
  - [Gulp](#gulp)
  - [Browserify](#browserify)
  - [Yeoman](#yeoman)
  - [Babel](#babel)
    - [AST](#ast)
  - [ESbuild](#esbuild)
    - [为什么快](#为什么快)
  - [vite](#vite)
  - [TypeScript](#typescript)
  - [微前端](#微前端)
    - [微前端，每个团队都有自己的选择，浏览器加载多个框架和重复的组件代码？](#微前端每个团队都有自己的选择浏览器加载多个框架和重复的组件代码)

前端工程化

- 自动化
- 规范化
- 傻瓜化

## 工程化、组件化、模块化

工程化 = 模块化 + 组件化 + 规范化 + 自动化

1. 模块化

    可以理解为对特定业务场景的封装, 是根据项目情况封装到一起的。

    可以按功能来分：登录模块，注册模块，权限模块，请求模块，弹窗模块等

    也可按业务场景来分：首页模块，个人中心页模块等

    - 业务分离，多人协作
    - 功能分离，可以自由组合，分离
    - 方便维护
    - 解决命名冲突

2. 工程化

    使用规范的软件工程技术进行项目的开发到交付，管理和维护。目的是提高质量和效率。

    包含以下:

    - 代码规范
    - 文件目录结构
    - 分支管理
    - 业务模块管理(可能由不同团队开发)
    - 代码测试
    - 自动化构建
    - 持续集成\部署 CICD

    主要是工具的体现: eslint, typescript, git, webpack, gitlab等

3. 组件化

    对某个具体功能的封装, 达到组件复用, 提高开发效率。列表组件, 预览图组件等

    “高内聚，低耦合”：一个函数（组件）只做一件事，两个模块间关联程度低。

    如何划分组件：
    1. 容器组件，无状态组件，UI 组件
    2. 基础公共组件，业务定制组件，区块容器（基础+业务），页面容器

## 模块化规范

### CommonJS

- 一个单独的文件就是一个模块
- 同步加载模块
- 输出模块指模块只有一个接口对象
- 最初被应用于 `Node.js`，成为 `Node.js` 的模块规范

`module` 是通过 new Module() 实例化得到的一个 CommonJS 模块实例

模块输出：`module.exports`

模块输入：`require`

### AMD

Asynchronous Module Definition 异步模块定义

AMD 推崇依赖前置，在定义模块的时候就要声明其依赖的模块

一般用于 require.js

- 多个 js 可能有依赖关系, 被依赖的文件要早于它自己加载到浏览器
- 异步加载，避免 js 加载的时候浏览器中止页面渲染

### CMD

Common Module Definition 通用模块定义

CMD 推崇异步依赖加载的，只有在用到某个模块的时候再去 require

国内流行，用于 SeaJS

### ES Module

ECMAScript Modul 规范

编译时输出，模块解析发生在编译阶段

导入导出

```js
// export => import {} from ''

// export default
// import * from ''
// import * as m from ''
```

### CommonJS 和 ES6 Module区别

- CommonJS 输出是一个值的拷贝, ES6 是值的引用
  - 值拷贝：把模块的值赋值给 `module.exports`，修改 require 的文件，当前文件不变
  - 引用：修改导入文件，当前文件会同步变化
- CommonJS 运行时加载，ES6 是编译时输出
  - 运行时: 指的是js 执行过程，只用脚步完成才生成对象
  - 编译时：JS 运行代码之前的编译过程
- CommonJS 模块的 require() 是同步加载模块，ES6 模块的 import 命令是异步加载
- CommonJS 模块循环引用不会报错；ES6 模块循环引用会导致 JS 错误
- CommonJS 的 this 指向当前 `module` 的 `exports`，ESM 指向 `undefined`

### 为什么 CommonJS 可以循环引用

在 `require` 一个模块时，存在缓存机制`require.cache`。加载模块时会先判断是否存在该模块的缓存，如果存在，就会直接返回缓存中该模块的`module.exports`。而不会再次执行模块代码。

只有在第一次加载模块A时，模块 A 的代码才会被执行，之后不管你再require('A')多少次都不会再执行模块 A 的代码

## 前端构建工具演变流程

1. `grunt`
2. gulp fis3
3. webpack parcel rollup
4. vite

## Webpack

静态模块打包器(module bundler)

[webpack](./webpack/README.md)

### webpack 发展史

- js 很多新语法，旧浏览器不兼容
- 预编译语言, ts, less, sass
- 前端框架的流行

需要一个提升代码开发效率的工具，webpack 应运而生

### 打包器

webpack 将所有的资源模块：js/css/img 等都被视作模块。

一个文件中又会引入其他文件的内容，我们最终要实现的就是以某一个文件为入口：然后将所有这些模块打包成一个或多个bundle，最后组成页面。

Webpack 核心只处理 JS 和 JSON，处理其他（css, img）等需要 Loader

### webpack 优势

- Grunt/Gulp 强调自动化，而没有模块化
- 有很多工具, 文件压缩，预处理
- 更好的生态链，开发体验有保证

## Grunt

过获取到的JSON 配置执行操作，来流水线式执行相应任务。

## Gulp

一个基于流的自动化构建工具，无需写一大堆繁杂的配置参数

## Browserify

本地起一个 server , 在浏览器端运行使用require加载的js代码

## Yeoman

- 一个通用的脚手架搭建系统，可以创建任何的类型的app。
- ”语言无感知”的，支持创建任何类型开发语言的项目，Web,Java, Python, C#等。

所有的操作都是通过 Yeoman 环境里面的各种 generator 实现的。通过自定义 generator，我们可以创建任何格式的项目目录。

## Babel

babel的核心步骤:

1. 解析(parse)
2. 转换(transform)
3. 生成(generate)

将代码解析成抽象语法树(AST)，然后我们就可以对我们想要的节点进行操作，转换成新的AST，然后再生成新的代码。

### AST

Abstract Syntax Tree 抽象语法树

在线转换 ast : [astexplorer](https://astexplorer.net/)

编译过程

1. 词法分析
   - 会移除空白符，注释等
   - 扫描 scanner，读取代码分割成 tokens列表
2. 语法分析
   - 解析器，将 数组转化成 树形表达形式
   - 验证语法，语法错误，抛出错误

AST不是100%与源码匹配的， js 源码解析器会一个一个字母地读取代码

```js
function foo(a) {
  const b =  1;
  return b;
}

// 转换为
{
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 47,
      "id": {
        "name": "foo"
      },
      "params": [
        {
          "name": "a"
        }
      ],
      "body": {
        "body": [
          {
            "type": "VariableDeclaration",
            "declarations": [
              {
                "id": {
                  "type": "Identifier",
                  "name": "b"
                },
              }
            ],
            "kind": "const"
          },
          {
            "type": "ReturnStatement",
            "argument": {
              "name": "b"
            }
          }
        ]
      }
    }
  ]
}
```

## ESbuild

使用 go 编写的类似 webpack 构建工具。它的构建速度是 webpack 的几十倍

### 为什么快

- js 是单线程串行，esbuild 是新开一个进程，然后多线程并行
- 不使用 AST，优化了构建流程

## vite

基于 ES module 实现了一个更轻快的项目构建打包工具

特点：

- 面向现代浏览器。在服务端按需编译返回，不进行打包。
- 热更新
- 按需进行编译，不会刷新全部的DOM。vite只需要在浏览器请求源码时进行转换并按需提供源码。

vite 是构建工具的封装，内部是 rollup。

为什么使用 vite 替代 webpack？

- vite 生产基于 rollup，（打包体积小）
- vite 开发环境，基于 ESBuild 进行预编译打包，并进行缓存，按需返回。
- 总体构建比 webpack 快 10 - 100倍。

## TypeScript

link: [typescript](./typescript/README.md)

## 微前端

微前端 Micro-Frontends，一种类似微服务的架构。

### 微前端，每个团队都有自己的选择，浏览器加载多个框架和重复的组件代码？

解决方案：

1. 统一版本管理：对于每个团队使用的技术栈和框架，可以进行版本统一管理，确保不同团队使用的版本一致，这样可以减少重复的代码和框架的加载。

2. 使用公共依赖库：可以将多个团队共同使用的依赖库单独打包成一个公共依赖库，这样就可以减少重复的组件代码和框架的加载。

3. 懒加载和按需加载：可以通过懒加载和按需加载的方式，仅在需要的时候加载组件和框架，减少页面的初始化时间和加载时间。可以使用类似于 Webpack 的代码分割和动态导入的功能，将不同团队的代码分开打包，按需加载。

4. 使用 CDN 或缓存：可以使用 CDN 或者缓存的方式，将公共的组件和框架文件缓存起来，这样可以减少重复的加载和请求，加快页面的加载速度。

5. 代码合并和压缩：可以对不同团队的代码进行合并和压缩，减少代码体积和请求次数，提高页面的加载速度和性能。

