const { tArticle, tComment, tSubscription } = require('../db/connect');
const { adminEmail } = require('../../config');
const {
  privateKey,
  publicKey,
  fcmAPIKey
} = require('../../config/webpush.config');
const webpush = require('web-push');
/**
 * 文章和 评论  分页查询
 * @param table 表名
 * @param param 条件
 * @param sort 按什么排序
 * @param pageIndex,pageSize 分页条件
 * @param attr true 为文章表 false 为评论表
 */
module.exports = {
  async findAndCount(
    table = tArticle,
    param = {},
    sort = {},
    { pageIndex, pageSize },
    attr = true
  ) {
    const lists = JSON.parse(
      JSON.stringify(
        await table
          .find(param, attr ? { __v: 0, email: 0 } : { __v: 0 })
          .sort(sort)
          .skip((pageIndex - 1) * pageSize)
          .limit(pageSize >> 0)
      )
    );
    if (attr === true) {
      for (let item of lists) {
        const comment =
          (await tComment.find({ articleId: item._id }).populate({
            path: 'article',
            select: 'articleId'
          })).length || 0;
        item.comments = comment;
      }
    }
    const allCount = ~~(await table.find(param).count());
    const count =
      allCount % pageSize == 0
        ? allCount / pageSize
        : ~~(allCount / pageSize) + 1;
    return {
      total: allCount,
      count,
      [attr ? 'articleLists' : 'commentLists']: lists
    };
  },
  async sendNotification(title = '一篇新文章', body = '点击查看') {
    webpush.setGCMAPIKey(fcmAPIKey);
    webpush.setVapidDetails(`mailto:${adminEmail}`, publicKey, privateKey);
    const payload = {
      title,
      body,
      icon: '/logos/logo_512.png',
      data: { url: 'https://www.lijinke.cn' }
    };

    //TODO:
    // const pushSubscriptions = await tSubscription.find({});

    // pushSubscriptions.forEach((pushSubscription)=>{
    //   webpush.sendNotification(pushSubscription, JSON.stringify(payload));
    // })

    const pushSubscription = {
      endpoint: 'https://fcm.googleapis.com/fcm/send/cXNtQAow8uc:APA91bHU1K7Qx1XxtqlDPrrmg9HLzu5XjTKFFG35gl3pfHmkZzu6bKn1WGOMOaPbXRv4jxK433gE8Tlrc1jL5TMgz3qnETObl06ko8g_GpFOAv0N3F9W106at0Bg8ZE9paD6S_9rRvxWXcatd3cnNgL1GLfQbVK0Kg',
      expirationTime: null,
      keys: {
        p256dh:'BCZKslTR8W9ahHx5LmVIxy6gPraatGt9sFwIQJpS6VmO9KjCbxqYE-iRRQ7otnpizwVDqMNavzmeWX6Ds-kfuzY',
        auth: 'FDBJTbfSRaZ4-3saHtCc_w'
      }
    };

    webpush.sendNotification(pushSubscription, JSON.stringify(payload));
  }
};
