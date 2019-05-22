const express = require('express');
const router = express.Router();
const config = require('../../config');
const fs = require('fs');
const debug = require('debug')('article');
const { tArticle, tComment, tSubscription } = require('../db/connect');
const momnet = require('moment');
const sendEmail = require('../utils/sendEmail');
const articleHelper = require('../utils/articleHelper');
const path = require('path');

/**
 * 文章列表
 * @param {String} title    文章标题 (模糊查询)
 * @param {String} author    文章作者 (模糊查询)
 * @param {String} date        文章发表日期
 * @param {String} category    文章分类
 * @param {Number} pageIndex 页码      default 1
 * @param {Number} pageSize 每页个数   default 5
 */

router.get('/lists', async (req, res, next) => {
  const {
    title,
    author,
    date,
    category,
    pageIndex = 1,
    pageSize = 5
  } = req.query;

  const queryOptions = Object.assign(
    {},
    title ? { title: new RegExp(title) } : undefined,
    author ? { author: new RegExp(author) } : undefined,
    category ? { category } : undefined,
    date ? { publishDate: { $gte: new Date(date) } } : undefined,
    { approve: true }
  );

  try {
    const lists = await articleHelper.findAndCount(
      tArticle,
      queryOptions,
      { publishDate: -1 },
      { pageIndex, pageSize }
    );
    debug(`[获取文章列表成功],页码[${pageIndex}] 每页个数[${pageSize}]`);
    res.data = lists;
    next();
  } catch (error) {
    debug('获取文章列表失败', error);
    next('获取文章列表失败!');
  }
});

/**
 * 获取文章排行榜
 * @param {type} String  文章分类
 */
router.get('/ranking', async (req, res, next) => {
  const { type = 'like' } = req.query;
  try {
    const rankingData = await tArticle
      .find({ approve: true }, { _id: 1, title: 1, like: 1, pageView: 1 })
      .sort({ [type]: -1 })
      .limit(5);
    debug('获取文章排行成功');
    res.data = rankingData;
    next();
  } catch (error) {
    debug('获取文章排行榜失败!', error);
    next('获取文章排行失败!');
  }
});

/**
 * 新增文章
 * @param {editTitle} String 标题
 * @param {editAuthor} String 作者
 * @param {editContent} String 内容
 * @param {publishDate} String 发表日期
 * @param {editEmail} String  作者邮箱
 * @param {pageView} String   pv
 * @param {like} String       点赞数
 * @param {approve} Boolean    是否通过审核
 * @param {editCategory} Array  分类
 */

router.post('/add-article', async (req, res, next) => {
  const {
    editTitle,
    editAuthor = '佚名',
    editContent,
    previewContent,
    publishDate,
    editEmail = config.adminEmail,
    pageView = '0',
    like = '0',
    approve,
    editCategory
  } = req.body;
  debug('[client body]: ', req.body);
  try {
    if (!editTitle || !editContent || !previewContent) {
      return next('文章参数不能为空!');
    }
    const articlePath = path.resolve(
      __dirname,
      `../../document/article/${editTitle}.md`
    );
    //保存成md 文件
    fs.writeFileSync(articlePath, editContent, 'utf8');
    // tArticle.insertMany
    const data = await tArticle.create({
      title: editTitle,
      content: editContent,
      previewContent,
      author: editAuthor || '佚名',
      publishDate: publishDate,
      pageView: pageView,
      like: like,
      approve: approve,
      email: editEmail,
      category: editCategory
    });
    debug('新增文章成功');
    res.data = { success: true };

    articleHelper.sendNotification(editTitle)
    sendEmail.sendEmail({
      subject: `【${editAuthor ||
        '佚名'}】于 [${publishDate}] 发布了文章 [${editTitle}] 请尽快审核!`,
      html: `<h2>文章内容</h2><p>${editContent}</p>`
    });
    debug('通知管理员审核邮件发送成功!');
    next();
  } catch (error) {
    next(`添加文章失败!:${error}`);
  }
});

/**
 * 获取文章详情
 * @param {articleId}  String    文章id
 */
