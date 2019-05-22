import { UPLOAD_MUSIC,TOGGLE_WEATHER } from "../action"
const nameInitialState = {
    audioUploadFile:{
        src:""
    },
    weather:true,
}
export default function (state = nameInitialState, action) {
    const { type } = action;
    switch (type) {
        case UPLOAD_MUSIC:
            return {
                ...state,
                audioUploadFile: action.audioFile
            }
        case TOGGLE_WEATHER:
            return {
                ...state,
                weather: action.weather
            } 
        default:
            return {
                ...state,
                weather: true
            }
    }
}