# 优化

- [优化](#优化)
  - [性能测评工具](#性能测评工具)
  - [js 代码优化](#js-代码优化)
  - [网络优化](#网络优化)
  - [文件优化](#文件优化)
    - [图片优化](#图片优化)
    - [其他文件优化](#其他文件优化)
  - [其他](#其他)
    - [使用 webpack 优化项目](#使用-webpack-优化项目)
    - [观察内存泄露](#观察内存泄露)
  - [项目体积优化](#项目体积优化)

## 性能测评工具

- chrome
- console.time() timeEnd()
- 测评网站 jsperf.com 或 jsbench.com

## js 代码优化

- 全局变量
  - 慎用
  - 局部存储
- 通过原型新增方法
- 闭包陷阱
- for 循环优化
- 节点添加优化

闭包

- 闭包就是外部作用域可以访问函数内部作用域的数据。  
- 闭包很容易出现内存泄漏

for 循环优化

- 把 length 存放到一个变量上

节点添加优化

- 节点添加会造成 回流 和 重绘
- 使用 `document.createDocumentFragment()` 创建一个虚拟节点对象
- 使用虚拟节点 `appendChild` 节点，减少 `DOM` 的重绘

## 网络优化

DNS 预解析

网络缓存

- 强缓存

强缓存的两种实现方式： `Expires` 和 `Cache-Control`。

`Expires` 受限于本地时间，修改本地时间，可能造成缓存失败
`Cache-Control` 是服务端时间。
返回 200。

- 协商缓存

如果缓存过期，则使用协商缓存来解决问题。协商缓存需要请求，如果缓存有效则返回 304.
有两种实现方式：`Last-Modified` 和 `Etag`

使用 http/ 2.0

预渲染

```html
<link rel="prerender" href="">
```

懒加载

把不关键的资源延后加载。

## 文件优化

### 图片优化

1. 不用图片，部分可以使用 css
2. 移动端，没必要加载原图。使用 CDN 加载。
3. 小图使用 base64 格式。
4. 多个图标文件整合到一张图上(雪碧图)

### 其他文件优化

1. CSS 放 `head` 中
2. 服务端开启文件压缩功能
3. 将 `script` 标签放在 `body` 底部，因为 JS 执行会阻塞渲染。
   当然，也可以将 `script` 放在任意位置加上 `defer`， 表示该文件会并行加载，但是会放在
   HTML 解析完成后顺序执行。
4. 执行 JS 代码过长，需要很多时间计算的代码可以考虑使用 `Webworker`。`Webworker` 可以让我们另开一个线程执行脚本而不影响渲染。

## 其他

### 使用 webpack 优化项目

1. 对于 Webpack4， 打包项目使用 production 模式，会自动开启代码压缩。
2. 使用 ES6 模块来开启 Tree shaking, 这个技术可以移除没有使用的代码。
3. 按路由拆分代码，实现按需加载。
4. 给打包出来的文件添加哈希，实现浏览器缓存文件。

### 观察内存泄露

使用 Chrome 打开页面， 然后打开 Chrome 的任务管理器。

Mac 下打开 Chrome 任务管理器的方式是选择 Chrome 顶部导航 > 窗口 > 任务管理；在 Windows 上则是 Shift + Esc 快捷键。

在页面中操作多次， 如果在 Chrome 任务管理中发现内存的使用在增加, 说明内存从未被回收。

## 项目体积优化

- 使用 webpack-bundle-analyzer 查看打包出来文件的体积大小，看看是哪个包比较大
- 依赖 按需加载，比如 element 组件，金山文档组件，第三方组件
- 采用更小大库，比如 moment.js 200+kb, day.js 压缩后 2 kb
- 开启 tree shaking ，摇树功能，对于导出的模块，有些方法没有被使用到，最终是不会放到打包的文件中的，可以减少一些代码体积
- url-loader（将小图片打包进 html 中，减小图片数量）；terser-webpack-plugin、uglifyjs-webpack-plugin（压缩 js 文件）；更合理的拆包策略（webpack SplitChunksPlugin）
- 开启 gzip, 服务端配合
