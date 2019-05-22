import helper from "libs/helper";
export const ADMIN_ARTICLE_LIST = "admin_article_list";
export const ADMIN_ARTICLE_DELETE = "admin_article_delete";
export const ADMIN_ARTICLE_EDIT = "admin_article_edit";

export default function getArticleLists(params) {
  return async function(dispatch) {
    const lists = await helper.getJson("/admin/articleList", params);
    dispatch({
      type: ADMIN_ARTICLE_LIST,
      lists
    });
  };
}
export function deleteArticle(id, callback) {
  return async function(dispatch) {
    const info = await helper.postJson("/admin/deleteArticle", { id });
    callback && callback(info.data);
  };
}

export function editContent(param, callback) {
  return async function(dispatch) {
    const info = await helper.postJson("/admin/editArticle", param);
    callback && callback(info.data);
  };
}

//文章审核
export function approve(param, callback) {
  return async function(dispatch) {
    const info = await helper.postJson("/admin/approve", param);
    callback && callback(info.data);
  };
}

export function toggleMusic(param, callback) {
  return async function(dispatch) {
    console.log(param);
    const info = await helper.getJson("/music/toggleMusic", param);
    callback && callback(info.data);
  };
}

export function uploadMusic(data, callback) {
    return async function(dispatch) {
      const info = await helper.postJson("/music/uploadMusic", data,true);
      callback && callback(info.data);
    };
  }
