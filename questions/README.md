# Questions

- [js 相关](#js-相关)
  - [常见 js 问题](#常见-js-问题)
  - [为什么 0.1 + 0.2 不等于 0.3](#为什么-01--02-不等于-03)
- [兼容性](#兼容性)
  - [为什么 IOS 底部元素 position fixed 会被 输入法顶上去，而安卓不会](#为什么-ios-底部元素-position-fixed-会被-输入法顶上去而安卓不会)
- [B 端和 C 端区别](#b-端和-c-端区别)
- [职业发展](#职业发展)

## js 相关

### 常见 js 问题

1. 变量提升
2. 变量隐式创建
3. this 指向
4. 闭包
5. 异步处理
6. 类型转换
7. 内存泄漏

### 为什么 0.1 + 0.2 不等于 0.3

1. 0.1 和 0.2 在二进制下是无限循环的小数
2. `0.1 = 0.0001100110011001100110011001100110011001100110011...`（无限循环），`0.2 = 0.001100110011001100110011001100110011001100110011...`（无限循环）
3. JavaScript 中，采用的是 IEEE 754 标准的双精度浮点数表示法，这种表示法只能精确地表示部分小数，而对于无限循环小数，只能使用近似值进行表示，因此在进行浮点数计算时，可能会出现精度误差。
4. 由于浮点数的精度限制，JavaScript 引擎只能保留一定的位数，因此得到的结果是近似值：0.1 + 0.2 = 0.30000000000000004

如何解决：

1. 使用第三方库如 Decimal.js 或者 BigNumber.js
2. 使用整数进行计算并将结果转换为浮点数

所有采用 IEEE 754 标准的浮点数表示法的编程语言都可能存在浮点数精度误差的问题，包括 Java、C++、C#、Python、Ruby 等等。

## 兼容性

### 为什么 IOS 底部元素 position fixed 会被 输入法顶上去，而安卓不会

1. 因为 IOS 和安卓在处理输入法和页面的关系时采用了不同的方式。
2. 在 iOS 中，输入法弹出时，操作系统会将页面向上滚动，以保证输入框不被输入法遮盖，而 position fixed 的元素会跟随页面一起滚动，因此会被输入法顶上去。
3. 在安卓中，输入法弹出时，会将输入框顶上去，而页面不会滚动，因此 position fixed 的元素不会受到影响。

解决方案:

在 iOS 中使用 JavaScript 监听输入法的弹出和收起事件，在输入法弹出时，将 position fixed 的元素的样式改为 position absolute 并修改 top 属性，使其在页面顶部，输入法收起时再将其改回 position fixed。这样可以保证在 iOS 中输入法弹出时 position fixed 的元素不会被顶上去。

```js
var isIOS = /(iPhone|iPad|iPod)/i.test(navigator.userAgent);

if (isIOS) {
  var fixedElement = document.getElementById('fixed-element');
  var initTop = fixedElement.getBoundingClientRect().top;
  
  var onKeyboardShow = function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var keyboardHeight = window.innerHeight - scrollTop - window.innerHeight * 0.7;
    fixedElement.style.position = 'absolute';
    fixedElement.style.top = (initTop - keyboardHeight) + 'px';
  };
  
  var onKeyboardHide = function() {
    fixedElement.style.position = 'fixed';
    fixedElement.style.top = initTop + 'px';
  };
  
  window.addEventListener('focusin', onKeyboardShow);
  window.addEventListener('focusout', onKeyboardHide);
}
```

## B 端和 C 端区别

- B 端: toB Business 面对商业用户
- C 端: toC Customer 面对消费者

B 端

一般多为内部平台, 内部管理系统(ERP, OA, CMS 等)

- 不用考虑极致的性能优化
- 不用考虑浏览器兼容性
- 多考虑组件的复用性，设计，拆分
- 数据模型构建，比如数据可视化等
- 一个某某系统便于申请专利

C 端

一般对外落地页, 或者媒体应用等核心产品

- 流量大, 需要 CDN 和缓存
- 用户群体不稳定, 手机, 浏览器, ipad 等的兼容性
- 需要全面的性能优化(网络, 内存等)
- 数据统计, 监控

## 职业发展

1. 工作稳定，融入公司，开展更多工作
2. 技术提升，了解新技术
3. 个人规划，学历，家庭等
4. 主要还是要结合公司需求和公司发展方向，一个人技术再强，或者要做强，都是依赖业务和公司的，这个是主要方向。
