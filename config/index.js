const mode = process.env.NODE_ENV || "development"
const isDEV = mode === "development"

//前后端 开发环境 生产环境  host port 配置

const options = {
  host: isDEV ? "http://localhost" : "https://www.lijinke.cn",
  dev_port:6688,
  socket_host: isDEV ? "http://localhost" :  "https://www.lijinke.cn",
  socket_port:1997,
  PORT: 8020,
  //PORT: 443,
  cacheMaxAge:60 * 60 * 24 * 30,           //缓存一个月
  origin:"lijinkeWeb",
  github:"https://github.com/lijinke666",
  staticPath: __dirname + '/../public',
  db_path:  'mongodb://localhost/lijinkeWeb',
  emailService: "qq", //邮件服务商
  adminEmail: "请填写", //发邮件的人邮箱
  AUTHCODE: "请填写", //授权码
  staticPath: __dirname + '/../public',
  currentMonth: new Date().getMonth() + 1,
  companyName: "李金珂的小屋", //公司名字
  copyright:"Copyright @ 2017 By 李金珂 jinke.Li, 使用代码请保留此署名, MIT 开源协议"
}
options.port = isDEV ? ":" + options.PORT : ""

module.exports = options
