/*
 * @Author: jinke.li
 * @Date: 2017-07-17 19:43:28
 * @Last Modified by: jinke.li
 * @Last Modified time: 2019-05-22 16:01:27
 */
//依赖
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const timeOut = require("connect-timeout");
const { PORT } = require("../config");
const mode = process.env.NODE_ENV || "development";
const { log4js, HTTP_logger } = require("./utils/logHelper");


app.use(
  log4js.connectLogger(HTTP_logger, {
    format: ":remote-addr :method :url :status :response-time ms",
    nolog: "\\.js|\\.html$"
  })
);

//中间键部分
//防止修改头部 会导致 http => 跳转到 https 的问题
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: false
  })
);
// app.use(compress()); //GZIP 压缩
// app.use(
//   "/socket.io",
//   proxy(`${host}:${socket_port}`, {
//     forwardPath: function(req, res) {
//       console.log(url.parse(req.url).path);
//       return `/socket.io${url.parse(req.url).path} `;
//     }
//   })
// );
// app.use(
//   express.static(process.cwd() + "/dist/", {
//     setHeaders(res) {
//       res.setHeader("Cache-Control", "public,max-age=2592000");
//     }
//   })
// );
// app.use(
//   express.static(process.cwd() + "/public/", {
//     setHeaders(res) {
//       res.setHeader("Cache-Control", "public,max-age=2592000");
//     }
//   })
// );
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })); // 转换 application/x-www-form-urlencoded
app.use(cookieParser()); //cookie
app.use(cors()); //跨域
app.use(require("../server/middleware/logger")); //日志
app.use(require("./middleware/getFetchData")); //转换fetch 过来的body   添加到 req.body

//刷新跳转 index.html 去匹配 react-router 的路由
// app.get("*", (req, res, next) =>{
//   if (!req.path.startsWith("/api")) {
//     return res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
//   }
//   next();
// });

//http => https 跳转
/**
app.all("*",(req,res,next)=>{
    if(req.secure){
        return next();
      };
    res.redirect(`https://${req.hostname}${req.url}`);
})
*/




//api部分
//接口 统一 res.data = xxx   apiHandler中间键统一处理包装
require("./api/talk");
app.use("/api", timeOut("10s"));
app.use("/api/article", require("./api/article"));
app.use("/api/admin", require("./api/admin"));
app.use("/api/music", require("./api/music")); //上传音乐可能超过10s 所以不放在api下面 防止抛出错误
app.use("/api/oneYear", require("./api/oneYear"));

app.use(require("./middleware/apiHandler")); //统一包装接口返回结果 res.data = xxx
app.use(require("./middleware/errorHandler")); //错误处理

//端口启动部分
app.set("port", process.env.PORT || PORT);
const port = app.get("port");

const serverRuningInfo = `
    =============== [ My React App ] ===============
    =============== [ lijinke house ] ================
    =============== [ port : ${port} ] ==============
    =============== [ mode : ${mode} ] ==============
                        :)
`;
http.createServer(app).listen(port, ()=> console.log(serverRuningInfo));
//https.createServer(sslOptions, 443).listen(port,()=> console.log(serverRuningInfo));
