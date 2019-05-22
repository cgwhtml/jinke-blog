const mongoose = require('mongoose')
const debug = require('debug')('connect-db')
const { db_path } = require('../../config')
const { musicSchema, articleSchema,commentSchema,subscriptionSchema,wordSchema } = require("./schema")

mongoose.connect(db_path,{
  useMongoClient:true
})

const db = mongoose.connection

db.on('open', () => { debug('mongose 连接成功') })

db.on('error', (e) => { debug(`[errr] : 连接失败 ${e}`) })

const tMusic = mongoose.model('music', musicSchema)
const tArticle = mongoose.model('article', articleSchema)
const tComment = mongoose.model('comment', commentSchema)
const tWord = mongoose.model('word', wordSchema)
const tSubscription = mongoose.model('subscription', subscriptionSchema)

module.exports = {
    tMusic,
    tArticle,
    tComment,
    tWord,
    tSubscription
}