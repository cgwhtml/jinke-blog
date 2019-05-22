import { USER_JOIN } from "../action"
const nameInitialState = {}
export default function (state = nameInitialState, action) {
    const { type, userName } = action;
    switch (type) {
        case USER_JOIN:
            return {
                userName
            }
        default:
            return state
    }
}