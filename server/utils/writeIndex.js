const fs = require('fs')
const path = require('path')
const debug = require('debug')('writeIndex')

module.exports = function () {
    if (fs.existsSync(path.resolve(__dirname, '../../public/static'))) {
        const distIndexHtml = fs.readFileSync(path.resolve(__dirname, '../../public/static/index.html'))
        const distIndexCache = fs.readFileSync(path.resolve(__dirname, '../../public/static/lijinkeWeb.appcache'))
        fs.writeFileSync(path.resolve(__dirname, '../../public/index.html'), distIndexHtml)
        fs.writeFileSync(path.resolve(__dirname, '../../public/lijinke.appcache'), distIndexCache)
        debug('写入index.html成功');
        debug('写入lijinkeWeb.appcache成功');
    }

}