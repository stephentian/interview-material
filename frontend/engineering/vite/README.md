# vite

- [vite 插件](#vite-插件)
  - [转换自定义文件类型](#转换自定义文件类型)

## vite 插件

### 转换自定义文件类型

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // 如果可行将提供 source map
        }
      }
    }
  }
}
```
