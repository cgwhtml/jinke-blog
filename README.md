# 李金珂的小屋

##### 手机访问

![lijinkeWeb](https://coding.net/u/lijinke/p/lijinkeWeb/git/blob/master/images/app.png)
 
##### PC访问

http://www.lijinke.cn


#### 使用技术栈:
- `React v16.X`
- `ES6,ES7`
- `webpack v3.0.0`
- `Redux`
- `React-Redux`
- `React-Router v3.x`
- `node.js`
- `yarn`
- `mongodb`
- `mongoose`
- `mocha`
- `chai`
- `less`
- `socket.io`

#### node环境
- `v8.9+`

##### 预览

![example](https://coding.net/u/lijinke/p/lijinkeWeb/git/blob/master/images/lijinkeWeb.gif)


- 安装依赖 
```
yarn
```
- 跑起来 
```
yarn start
```
- 打包 
```
yarn run build
```
- 开发server 
```
yarn run dev-server
```
- 生产server 
```
yarn run prod-server
```
- 连接数据库 
```
yarn run connect-db
```
- 备份数据库 
```
yarn run dump
```
- 写入数据库 
```
yarn run restore
```

#### 本地运行步骤

1. 克隆项目 `git clone https://github.com/lijinke666/lijinkeWeb.git`
2. 安装依赖 `yarn` 需要装一个 全局的 `nodemon` 和 `pm2`
3. 更改 `config/index.js` 的 `socket_port` 为你的 `本地ip`
3. 切换到目录 `cd lijinkeWeb` 连接数据库 `yarn run connect-db` 然后 拷贝数据库 `yarn run restore`
4. 运行前端 `yarn start` 等待打包 自动打开浏览器 `localhost:666`
5. 运行后端 `yarn run dev-server`

#### 如果你觉得还不错，请 `watch`  `star` 谢谢



##### 感悟
##### 转眼已工作快2年，见识了前端的很多大牛，自己不过是井底之蛙,有过自大，有过装逼打脸,唯有不断的学习才能让自己充实起来:)

###### 前端部分 
 - 参照之前公司架构师搭的react架子
 - webpack纯手打 :(，目前升级到了`v3.0.0` 根据知乎饿了么的专栏完成了按需加载 `code split`
 - 自己封装了一些网站需要的组件,`Modal`,`Message`,`Loading`,没错就是初始化加载骚气的svg动画
 - react,redux 用起来很舒服 终于慢慢脱离了jquery了哈哈,不过目前任然处于框架熟练工,下一步是了解下react的实现原理,diff算法,知其然,知其所以然
  - 写逻辑代码尽量想的是会有人来`code review` 竭尽我所能 写的好维护,优雅一些,在上家公司真的是得到了很多大公司的规范的开发体验,也提升了很多，尽管还是很多差强人意的地方,但这并不是结束,而是刚刚开始,利用下班之余和周末空闲时间,到2017/6/28,差不多2个月时间,完成了这个大概的版本
##### 后端部分
  - 一直认为本人用的不是nodejs 而是 `express` 框架,之前对底层了解的太少,像buffer,nodejs 原生net 模板之类的,都是工作后期才知道的,翻阅了朴灵大师的深入浅出nodejs ，实在惭愧，原来我真的是一个框架熟练工 express+一些fs模块的io操作 感觉写的并不是nodejs,
  - express 要开一个端口,dev-server 要开一个端口,之前考虑过dev-server-middle 但是不好用，后来还是采用双端口开发的模式, api请求用fetch去跨域请求,最后把常用的命令写在npm scripts 里面 ，真的挺方便的
  - 数据库采用的mongodb ，也是在上家公司学到的,感觉很适合前端,比mysql简单,没有主键之类的,配合mongoose 函数的操作,不错:)
##### 心得体会
  - 好像读书的时候写观后感啊。~ 茶余饭后，周末休息时不想打游戏，怎么办呢? 那就写代码吧,结果发现停不下来了，就干脆做个网站，博客性质的把，于是就写啊写，这种飞驰在指尖的感觉挺上瘾的，

- `赵日天,李日天师出同门,同为CV战神 ,终有一日,李觉得不能再如此,便勤奋撸码，提升自己`
- `赵日天说:`
  - 我做东西都是去找插件,找库,脚手架,他们的api我倒背如流
- `李日天说:`
  - 我做东西都是先自己搞一搞,不行再找插件,他们的api我还要用谷歌翻译一下才能看懂
- `尼古拉斯赵四找赵日天解决问题:`
  - 我知道有个xx库，你去试试
- `尼古拉斯赵四找李日天解决问题:`
  - 这个可以用原生的xx balalala
- `尼古拉斯说：赵日天比较靠谱,高效, 把库考过来调用方法就解决了,李日天就晓得给老子讲概念,让我自己去写,写屁啊`

- `赵日天 用 `npm start` 不知 `npm scripts`  用 create react app 不知 config.js 参数何意 用 $.post 以为post 传参 {key:value} 不知 是 ?key=value  用d3,echart, 不知 context.lineTo 为何物 不知 <Path ="M L ">是何物 用bootstrap  不知 媒体查询是何意 `
- `李日天 也和赵日天一样 脚踏jq,手持bootstrap,心怀99种 插件库心法绝技 , 直到有一天,师傅对他说 ` 
 - `知其然,知其如以然`
- `李日天幡然醒悟,日复一日,勤加练习,终成为一代搬运工`

