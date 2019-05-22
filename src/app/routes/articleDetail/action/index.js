import helper from "libs/helper"

export const ARTICLE_DETAIL = "article_detail"
export const TOGGLE_LIKE = "toggle_like"
export const TOGGLE_COMMENT_LIKE = "toggle_comment_like"
export const PUBLISH_COMMENT = "publish_comment"
export const GET_ARTICLE_COMMENTS = "get_article_comments"
export const RESET_ARTICLE_PAGE = "reset_article_page"

export default function getArticleDetail(id,cb) {
    return async function (dispatch) {
        const info = await helper.postJson("/article/articleDetail", { articleId: id })
        dispatch({
            type: ARTICLE_DETAIL,
            info
        })
        cb && cb(info.data)
    }
}


export function toggleLike(id, isLike,cb) {
    return async function (dispatch) {
        const data = await helper.postJson("/article/toggleLike", { id, isLike })
        dispatch({
            type: TOGGLE_LIKE
        })
        cb && cb(data.data)
    }
}


export function toggleLikeComment(id, isLike,cb) {
    return async function (dispatch) {
        const data = await helper.postJson("/article/toggle-commentLike", { id, isLike })
        dispatch({
            type: TOGGLE_COMMENT_LIKE
        })
        cb && cb(data.data)
    }
}

export function publishComment(values,cb) {
    return async function (dispatch) {
        const info = await helper.postJson("/article/publish-comment", values)
        cb && cb(info.data)
    }
}
export function getArticleComments(params,cb) {
    return async function (dispatch) {
        const lists = await helper.getJson("/article/comment-lists", params)
        dispatch({
            type: GET_ARTICLE_COMMENTS,
            lists
        })
        cb && cb(lists.data)
    }
}

export function resetArticlePage(articleOldPageIndex,cb){
    return function(dispatch){
        dispatch({
            type:RESET_ARTICLE_PAGE,
            articleOldPageIndex
        })
        cb && cb(params)
    }
}
