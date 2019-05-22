import {GET_WORD_LISTS} from "../action"
const nameInitialState = {
    lists:[]
}
export default function (state = nameInitialState, action) {
    const {type} = action;
    switch (type) {
        case GET_WORD_LISTS:
            return {
                ...state,
                lists:action.data
            }
        default:
            return state
    }
}