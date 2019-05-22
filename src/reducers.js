import MusicPlayerAction from "Home/reducer" 
import RootAction from "app/components/Root/reducer" 
import UploadAudioAction from "shared/components/MusicPlayer/reducer"
import TalkAction from "app/routes/talk/reducer"
import ArticleAction from "app/routes/article/reducer"
import ArticleDetailAction from "app/routes/articleDetail/reducer"
import AdminAction from "app/routes/admin/reducer"
import OneYearAction from "app/routes/oneYear/reducer"

import { combineReducers } from "redux"     //reducer的合并

const chatReducer = combineReducers({
  MusicPlayerAction,
  UploadAudioAction,
  TalkAction,
  ArticleAction,
  ArticleDetailAction,
  AdminAction,
  OneYearAction,
  RootAction
})

export default chatReducer
