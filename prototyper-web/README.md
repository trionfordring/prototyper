# prototyper-web

[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)

## 目录结构概览

此包存放了前端代码，包含以下部分：

- build: 编译时需要用到的脚本文件
- editor: 编辑器相关包
  - /@prototyper: 编辑器的核心代码
    - /core: 编辑器核心包`@prototyper/core`，此包可以作为渲染器使用，也是其他包的核心依赖。
    - /editor: 标准编辑器实现
  - /examples: 编辑器示例代码
  - /materials: 编辑器的组件库代码
- web: 网站前端代码

## 构建

### 构建核心库`@prototyper/core`

```shell
pnpm run build:prod
```
