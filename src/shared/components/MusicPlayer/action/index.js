import helper from "libs/helper"
export const UPLOAD_MUSIC = "upload_music"
export const TOGGLE_WEATHER = "toggle_weather"

export default function (formData) {
    //这里的formData就是组件调用action传的参数
    return async function (dispatch) {
        const audioFile = await helper.postJson('/music/uploadMusic/', formData, true)
        if (audioFile && audioFile.success) {
            dispatch({
                type: UPLOAD_MUSIC,
                audioFile: audioFile.data
            })
        }
    }
}
export  function toggleWeather (weather) {
    //这里的formData就是组件调用action传的参数
    return function (dispatch) {
        dispatch({
            type: TOGGLE_WEATHER,
            weather
        })
    }
}
toggleWeather