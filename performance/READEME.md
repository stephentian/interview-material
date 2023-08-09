# 优化

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
- [开发构建性能优化](#开发构建性能优化)
- [生产构建性能优化](#生产构建性能优化)
- [页面加载性能优化](#页面加载性能优化)
  - [1.距离足够短](#1距离足够短)
  - [2.请求足够少](#2请求足够少)
  - [3.传输足够小](#3传输足够小)
  - [4.资源要复用](#4资源要复用)
  - [5.标签要摆好](#5标签要摆好)
  - [6.降维来优化](#6降维来优化)
- [页面运行性能优化](#页面运行性能优化)

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

## 开发构建性能优化

1. 使用include或exclude排除不相关的目录，缩小构建打包范围
2. 使用缓存，比如：开启babel-loader的cacheDirectory，或使用cache-loader或hard-source-webpack-plugin对相应loader进行缓存配置
3. 使用threads-webpack-plugin或happy-pack进行多线程或多进程打包
4. 使用DLLPlugin把公共代码库抽取成dll，再使用DLLReferencePlugin引入，提升二次构建打包速度
5. 合理配置resolve.modules里的模块搜索路径
6. 合理配置resolve.extensions里的后缀顺序
7. 可以适当关闭一些代码文件的压缩开关和相关的loader和plugin
8. 最后可以使用speed-measure-webpack-plugin来进行具体loader执行时间的分析

## 生产构建性能优化

1. 配置Webpack的TreeShaking  
   - babel的preset-env里的modules属性的值要设为false  
   - 导出和引入模块时使用ES Modules  
2. 配置babel使用@babel/plugin-transform-runtime和corejs3，减少冗余的babel公共代码
3. 使用url-loader配置文件大小的最小阈值，把小文件以data uri的形式内嵌
4. 使用mini-css-extract-plugin把CSS拆分成样式文件
5. 使用purgecss-webpack-plugin去除无用的样式代码
6. 开启相关的代码文件的压缩开关和相关的loader和plugin  
   - html-webpack-plugin（minify参数属性可开启相关压缩）
   - optimize-css-assets-webpack-plugin
   - terser-webpack-plugin
7. 配置splitChunks，抽离公共代码库或被其他模块引入较多的代码库（如：React、React-DOM，）
8. 配置externals减少打包体积（如：React、React-DOM，可以改由在首页HTML以CDN的形式引入）
9. 最后可以使用webpack-bundle-analyzer来进行具体bundle情况的分析

## 页面加载性能优化

### 1.距离足够短

 静态资源（CSS、JS、图片）放在CDN服务器

### 2.请求足够少

1. 减少HTTP请求：一般浏览器都会限制单个域名的并发HTTP请求数为4-6个，单个页面总的并发HTTP请求数一般在12个左右，根据浏览器不同而不同。而且每个HTTP/S请求都需要进行DNS查找、TCP连接建立、TLS连接建立、HTTP/S连接建立，之后才开始消息通讯
   - 合并CSS
   - 合并JS
   - 合并小图片为一张雪碧图
   - 小图标可以使用icon-font
   - 小图片可以使用svg
   - 小图标可以使用CSS绘制
   - 小资源可以通过data-uri的形式内嵌

### 3.传输足够小

1. 压缩资源：减少资源大小可以加快网页的加载速度
   - 压缩HTML文档
   - 压缩CSS样式文件
   - 压缩JS脚本文件
   - 压缩图片，或使用webP格式的图片
2. 开启服务端的Gzip
3. 懒加载（按需加载）：将不影响首屏当前屏的资源放到需要时才进行加载，可以大大提升重要资源的显示速度和降低总体流量的使用  
   *按需加载可能会导致页面进行大量的重排重绘，影响页面运行性能
   - 图片懒加载
   - 组件懒加载  
     使用React的Suspend组件和React.lazy进行组件的按需加载
   - 路由懒加载  
     可以在配置React的路由懒加载
   - Chunk懒加载  
     配置Webpack的spilitChunk为async模式
4. 预加载（预先加载）：大型应用可以使用预加载把即将使用到或可能用到的资源进行提前加载
   - prefetch（编写JS时使用动态import的时候，使用Webpack的prefetch magic comment）
   - preload（编写JS时使用动态import的时候，使用Webpack的preload magic comment）
   - dns-prefetch（DNS预解析）

### 4.资源要复用

1. 充分利用缓存：使用缓存可以充分提升页面二次加载的性能
   - 除了首页HTML文档缓存一切可以进行缓存的资源，在资源文件名中加入内容摘要字符串，配置长时间的强缓存
   - 特别是拆分出常用，但不常变动的CSS样式为单独的样式表文件
   - 特别是拆分出常用，但不常变动的JS库代码为单独的脚本文件
   - 但是特殊的是首页的HTML文档需要配置成协商缓存

### 5.标签要摆好

无阻塞：正常的外部JS脚本文件的加载、解析、执行会阻塞HTML文档的解析和DOM树的构建动作，而外部的CSS样式表文件的加载、解析会阻塞页面的渲染动作\

- head元素内引入外部CSS样式表文件
- body元素底部引入外部JS脚本文件
- 不重要的外部JS脚本文件可以放在head元素中使用defer和async属性

### 6.降维来优化

使用高版本的HTTP协议，如：HTTP2，可以充分利用其二进制分帧、多路复用、头部压缩、服务器推送、数据流优先级的特性来提升页面的加载性能

## 页面运行性能优化

1. 避免编写复杂的CSS选择器
2. 尽量使用flex或者grid进行布局
3. 避免触发重排和重绘
   - 减少不必要的DOM操作
   - 减少DOM元素大小或者位置的变化，避免重排
   - 减少DOM元素颜色或者类似border-style之类的CSS属性的变化，避免重绘
   - 尽量改变元素的class，而不是style
   - 使用classList代替className
   - 尽量使用transform和opacity，他们可以跳过重排重绘直接合成渲染
4. 动画优化
   - 使用transition和animation来实现CSS动画
   - 使用requestAnimationFrame替代setTimeout、setInterval实现动画，
5. 高频事件优化：
   - 使用防抖或节流函数
   - 使用IntersectionObserver来进行可见区域监听
   - 使用事件代理，避免批量绑定事件
6. 可以使用WebWorker进行辅助计算
7. 不要覆盖原生方法
