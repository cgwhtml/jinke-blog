const express = require('express')
const router = express.Router()
const fs = require("fs")
const debug = require('debug')('admin')
const moment = require('moment')
const { tArticle } = require("../db/connect")
const { host, port, staticPath, tableFields, companyName, adminEmail } = require("../../config")
const sendEmail = require("../utils/sendEmail")
const articleHelper = require('../utils/articleHelper')

//获取文章列表
router.get('/articleList', async (req, res, next) => {
    const {
        pageIndex = 1,
        pageSize = 5
    } = req.query
    try {

        const lists = await articleHelper.findAndCount(tArticle,{},{ publishDate: -1 },{pageIndex,pageSize})
        debug(`[获取文章列表成功],页码[${pageIndex}] 每页个数[${pageSize}]`)
        res.data = lists
        debug('文章列表获取成功')
        next()
    } catch (error) {
        debug('获取文章列表失败!',error)
        next('获取文章列表失败!')
    }

})

/**
 * 审核文章
 * @param {id}  String 文章id
 * @param {title}  String 文章标题
 * @param {email}  String 作者邮箱
 * @param {publishDate}  String 发表日期
 */
router.post('/approve', async (req, res, next) => {

    const { id, title, publishDate, email = adminEmail } = req.body
    try {
        if(!id) return next('文章id不能为空！')
        debug(`[文章审核]: id :${id}, 标题:${title} 邮箱:${email} 日期: ${publishDate}`)
        const date = moment(publishDate).format("YYYY-MM-DD HH:mm:ss")
        await tArticle.update({ _id: id }, { $set: { approve: true } })
        debug('文章审核成功!')
        sendEmail.sendEmail({
            to: email,
            subject: `【${companyName}】文章审核通过通知!`,
            html: `<h3 style="font-weight:500;">您于 ${date} 发表的文章【${title}】已审核通过,请前往<a href="${host}">${companyName}</a>查看~</h3>`
        })
        res.data = {
            success: true
        }
        next()
        debug('[文章审核通过,邮箱发送成功] 收件人:', email)
    } catch (error) {
        next('文章审核失败!')
    }

})

/**
 * 删除文章
 * @param {String} id 文章id
 */

router.post('/deleteArticle',async (req,res,next)=>{
    const {
        id
    } = req.body

    debug('文章id => ',id)

    try {
        if(!id) return next('文章id不能为空!')
        await tArticle.remove({_id:id},1)
        debug('删除文章成功！')
        res.data = {
            success: true
        }
        next()
    } catch (error) {
        debug('文章删除失败!',error)
        next('文章删除失败!',error)
    }

})

/**
 * 编辑文章
 * @param {String} id 文章id
 * @param {String} content 文章内容
 */

router.post('/editArticle',async (req,res,next)=>{
    const {
        id,
        content,
        title,
        previewContent
    } = req.body

    debug('文章id => ',id)

    try {
        if(!id) return next('文章id不能为空!')
        await tArticle.update({_id:id},{content,title,previewContent})
        debug('更新文章成功！')
        res.data = {
            success: true
        }
        next()
    } catch (error) {
        debug('更新文章成功！!',error)
        next('更新文章成功！!',error)
    }

})

module.exports = router
