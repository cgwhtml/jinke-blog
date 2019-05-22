import {GET_MUSIC} from "../action"
const nameInitialState = {
    musicData:{}
}
export default function (state = nameInitialState, action) {
    const {type,musicData} = action;
    switch (type) {
        case GET_MUSIC:
            return {
                ...state,
                musicData:musicData.data
            }
        default:
            return state
    }
}