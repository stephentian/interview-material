# HTML

HTML5 的标准制定组织 WHATWG（Web Hypertext Application Technology Working Group）

HTML 标准文档：https://html.spec.whatwg.org/multipage/

## HTML5 新特性

HTML5 是 2006年 发布的，新特性：

1. `<!DOCTYPE html>`, 告知浏览器当前页面是使用 `HTML5` 规范编写的
2. 多媒体，`video` 和 `audio`
3. 图像绘制，`canvas` 和 `svg`
4. 离线存储，`localStorage` 和 `Cookies`
5. 连接特性，页面可以实时聊天，还有网页 `h5` 游戏体验，`Server-Sent Event` 和 `WebSocket`。
6. 请求方式，`XML HttpRequest` 技术

## HTML5 新增标签

1. 多媒体：`audio, video`
2. 内嵌内容：`source` 为 picture、audio 或 video 元素指定多个媒体资源；`embed` 将外部内容嵌入文档中的指定位置。
3. 表单元素：`datalist, output, keygen`
4. 布局：`header, aside, footer`，`nav` 导航部分， `article` 内容，`section` 内容某个区域

## HTML5 语义化

1. 标签语义化`header, footer` 等
2. 提高用户体验，`title, alt` 等
3. 有利于 SEO，语义化能和搜索引擎建立关系，有益于爬虫爬取更多有效信息。

## CSS/JS 引入位置

- `script` 放在 `</body>` 前面,
- `css` 放在 `head` 标签中，因为放在 `body` 里，那么 `DOM` 树构建完成，渲染树`render tree` 才构建，浏览器不得不重新渲染整个页面。
