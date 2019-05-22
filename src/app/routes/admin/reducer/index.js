import { ADMIN_ARTICLE_LIST,ADMIN_ARTICLE_DELETE,ADMIN_ARTICLE_EDIT } from "../action"
const nameInitialState = {
    lists:[]
}

export default function (state = nameInitialState, action) {
    const { type } = action;
    switch (type) {
        case ADMIN_ARTICLE_LIST:
            return {
                ...state,
                lists:action.lists.data
            }
        case ADMIN_ARTICLE_DELETE:
            return state
        case ADMIN_ARTICLE_EDIT:
            return state
        default:
            return state
    }
}