//根据饿了么教程学习 https://zhuanlan.zhihu.com/p/26710831
//使用webpack2 新增import 方法 来实现按需加载
//webpack 2.4.0 ↑  按需加载写法
//使用 bable-pluginsyntax-dynamic 来解析import 语法
//并且使用第三提案 stage-3
// /* webpackChunkName:"Root" */  是新增的魔法注释  用来设置chunk的名字
//没设置就是 0.chunk.js  1.chunk.js  设置了就是 Root.chunk.js
import NProgress from "nprogress"
import "nprogress/nprogress.css"


const Root = () => loadRoute(import(/* webpackChunkName:"Root" */ 'app/components/Root'))
const Home = () => loadRoute(import(/* webpackChunkName:"Home" */ 'Home'))
const Photo = () => loadRoute(import(/* webpackChunkName:"Photo" */'app/routes/photo'))
const Talk = () => loadRoute(import(/* webpackChunkName:"Talk" */'app/routes/talk'))
const Article = () => loadRoute(import(/* webpackChunkName:"Article" */'app/routes/article'))
const ArticleDetail = () => loadRoute(import(/* webpackChunkName:"ArticleDetail" */'app/routes/articleDetail'))
const About = () => loadRoute(import(/* webpackChunkName:"About" */'app/routes/about'))
const Admin = () => loadRoute(import(/* webpackChunkName:"Admin" */'app/routes/admin'))
const MusicAdmin = () => loadRoute(import(/* webpackChunkName:"MusicAdmin" */'app/routes/admin/music'))
const NotFound = () => loadRoute(import(/* webpackChunkName:"NotFound" */'app/routes/notFound'))

//一周年活动页面
const OneYear = () => loadRoute(import(/* webpackChunkName:"Word" */'app/routes/oneYear'))

const loadRoute = (importFn,name="default")=>{
    NProgress.start()
    return importFn.then((module)=>{
        NProgress.done()
        NProgress.remove()
        return module[name]
    })
}

export default {
  path: "/",
  getComponent: Root,
  indexRoute: {
    getComponent: Home
  },
  childRoutes: [
    {
      path: "home",
      getComponent: Home
    }, {
      path: "photo",
      getComponent: Photo
    }, {
      path: "talk",
      getComponent: Talk
    }, {
      path: "article",
      getComponent: Article
    }, {
      path: "article/detail/:_id",
      getComponent: ArticleDetail
    }, {
      path: "about",
      getComponent: About
    }, {
      path: "admin",
      getComponent: Admin
    },{
      path: "/admin/music",
      getComponent: MusicAdmin
    }, {
      path: "oneYear",
      getComponent: OneYear
    },{
      path:"*",
      getComponent: NotFound
    }
  ]
}

//webpack 2.2 ↓  按需加载写法
//v2.1.0-beta.28  已废弃


// export default {
//   path: "/",
//   getComponent: loadComponent(System.import('app/components/Root')),
//   indexRoute: {
//     getComponent: loadComponent(System.import('Home'))
//   },
//   childRoutes: [
//     {
//       path: "home",
//       getComponent: loadComponent(System.import('Home'))
//     },
//     {
//       path: "photo",
//       getComponent: loadComponent(System.import('app/routes/photo'))
//     },
//     {
//       path: "talk",
//       getComponent: loadComponent(System.import('app/routes/talk'))
//     },
//     {
//       path: "article",
//       getComponent: loadComponent(System.import('app/routes/article'))
//     },
//     {
//       path: "article/detail/:_id",
//       getComponent: loadComponent(System.import('app/routes/articleDetail')),
//     },
//     {
//       path: "about",
//       getComponent: loadComponent(System.import('app/routes/about')),
//     },
//     {
//       path: "admin",
//       getComponent: loadComponent(System.import('app/routes/admin')),
//     },
//     {
//       path: "excel",
//       getComponent: loadComponent(System.import('app/routes/excel'))
//     }
//   ]
// }

