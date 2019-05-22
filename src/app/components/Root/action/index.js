export const LOADED = "loaded"
export const GET_MUSIC_LISTS = "get_music_lists"
import helper from "libs/helper"

export default function loaded(isLoading) {
    return function (dispatch) {
        dispatch({
            type: LOADED,
            isLoading
        })
    }
}

export function getMusicLists(data,cb){
    return async function(dispatch){
        const {data} = await helper.getJson('/music/getMusicLists',data)
        dispatch({
            type: GET_MUSIC_LISTS,
            musicLists:data
        })
    }
}
