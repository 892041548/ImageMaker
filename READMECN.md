<p align="center">
  <img src="/public/favicon.ico" alt="favicon">
</p>
<h1 align="center"> ImageMaker </h1>

## 介绍

Imkaer 是一款用来设计封面的工具，比如你可以为你的博客、视频、公众号等设计你自己喜欢的封面。

## 预览

![intro](/public/intro.png)

## 部署

🌟 第一步：创建一个`.env.local`文件，更改 `.env.local` 中的 `VITE_PUBLIC_UNSPLASH_API_KEY`

    VITE_PUBLIC_UNSPLASH_API_KEY = your_unsplash_api_key

[https://unsplash.com/documentation](https://unsplash.com/documentation)

💥 第二步：更改 `.env.local` 中的 `VITE_PUBLIC_HUGGINGFACE_API_KEY`

    VITE_PUBLIC_HUGGINGFACE_API_KEY = your_huggingface_api_key

[https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

🌈 第三步：克隆项目

    git clone git@github.com/892041548/ImageMaker.git
    cd ImageMaker
    npm i
    npm run dev

打开 http://localhost:5174 查看效果

## 感谢以下开源项目

https://github.com/slince-zero/IMaker


## 新特性
 - 通过 AI 生成图片 🔥
 - 通过 AI 解读图片 🔥

## 协议

GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007


### 如果你使用了 verbal 部署你的项目，请一定记得添加环境变量

### useContext 很灵活

通过 createContext 创建一个 contextProvider 就可以在任意组件里面传递数据，而且很灵活，可以直接在跟组件里面用 contextProvider 来包裹根组件。
也可以用它包裹任意你想传递数据的组件当中。

### 上传文件功能中的一些问题

```tsx
<label>
  <input
    type='file'
    onChange={handleUploadImage}
    className='hidden'
  />
  <Button
    variant='flat'
    isIconOnly
    as='span'>
    <UploadLogo />
  </Button>
</label>
```

这里的 `as=span` 是因为有一些默认行为，会影响事件上传功能的执行，所以这里用 `as='span'` 来修复这个问题。我试了一下用 `button` 来代替 `Button`,删除了一个特定的事件监听器之后，文件上传功能可以执行了，不过我忘记是哪个特定的事件了，但是那个事件不是 button 本身的监听器而是其他的，会针对 button。

```tsx
<input
  accept={accept}
  multiple={multiple}
  onChange={fileChange}
  type="file"
  ref={inputRef}
  style={{ display: 'none' }}
></input>
<Button handleClick={uploadClick} style={{ margin: '8px' }} type="primary">
  <UploadOutlined />
  上传
</Button>
```

- 第一种用`<label>`的方式是基于 HTML 标准的行为。标准的 HTML`<label>`元素可以关联到其它字段，当用户点击`<label>`时相当于点击了这些字段，甚至当这些字段不可见时也是这样。

- 第二种是更灵活的 JavaScript 方法。它不依赖于 HTML 的默认行为，而是需要额外的 JavaScript 代码来实现。通常在 uploadClick 函数内部会有一个额外的步骤来手动调用`<input>`元素的点击事件（比如 inputRef.current.click()）。与第一种方法不同的是，这个`<Button>`和`<input>`之间的行为不是通过 HTML 结构来实现的，而是通过 JavaScript 来控制的。

### 添加切换字体

记录一下过程：

1. 添加字体文件到 `src/assets/fonts` 目录下
2. 在 `inedx.css` 中引入（我这里没有使用 tailwind 的导入）
3. 定义 `fontValue` 的 state，和一个用于展示字体值的数组 `font_list`
   context 中传递 `fontValue` 和 `setFontValue` 还有 `handleChangeFont` 用于切换字体的方法

4. RightBoard 中接收 `handleChangeFont`，CenterBoard 中接收 `fontValue`

![图片](/src/assets/images/font.png)

### 下载功能

1. 定义了一个新的 `ImageDownloadContext`, 并且在其中提供了一个 `imageContainerRef` 和 `handleDownloadImage`
2. 在 `RightBoard` 中接收 `handleDownloadImage`，在 `CenterBoard` 中接收 `imageContainerRef`

### 组件间传递数据，数据类型丢失

`react-konva` 这个库中的 `Line` 组件要求传递的 `strokeWidth，必须为` number 类型

我在 context 中定义了 `penSize`，但是接收过来就成了 `any` 类型，查了一些文档之后，发现组件在传递数据的过程中，会因为多种原因导致数据类型丢失，所以这里就只能显示的定义一个数据类型了

```ts
interface ContextProp {
  boardTool: string
  penSize: number
}
const { boardTool, penSize } = useContext<ContextProp>(ImgContext)
```

### 关于撤销功能

```ts
// 监听键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 判断一下电脑系统
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.indexOf('windows') > -1) {
    // Windows系统
    if (e.ctrlKey && e.key === 'z') {
      // 移除最后一条线并更新状态
      setLines(lines.slice(0, lines.length - 1))
    }
  } else if (userAgent.indexOf('mac') > -1) {
    // Mac系统
    if (e.metaKey && e.key === 'z') {
      // 如果'command'键和'z'键同时被按下，移除最后一条线并更新状态
      setLines(lines.slice(0, lines.length - 1))
    }
  }
}
```

当我将 `if (e.metaKey && e.key === 'z')` 改为 `if (e.key === 'command' || e.key === 'z')` 的时候，摁下 `Command + Z` 也会生效，我自己测试是这个键同时按下第二个代码才会生效，就很奇怪，这似乎违反了它的逻辑？？

### 鼠标指针样式问题

一开始我以为是路径问题，发现控制台的网络请求可以正确看到指针的图片，最后发现是图片大小的问题。
在 Chrome、Firefox 和 Safari 中，自定义光标图像的最大高度和宽度都为 32px。如果你的图像超过这个限制，那么它只会显示为默认的光标。


点击左侧的图片后会通过AI解析图片的内容显示在右侧的标题&文案中，并翻译成中文;当然可以随时更改内容
注意：翻译功能仅限英文->中文