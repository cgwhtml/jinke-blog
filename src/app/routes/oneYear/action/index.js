import helper from "libs/helper"
export const GET_WORD_LISTS = "get_word_lists"

export default function(params){
    return async function(dispatch){
        const data = await helper.getJson('/oneYear/getWordLists',params)
        dispatch({
            type:GET_WORD_LISTS,
            data:data.data
        })
    }
}