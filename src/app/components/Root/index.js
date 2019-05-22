/*
 * @Author: jinke.li
 * @Date: 2017-07-17 19:43:05
 * @Last Modified by: jinke.li
 * @Last Modified time: 2019-05-22 15:20:53
 */
import React from "react";
import Loading from "shared/components/Loading";
import Header from "shared/components/Header";
import Weather from "shared/components/Weather";
import MusicPlayer from "shared/components/MusicPlayer";
import Message from "shared/components/Message";
import BackTop from "shared/components/BackTop";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getMusicLists } from "./action";
import getMusic from "../../../Home/action";
import { toggleWeather } from "../../../shared/components/MusicPlayer/action";

import "./index.less";

@connect(
  ({ UploadAudioAction, RootAction }) => ({
    weather: UploadAudioAction.weather, //接受MusicPlayer组件传过来的 天气状态
    musicLists: RootAction.musicLists
  }),
  dispatch =>
    bindActionCreators(
      {
        getMusic,
        toggleWeather,
        getMusicLists
      },
      dispatch
    )
)
export default class Root extends React.PureComponent {
  welcomeTime = 6000;
  constructor(props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
    this.state = {
      fetch: false,
      clear: false,
      isLoading: true,
      wordPadVisible: false
    };
    this.COMPLETE = "complete"; //文档加载完成
  }
  render() {
    const { isLoading, wordPadVisible, clear, fetching } = this.state;
    const { weather,musicLists } = this.props;
    return (
      <div>
        <Loading isLoading={isLoading} />
        <Header title="李金珂的小屋" />
        {weather ? (
          <Weather
            type={"rain"} // snow 下雪 rain 下雨
            maxNum={12} //最大数量
            angle={10} //偏移角度
          />
        ) : (
          undefined
        )}
        <MusicPlayer audioLists={musicLists.filter(({isShow})=> isShow)}/>
        <BackTop />
        {/*消息弹窗放在这里*/}
        <div key="jk-message" className="jk-message" />
        {this.props.children}
      </div>
    );
  }
  _getMusic = () => {
    this.setState(
      {
        isLoading: false
      },
      () => {
        this.props.getMusic();
      }
    );
  };
  loading = () => {
    if (document.readyState === this.COMPLETE) {
      this.setState({ isLoading: false });
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === this.COMPLETE) {
          this.setState({ isLoading: false });
        }
      };
    }
  };
  componentDidMount() {
    const isFirst = localStorage.getItem("welcome") || true;
    if (isFirst == true) {
      localStorage.setItem("welcome", false);
      setTimeout(() => this.loading(), this.welcomeTime);
    } else {
      this.loading();
    }
    this.optimizeWeather();
    this.pwaInstallPrompt();
    this.props.getMusicLists()
  }
  optimizeWeather = () => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.props.toggleWeather(false);
      } else {
        this.props.toggleWeather(true);
      }
    });
  };
  pwaInstallPrompt = () => {
    window.addEventListener("beforeinstallprompt", event => {
      // 这个 `event.userChoice` 是一个 Promise ，在用户选择后 resolve
      event.userChoice.then(({ outcome }) => {
        // 'accepted': 添加到主屏
        // 'dismissed': 用户不想理你并向你扔了个取消
        if (outcome === "accepted") {
          Message.success("感谢体验PWA");
        } else if (outcome === "dismissed") {
          Message.success("有机会一定要试试啊");
        } else {
          console.log("用户已经添加到屏幕");
        }
      });
    });
  };
  componentDidCatch(error, info) {
    Message.error(error.toString());
  }
}