router.post('/articleDetail', async (req, res, next) => {
  try {
    const { articleId } = req.body;
    if (!articleId) return next('文章id不能为空');
    debug('【articleId】', articleId);
    const articleDetail = (await tArticle.find({ _id: articleId }))[0] || [];
    res.data = articleDetail;
    debug('获取文章详情成功');
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 文章浏览量
 * @param {articleId} String 文章id
 */
router.post('/addPageView', async (req, res, next) => {
  const { articleId } = req.body;
  if (!articleId) return next('文章id 不能为空！');
  let pageView = (await tArticle.find({ _id: articleId }, { pageView: 1 }))[0]
    .pageView;
  debug('【articleId】', articleId, '【pageView】:', pageView);
  const articleDetail = await tArticle.update(
    { _id: articleId },
    { $set: { pageView: ++pageView } }
  );
  res.data = {
    success: true
  };
  debug('[浏览量 pv +1]');
  next();
});

/**
 * 文章点赞
 * @param {isLike} Boolean  点赞 true or 取消赞 false
 * @param {id}  String  文章id
 */
router.post('/toggleLike', async (req, res, next) => {
  const { isLike, id } = req.body;
  debug('[喜欢]:', isLike);
  try {
    if (!id) return next('文章id 不能为空！');
    let likeNum = (await tArticle.find({ _id: id }, { like: 1 }))[0].like;

    if (isLike === true) {
      likeNum++;
    } else if (isLike === false) {
      likeNum--;
    }
    debug('喜欢量', likeNum);
    const data = await tArticle.update(
      { _id: id },
      { $set: { like: likeNum } }
    );
    debug('[喜欢点赞成功]');
    res.data = {
      success: true
    };
    next();
  } catch (error) {
    next('点赞失败!');
  }
});

/**
 * 评论点赞
 * @param {isLike} Boolean  点赞 true or 取消赞 false
 * @param {id}  String  评论id
 */
router.post('/toggle-commentLike', async (req, res, next) => {
  const { isLike, id } = req.body;
  debug('[点赞]:', isLike);
  try {
    if (!id) return next('文章id 不能为空！');
    let likeNum = (await tComment.find({ _id: id }, { like: 1 }))[0].like;

    if (isLike === true) {
      likeNum++;
    } else if (isLike === false) {
      likeNum--;
    }
    debug('评论点赞量', likeNum);
    const data = await tComment.update(
      { _id: id },
      { $set: { like: likeNum } }
    );
    debug('[评论点赞成功]');
    res.data = {
      success: true
    };
    next();
  } catch (error) {
    next('点赞失败!');
  }
});

/**
 * 获取评论列表
 * @param {articleId} String 文章id
 */
router.get('/comment-lists', async (req, res, next) => {
  const { articleId, pageIndex = 1, pageSize = 5 } = req.query;
  debug('[文章id]:', articleId);
  try {
    if (!articleId) return next('articleId 不存在！');
    const lists = await articleHelper.findAndCount(
      tComment,
      { articleId },
      { publishDate: -1 },
      { pageIndex, pageSize },
      false
    );
    debug(`[获取文章列表成功],页码[${pageIndex}] 每页个数[${pageSize}]`);
    debug('评论列表查询成功!');
    res.data = lists;
    next();
  } catch (error) {
    next('获取评论列表失败!');
  }
});

/**
 * 发表评论
 * @param {articleId} String   文章id
 * @param {commentName} String 姓名
 * @param {commentEmail} String 邮箱
 * @param {commentContent} String 评论内容
 */
router.post('/publish-comment', async (req, res, next) => {
  const {
    articleId,
    commentName,
    commentEmail,
    commentContent,
    publishDate,
    device
  } = req.body;

  debug('[文章评论]', req.body);
  try {
    if (!articleId) return next('aritcleId 不能为空!');
    const data = await tComment.create({
      articleId,
      commentName,
      commentEmail,
      commentContent,
      publishDate,
      device,
      like: '0'
    });
    debug('[文章评论成功]');
    const { title } =
      (await tArticle.findOne({ _id: articleId }, { title: 1 })) || {};
    sendEmail.sendEmail({
      subject: `${commentName}(${commentEmail}),通过${device}评论了您的(${title})文章`,
      html: `<h2>评论内容</h2><p>${commentContent}</p>`
    });
    res.data = {
      success: true
    };
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 评论点赞
 * @param {isLike} Boolean  点赞 true or 取消赞 false
 * @param {id}  String  评论id
 */
router.post('/toggle-commentLike', async (req, res, next) => {
  const { isLike, id } = req.body;
  debug('[喜欢]:', isLike);
  try {
    if (!id) return next('aritcleId 不能为空!');
    let likeNum = (await tArticle.find({ _id: id }, { like: 1 }))[0].like;

    if (isLike === true) {
      likeNum++;
    } else if (isLike === false) {
      likeNum--;
    }
    debug('喜欢量', likeNum);
    const data = await tArticle.update(
      { _id: id },
      { $set: { like: likeNum } }
    );
    debug('[喜欢点赞成功]');
    res.data = {
      success: 1
    };
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * 文章订阅
 */
router.post('/add-subscription', async (req, res, next) => {
  const { subscription } = req.body;
  if (!subscription) return next('miss subscription');

  try {
    await tSubscription.create(subscription);
    res.data = true;
    next();
  } catch (error) {
    next(`订阅失败:${error}`);
  }
});

module.exports = router;
