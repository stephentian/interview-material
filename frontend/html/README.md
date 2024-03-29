# HTML

## HTML5 新特性

1. 多媒体，`video` 和 `audio`
2. 图像绘画，`canvas` 和 `svg`
3. 离线存储，`localStorage` 和 `Cookies`
4. 连接特性，页面可以实时聊天，还有网页 `h5` 游戏体验，`Server-Sent Event` 和 `WebSocket`。
5. 性能与集成，`XML HttpRequest` 技术

## HTML5 新增标签

1. `audio, video, source, track, embed`
2. `datalist, output, keygen`
3. `header, section, aside, footer`

## HTML5 语义化

1. 标签语义化`header, footer` 等
2. 提高用户体验，`title, alt` 等
3. 有利于 SEO，语义化能和搜索引擎简历关系，有益于爬虫爬取更多有效信息。

## CSS/JS 引入位置

- `script` 放在 `</body>` 前面,
- `css` 放在 `head` 标签中，因为放在 `body` 里，那么 `DOM` 树构建完成，渲染树`render tree` 才构建，浏览器不得不重新渲染整个页面。
