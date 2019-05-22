//一周年活动 接口

const express = require("express");
const router = express.Router();
const fs = require("fs");
const debug = require("debug")("oneYear");
const moment = require("moment");
const { tWord } = require("../db/connect");
const path = require("path");
const { host: HOST, PORT } = require("../../config");

const saveWordDir = path.resolve(__dirname, "../../public/one");

router.get("/getWordLists", async (req, res, next) => {
  try {
    const data = await tWord.find({}, { _id: 0, url: 1 });
    res.data = data;
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * 初始化一周年数据
 */
router.post("/init", async (req,res,next) => {
  const data = [
    { url: "http://cdn.lijinke.cn/1533519644263.png" },
    { url: "http://cdn.lijinke.cn/1533003990744.png" },
    { url: "http://cdn.lijinke.cn/1532517359530.png" },
    { url: "http://cdn.lijinke.cn/1532582753317.png" },
    { url: "http://cdn.lijinke.cn/1532588805037.png" },
    { url: "http://cdn.lijinke.cn/1532588805037.png" },
    { url: "http://cdn.lijinke.cn/1532593176391.png" },
    { url: "http://cdn.lijinke.cn/1532841097035.png" },
    { url: "http://cdn.lijinke.cn/1533003990744.png" },
    { url: "http://cdn.lijinke.cn/1533095000130.png" },
    { url: "http://cdn.lijinke.cn/1533226213248.png" },
    { url: "http://cdn.lijinke.cn/1533273015840.png" },
    { url: "http://cdn.lijinke.cn/1533462924105.png" },
    { url: "http://cdn.lijinke.cn/1533519644263.png" },
    { url: "http://cdn.lijinke.cn/1533557487649.png" }
  ];

  await tWord.create(data)
  res.data = true
  next()
});

//上传图片
router.post("/addWord", async (req, res, next) => {
  const { word } = req.body;
  try {
    if (!word) return next("文字不能为空!");
    existsSync(saveWordDir);

    const type = word.match(/^data:image\/(\w*)/)[1] || "png"; //拿到当前是什么图片 jpeg/png
    let base64Data = word.replace(/^data:image\/\w+;base64,/, "");
    let imageData = new Buffer(base64Data, "base64"); //使用 Buffer转换成二进制

    const filename = `${Date.now()}.${type}`;
    fs.writeFileSync(`${saveWordDir}/${filename}`, imageData);

    await tWord.create({
      url: `${HOST}/one/${filename}`
    });
    res.data = true;
    next();
  } catch (error) {
    debug("addWord-error!", error);
    next("上传失败!");
  }
});

function existsSync(_path) {
  const isExists = fs.existsSync(_path);
  if (!isExists) {
    fs.mkdirSync(_path);
  }
}

module.exports = router;
