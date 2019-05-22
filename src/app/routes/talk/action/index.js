import helper from "libs/helper"
export const USER_JOIN = "user_join"

export default function (userName) {
    //这里的formData就是组件调用action传的参数
    return function (dispatch) {
            dispatch({
                type: USER_JOIN,
                userName
            })
        }
}