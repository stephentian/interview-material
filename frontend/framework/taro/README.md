# taro

京东团队开发的统一开发多端应用的前端框架，使用 React 语法编写代码，然后可以编译成微信/京东/百度/支付宝/字节跳动小程序，H5, ReactNative 等。

Taro 3 可以支持转换到 H5、ReactNative 以及任意小程序平台。

## 框架工作原理

通过编译器 将代码转换成对应平台代码。采用 AST 语法树进行转换。

## 跨组件条件编译

```js
if (process.env.TARO_ENV === 'weapp') {
    // 微信小程序
} else if (process.env.TARO_ENV === 'h5') {
    // h5
}
```

## 对比uniapp

共同点：

1. 跨平台
2. 多端条件编译都是

    ```js
    /*  #ifdef  %PLATFORM%  */
    模板代码
    /*  #endif  */
    ```

差异点：

1. uniapp 配置文件是 json，taro 配置文件是 js
2. uniapp 运行时转换；taro 编译时转换，基于Babel和SWC(Speedy Web Compiler)实现代码转换
