const express = require("express");
const router = express.Router();
const config = require("../../config");
const fs = require("fs");
const Path = require("path");
const debug = require("debug")("music");
const { tMusic } = require("../db/connect");
const multiparty = require("multiparty");
const { host: HOST, port: PORT, staticPath } = config;
const uuid = require("uuid/v1");
const {
  uploadUrl,
  AccessKey,
  SecretKey,
  bucketName,
  cdnHost
} = require("../../config/upload.config");
const superagent = require("superagent");
const qiniuToken = require("qiniu-uptoken");

/**
 * 获取音乐
 */
router.get("/getMusicLists", async (req, res, next) => {
  try {
    const data = await tMusic.find({}, { __v: 0 });
    res.data = data;
    next();
    debug("获取音乐成功!");
  } catch (error) {
    next("获取音乐失败!");
  }
});

router.get("/toggleMusic", async (req, res, next) => {
  const { id, isShow } = req.query;
  try {
    await tMusic.update(
      {
        _id: id
      },
      {
        $set: {
          isShow: isShow
        }
      }
    );
    res.data = true;
    next();
    debug("修改音乐成功!");
  } catch (error) {
    next("修改音乐成功!");
  }
});

router.post("/init", async (req, res, next) => {
  try {
    await tMusic.create([
      {
        name: "难得",
        singer: "安来宁",
        cover: "http://cdn.lijinke.cn/nande.jpg",
        musicSrc: "http://cdn.lijinke.cn/nande.mp3"
      },
      {
        name: "我的名字叫做安",
        singer: "安来宁",
        cover: "http://cdn.lijinke.cn/nande.jpg",
        musicSrc: "http://cdn.lijinke.cn/an.mp3"
      },
      {
        name: "大风吹",
        singer: "草东没有派对",
        cover: "http://cdn.lijinke.cn/1387583682387727.jpg",
        musicSrc: "http://cdn.lijinke.cn/201711082.mp3"
      },
      {
        name: "米店",
        singer: "张玮玮和郭龙",
        cover: "http://cdn.lijinke.cn/midian.jpg",
        musicSrc: "http://cdn.lijinke.cn/midian.mp3"
      },
      {
        name: "达尔文",
        singer: "蔡健雅",
        cover: "http://cdn.lijinke.cn/5V49G-3GFLn-f6mRjHsGaUAh.jpg",
        musicSrc: "http://cdn.lijinke.cn/20171108.mp3"
      },
      {
        name: "连衣裙",
        singer: "宋冬野",
        cover: "http://cdn.lijinke.cn/niannian.jpg",
        musicSrc: "http://cdn.lijinke.cn/niannian.mp3"
      },
      {
        name: "十年青春换绝症",
        singer: "贰佰",
        cover: "http://cdn.lijinke.cn/18892908300128861.jpg",
        musicSrc: "http://cdn.lijinke.cn/201711081.mp3"
      }
    ]);
    res.data = true;
    next();
  } catch (error) {
    next("初始化音乐成功!");
  }
});

//获取音乐信息  只有一首歌 没存数据库 直接io操作
function getMusicInfo(fs) {
  const musicFile = fs.readdirSync(`${staticPath}/music`);
  debug("音乐文件读取成功");
  const src = musicFile.find(item => /\.mp3/.test(item)); //音乐文件路径
  const imageSrc = musicFile.find(item => /.*\.(jpg|jpeg|gif|png)/.test(item)); //图片路径
  const name = (src && src.replace(/(.*)\.mp3/, "$1")) || ""; //音乐名字
  debug(`[musicSrc]:${src}`);
  debug(`[musicImgSrc]:${imageSrc}`);
  debug(`[name]:${name}`);
  return {
    src,
    imageSrc,
    name
  };
}
//上传音乐
const fieldsConfig = {
  name: "audioName",
  img: "audioImg",
  file: "audioFile"
};

/**
 * 上传音乐
 */
router.post("/uploadMusic", async (req, res, next) => {
  const form = new multiparty.Form();
  const TOKEN = qiniuToken(AccessKey, SecretKey, bucketName);
  form.parse(req, async (err, fields, files) => {
    if (err) return next(err);
    try {
      // Object.values(files).map(v=>v[0]['path']).forEach(( filePath ) => {
      //   const data = fs.readFileSync(filePath);
      // });
      const { originalFilename, path } = files['audioFile'][0];
      const fileData = fs.readFileSync(path); //异步读取文件 2进制格式  toString转换
      const key = uuid();
      superagent
        .post(uploadUrl)
        .field("key", key)
        .field("name", key)
        .field("token", TOKEN)
        .attach("file", fileData, key)
        .set("Accept", "application/json")
        .end(async (err, data) => {
          if (err) {
            errorLogger.info("/upload_map-qiniu-faild:", err);
            return next(`文件上传失败:${err}`);
          }
          const musicSrc = `${cdnHost}${key}`
          const imageKey = uuid();
          const audioImg = fs.readFileSync(files['audioImg'][0].path); //异步读取文件 2进制格式  toString转换
          superagent
          .post(uploadUrl)
          .field("key", imageKey)
          .field("name", imageKey)
          .field("token", TOKEN)
          .attach("file", audioImg, imageKey)
          .set("Accept", "application/json")
          .end(async (err, data) => {
            if (err) {
              errorLogger.info("/upload_map-qiniu-faild:", err);
              return next(`文件上传失败:${err}`);
            }
            const cover =  `${cdnHost}${imageKey}`
            res.data = true
            next()
          });
        });
    } catch (error) {
      debug("上传音乐失败!", error);
      next(`上传音乐失败:${error}!`);
    }
  });
});

//保存上传的音乐文件
function saveUploadAudio(audioName, audioDesc, files, fileType) {
  let fileData = {};
  if (files && files.length >= 1) {
    files.forEach((data, index) => {
      const { originalFilename, path, size } = data;
      let file = fs.readFileSync(path);
      switch (fileType) {
        case fieldsConfig["file"]:
          if (size == 0) {
            fileData.name = "";
            fileData.src = "";
            return;
          }
          let musicPath = `${staticPath}/music/${originalFilename}`;
          fs.writeFileSync(musicPath, file, "binary");
          debug(`保存${originalFilename}成功`);
          fileData.name =
            audioName ||
            (originalFilename && originalFilename.replace(/(.*)\.mp3/, "$1")) ||
            "";
          fileData.src = `${HOST}${PORT}/music/${originalFilename}`;

          break;
        case fieldsConfig["img"]:
          if (size == 0) {
            fileData.imageSrc = "";
            return;
          }
          let name = `${Date.now()}.${originalFilename.replace(
            /.*\.(jpg|jpeg|png)$/,
            "$1"
          )}`;
          let coverPath = `${staticPath}/music/${name}`;
          fs.writeFileSync(coverPath, file, "binary");
          debug(`保存${originalFilename}成功`);
          fileData.cover = `${HOST}${PORT}/music/${name}`;
          break;
        default:
          debug("[error]:上传的音乐类型未知!");
          throw new Error("[error]:上传的音乐类型未知!");
      }
    });
  }
  return fileData;
}

module.exports = router;
