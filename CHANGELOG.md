# V2.2.0 
> 2017/12/6 

---
## Features
- 关于我们增加分享功能
- 关于我们增加有意思的语音
- `Button` 组件 字体大小 调整为 `14` => `16`
- `Modal` 组件 优化动画 淡入淡出, 调整间距,使其更扁平化
- `MusicPlayer`组件 增加几首新歌曲
- `Aritcle` 页面 增加 文章搜索功能
- `ArticleDetail` 文章详情页 优化动画,更平滑
- `Message` 组件 优化动画
- 服务端 api 请求超时 设为 10s

## Bug Fixs
- `fix` 文章页码 切换时 无动画 bug
- `fix` 排行榜 切换时 无动画 bug
- `fix` 文章详情页 评论数 bug
- `fix` reducer 默认值 的 bug



# V2.2.1
> 2018/3/21
## Features
- 增加 返回顶部 的功能
- 更换关于我们图片

## Bug Fixs
- 修复文章页刷新404 bug


# V2.3.0
> 2018/3/27
## Features
- 增加 service worker 缓存
- 增加 PWA 体验
- 增加 文章订阅消息推送
- 控制台新增打印 版本号

# V2.4.0
> 2018/4/27
- 修复网站刷新bug,重定向到index.html
- 文章增加分享
- 更新 `react-jinke-music-player` 播放器版本
- 新用户显示 欢迎页 老用户去掉
- 增加404 页面

# V2.5.0
> 2018/5/16
- 升级 `babel7`
- webpack 版本 使用 2.7.0
- 播放器版本 更新 3.4.2
- css 打包成多个css 
- 升级 `uglifyjs-webpack-plugin` 版本 修复 压缩js 失败的问题

# V2.5.1
> 2018/5/18
- 去掉 html5 操蛋 的 `manifest`
- server 设置 `Cache-Controller` 缓存
- 调整播放器初始位置

# V2.6.0
> 2018/5/24
- 升级 `HTTPS`
- 支持 `PWA`
- 网站初始化增加 `Loading`

# V2.7.0
> 2018/7/25
- 优化 `PWA`
- 增加 1周年庆活动
- 优化 `Modal` `Button` 组件 调整尺寸
- 增加 1周年庆活动相应接口
- 评论文章 增加通知


# V2.8.0
> 2018/8/7
- 优化 `PWA`
- 增加 `services worker`
- express 服务器相关 改为 `nginx` 配置
- 迁移服务器
- public/images 是一周年存放图片的地址
- public/logos 是 pwa 所需 icon的地址
- public/music 是音乐播放文件
