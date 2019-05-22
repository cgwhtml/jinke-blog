//nodejs 原生错误处理模块
const debug = require('debug')('server')
const domain = require('domain').create()

//相当于 try catch 补货全局错误
domain.on("error",({message})=>{
    debug(`【server error】: ${message}`)
})
domain.run(()=>{
    require('./server/app')
})