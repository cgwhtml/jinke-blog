const fs = require("fs")
const path = require("path")
const { staticPath, currentTime } = require('./config')

const cacheFilePath = `${staticPath}/lijinkeWeb.appcache`       //写入文件
const cacheFileTempPath = `${__dirname}/cacheTemp.tpl`       //模板文件
const versionPath = `${__dirname}/cacheVersion.txt`         //版本号

const dirNameConfig = {
    "js": "/static/js",
    "images": "/static/images",
    "css": "/static/css",
    "fonts": "/static/fonts",
    "icon": "/index.ico"
}

const tempStringConfig = {
    date: "{date}",
    version: "{version}",
    cssPath:"{cssPath}",
    fontsPath:"{fontsPath}",
    imagesPath:"{imagesPath}",
    iconPath:"{iconPath}"
}

const helper = {
    file: null,
    //读取缓存模板文件
    readCacheFile(path) {
        console.log(`读取${path}`)
        const data = fs.readFileSync(path).toString()
        this.file = data
        console.log('模板读取成功')
    },
    getVersion() {
        let version = (fs.readFileSync(versionPath).toString()) >>> 0
        const newVersion = version += 0.01
        fs.writeFileSync(versionPath + "", newVersion + "")
        console.log(`【版本号】 ${version -= 0.01} =>>> ${newVersion}`)
        return newVersion
    },
    //替换文件路径
    replaceFileData(file) {
        const date = currentTime()
        const replaceData = this.file.replace(tempStringConfig['date'], date)
        return (time) => (version) => (cssPath) => (jsPath) => (fontsPath) => (imagesPath) => (iconPath) => {
            return this.file.replace(tempStringConfig['date'], time)
                .replace(tempStringConfig['version'], version)
                .replace(tempStringConfig['cssPath'], cssPath)
                .replace(tempStringConfig['fontsPath'], fontsPath)
                .replace(tempStringConfig['imagesPath'], imagesPath)
                .replace(tempStringConfig['iconPath'], iconPath)
        }
    },
    //读取文件路径
    readFilePath() {
        // const jsPath = this.transformFilePath(fs.readdirSync(`${__dirname}/public/static/js`), dirNameConfig['js'])
        const fontsPath = this.transformFilePath(fs.readdirSync(`${__dirname}/public/static/fonts`), dirNameConfig['fonts'])
        const imagesPath = this.transformFilePath(fs.readdirSync(`${__dirname}/public/static/images`), dirNameConfig['images'])
        const cssPath = this.transformFilePath(fs.readdirSync(`${__dirname}/public/static/css`), dirNameConfig['css'])
        const iconPath = dirNameConfig['icon']
        return {
            // jsPath,
            fontsPath,
            imagesPath,
            cssPath,
            iconPath
        }
    },
    //转换文件路径
    //目前关于我 不需要网络  单独分离出来 其他不缓存
    transformFilePath(paths = [], typeDir) {
        if (paths.length <= 1) {
            return `${typeDir}/${paths[0]}\n`
        } else {
            if (typeDir == dirNameConfig['js']) {
                let o = {
                    needNetWork: "",
                    notNeedNetWork: ""
                }
                paths.forEach((path) => {
                    // if (!/(root|about)/gi.test(path)) {
                    o.needNetWork += `${typeDir}/${path}\n`
                    // } else {
                    //     o.notNeedNetWork += `${typeDir}/${path}\n`
                    // }
                })
                return o

            } else {
                return paths.reduce((str, next) => {
                    str += `${typeDir}/${next}\n`
                    return str
                }, "")
            }
        }
    },
    //写入模板文件
    writeTempFile() {
        this.readCacheFile(cacheFileTempPath)
        const version = this.getVersion()
        const { cssPath, jsPath, fontsPath, imagesPath, iconPath } = this.readFilePath()
        const replaceFile = this.replaceFileData()
            (currentTime())
            (version.toFixed(2))
            (cssPath)
            (jsPath)
            (fontsPath)
            (imagesPath)
            (iconPath)
        fs.writeFileSync(cacheFilePath, replaceFile)
        console.log(`cache文件更新成功 v.${version}`);
    }
}


helper.writeTempFile()



