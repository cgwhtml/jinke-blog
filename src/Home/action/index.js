import helper from "libs/helper"
export const GET_MUSIC = "get_music"

export default function(){
    return async function(dispatch){
        const file = await helper.getJson('/music/getMusic')
        dispatch({
            type:GET_MUSIC,
            musicData:file
        })
    }
}