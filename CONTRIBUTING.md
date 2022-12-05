# Commit规范

## Commit Message 格式

```text
<type>(<scope>): <subject>
<空行>
<body>
<空行>
<footer>
```

上面是一次Commit后Message格式规范，分成标题，内容详情，结尾三个部分，各有各的用处，没有多余项。

示例:
```text
fix($sceDelegate): make resourceUrlWhitelist() is identical `trustedResourceUrlList()`

In commit a206e26, `$sceDelegateProvider`'s
`resourceUrlWhitelist()` was deprecated in favor of the new
`trustedResourceUrlList()`. However, although both properties were
assigned the same value, it was possible for an app to break if one of
the properties was overwritten in one part of the app (or a 3rd-party
library) while another part of the app interacts with the other,
non-overwritten property.

This commit fixes it by making `resourceUrlWhitelist()` a getter/setter
that delegates to `trustedResourceUrlList()`, ensuring that the two
properties will remain in sync. This, also, makes it consistent with
other similar deprecated properties, such as `$sceDelegateProvider`'s
`resourceUrlBlacklist()`.
```

头部即首行，是可以直接在页面中预览的部分，入上面图中所示，一共有三个部分`<type>`，`<scope>`，`<subject>`，含义分别如下

### Type

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

### Scope

用来说明本次Commit影响的范围，即简要说明修改会涉及的部分。

### Subject

用来简要描述本次改动，概述就好了，因为后面还会在Body里给出具体信息。并且最好遵循下面三条:

- 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
- 首字母不要大写
- 结尾不用句号(.)

### Body

`<body>`里的内容是对上面subject里内容的展开，在此做更加详尽的描述，内容里应该包含修改动机和修改前后的对比。

### Footer

footer里的主要放置不兼容变更和Issue关闭的信息。
