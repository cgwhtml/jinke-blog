import {LOADED,GET_MUSIC_LISTS} from "../action"

const defaultState = {
    weather:true,
    musicLists:[],
    showHome:false,
}
export default function (state = defaultState, action) {
    const {type,isLoading} = action;
    switch (type) {
        case LOADED:
            return {
                ...state,
                isLoading
            }
        case GET_MUSIC_LISTS:
            return {
                ...state,
                musicLists:action.musicLists
            }
        default:
            return {
                ...state,
                weather:true
            }
    }
}