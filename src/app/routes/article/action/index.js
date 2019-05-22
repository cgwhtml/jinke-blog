import helper from "libs/helper"
export const ARTICLE_LIST = "article_list"
export const ARTICLE_RANKING = "article_ranking"
export const ARTICLE_UPLOAD = "article_upload"
export const PAGE_VIEW = "pageView"

export default function getArticleLists (params,callback) {
    return async function (dispatch) {
        const lists = await helper.getJson("/article/lists",params)
        dispatch({
            type: ARTICLE_LIST,
            lists
        })
        callback && callback()
    }
}

//默认 喜欢 降序排列
export function getArticleRanking (type = "like",callback){
    return async function(dispatch){
        const ranking = await helper.getJson("/article/ranking",{type})
        dispatch({
            type: ARTICLE_RANKING,
            ranking
        })
        callback && callback()
    }
}

//上传文章
export function uploadArticle (articleInfo,cb) {
    return async function(dispatch){
        const info = await helper.postJson('/article/add-article',articleInfo)
        cb && cb(info.data)
    }
}

//pv统计
export function addPageView(id, countTime) {
    return async function (dispatch) {
        const info = await helper.postJson("/article/addPageView", { articleId: id, countTime })
        dispatch({
            type: PAGE_VIEW,
            info
        })
    }
}