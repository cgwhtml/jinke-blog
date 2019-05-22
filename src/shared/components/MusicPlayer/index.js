/*
 * @Author: jinke.li 
 * @Date: 2017-05-12 13:54:56 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-08-11 15:33:16
 */
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import classNames from "classnames";
import Modal from "shared/components/Modal";
import Button from "shared/components/Button";
import Message from "shared/components/Message";
import { browserHistory } from "react-router";
import { host, port } from "../../../../config";
import uploadAudio, { toggleWeather } from "./action";
import RcMessage from "rc-message";

import ReactJkMusicPlayer from "react-jinke-music-player";

import "./styles.less";
import "rc-message/assets/index.css";
import "react-jinke-music-player/assets/index.css";

@connect(
  ({ UploadAudioAction, MusicPlayerAction }) => ({
    audioUploadFile: UploadAudioAction.audioUploadFile,
    musicData: MusicPlayerAction.musicData
  }),
  dispatch =>
    bindActionCreators(
      {
        uploadAudio,
        toggleWeather
      },
      dispatch
    )
)
export default class MusicPlayer extends React.PureComponent {
  state = {
    isDown: false, //鼠标是否按下  判断是否在拖动进度条
    uploadModalVisible: false, //音乐上传框
    audioDescModalVisible: false,
    isCanUpload: false, //是否能上传
    audioFileReady: false,
    audioImgReady: false,
    audioFile: {},
    audioImg: {},
    weather: true, //默认雨雪天气
    uploadProgress: 0, //上传进度
    uploadLoading: false,
    audioDescReady: false, //音乐描述
    uploadAudioName: "", //上传音乐名
    uploadAudioDesc: "", //描述
    showAudioDesc: false,
    currentAudioVolume: 0, //当前音量  静音后恢复到之前记录的音量
    dragAreaClass: false,
    progress: 0
  };
  activeDragAreaClass = "drag-active";
  UPLOAD_URL = `${host}${port}/api/music/uploadMusic`;
  IMG_MAX_SIZE = 1024;
  static propTypes = {
    audioLists: PropTypes.array.isRequired,
    desc: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.defaultMusicName = "今日音乐";
    this.defaultMusicCover = require("images/default.jpeg");
  }
  render() {
    const {
      className,
      audioUploadFile,
      isUploadAudio,
      audioLists,
      musicData: { name, image: cover, src: musicSrc, desc }
    } = this.props;

    const singer = name ? name.split("-")[0] : "";
    const _name = name ? name.split("-")[1] : "";

    const {
      src: uploadMusicSrc,
      imageSrc: uploadCover,
      name: uploadName
    } = audioUploadFile;

    const {
      audioImg,
      isCanUpload,
      uploadModalVisible,
      audioFile,
      audioFileReady,
      audioImgReady,
      weather,
      uploadProgress,
      uploadLoading,
      audioDescReady,
      audioDescModalVisible,
      uploadAudioDesc,
      uploadAudioName,
      showAudioDesc,
      dragAreaClass,
      left,
      top,
      progress
    } = this.state;

    /**
     * 目前网站 只放一首歌
     */
    //音乐播放器参数配置
    const musicPlayerProps = {
      defaultPlayMode: "orderLoop",
      audioLists,
      loadAudioErrorPlayNext:false,
      defaultPosition: {
        right: "2%",
        bottom: "2%"
      },
      playModeText: {
        order: "顺序播放",
        orderLoop: "列表循环",
        singleLoop: "单曲循环",
        shufflePlay: "随机播放"
      },
      notContentText: "生命不止,音乐不止",
      openText: "打开",
      closeText: "关闭",
      panelTitle: "播放列表",
      checkedText: "白",
      unCheckedText: "夜",
      preload:"none",
      onAudioDownload(audioInfo) {
        Message.success("下载成功");
      },
      onAudioLoadError(err) {
        Message.error("这首音乐貌似播放不了,试试其他的!");
        console.error("load audio failed", err);
      },
      extendsContent: [
        <span
          className="group upload-music"
          key="weather-btn"
          onClick={this.toggleWeather}
        >
          {weather ? (
            <i className="icon icon-xiayu active" title="雨雪天气" />
          ) : (
            <i className="icon icon-shouye active" title="晴朗天气" />
          )}
        </span>,
        <span
          className="group upload-music"
          key="upload-music"
          onClick={this.showUploadModal}
        >
          <i
            className="icon icon-iconfontbiaozhunmoban01"
            title="上传你喜欢的音乐"
          />
        </span>,
        <span className="group" key="admin">
          <i
            className="icon icon-gantanhao"
            title="神秘功能"
            onClick={this.goAdmin}
          />
        </span>
      ]
    };

    return (
      <figure
        className={classNames("music-player", className)}
        key="music-player"
      >
        <ReactJkMusicPlayer {...musicPlayerProps} />
        <Modal
          key="upload-music-modal"
          title="上传你喜欢的音乐"
          visible={uploadModalVisible}
          onCancel={this.closeUploadModal}
          className={classNames("upload-music-modal", {
            [this.activeDragAreaClass]: dragAreaClass
          })}
          footer={null}
        >
          {uploadLoading ? (
            <div className="upload-music-progress-mask">
              <p>
                上传中 <span className="progress">{progress}</span>%
              </p>
              <progress value={progress} max="100" />
            </div>
          ) : (
            undefined
          )}
          <form
            method="post"
            name="upload-music-form"
            encType="multipart/form-data"
            className="upload-music-form"
          >
            <div className="upload-music-content">
              <p>
                <input
                  type="file"
                  name="audioImg"
                  accept="image/*"
                  ref="audioImg"
                  className="hidden music-img-file-original-btn"
                  onChange={this.selectAudioImgChange}
                />
                {audioImgReady && audioImg && audioImg.src && audioImg.size ? (
                  <div key="audio-img-show" className="audio-img-show">
                    {
                      <div
                        key="audio-img-content"
                        className="audio-img-content"
                      >
                        <img
                          src={audioImg.src}
                          className="audio-img"
                          key="audio-img"
                        />
                        {/*<span key="audio-img-size" className="audio-img-size">{audioImg.size}</span>*/}
                      </div>
                    }
                  </div>
                ) : (
                  undefined
                )}
                <Button
                  key="audioImgBtn"
                  type={audioImgReady ? "primary block" : "block"}
                  htmlType="button"
                  onClick={this.selectAudioImg}
                >
                  {audioImgReady ? (
                    <span>
                      <i className="icon icon-true" />重新选择图片
                    </span>
                  ) : (
                    "选择图片(支持拖拽)"
                  )}
                </Button>
              </p>
              <p>
                <input
                  type="file"
                  name="audioFile"
                  ref="audioFile"
                  className="hidden music-file-original-btn"
                  onChange={this.selectAudioChange}
                />
                {audioFileReady &&
                audioFile &&
                audioFile.name &&
                audioFile.size ? (
                  <span>
                    名字:{audioFile.name} || 大小:{audioFile.size}
                  </span>
                ) : (
                  undefined
                )}
                <Button
                  key="audioFileBtn"
                  type={audioFileReady ? "block primary" : "block"}
                  htmlType="button"
                  style={{ marginTop: "10px" }}
                  onClick={this.selectAudio}
                  className="music-file-btn"
                >
                  {audioFileReady ? (
                    <span>
                      <i className="icon icon-true" />重新选择音乐
                    </span>
                  ) : (
                    "选择音乐"
                  )}
                </Button>
              </p>
              <p>
                <Button
                  key="audioDescBtn"
                  type={audioDescReady ? "block primary" : "block"}
                  htmlType="button"
                  style={{ marginTop: "10px" }}
                  onClick={this.openAudioDescModal}
                  className="music-file-btn"
                >
                  {audioDescReady ? (
                    <span>
                      <i className="icon icon-true" />重新填写信息
                    </span>
                  ) : (
                    "填写音乐信息"
                  )}
                </Button>
              </p>
              <p>
                {audioFileReady ? (
                  <Button
                    key="uploadBtn"
                    type="primary block"
                    htmlType="button"
                    onClick={this.upLoadAudio}
                    className="music-upload-file-btn"
                  >
                    立即上传
                  </Button>
                ) : (
                  <Button
                    key="uploadBtn"
                    type="error block"
                    htmlType="button"
                    onClick={this.cantUpLoadAudio}
                    className="music-upload-file-btn"
                  >
                    立即上传
                  </Button>
                )}
              </p>
            </div>
          </form>
        </Modal>
        <Modal
          key="audio-desc-modal"
          title="为你的音乐添加点信息(可不选)"
          visible={audioDescModalVisible}
          onCancel={this.closeAudioDescModal}
          className="audio-desc-modal"
          onOk={this.closeAudioDescModal}
        >
          <p>
            <span>歌曲名:</span>
            <input
              type="text"
              name="uploadAudioName"
              placeholder="默认以您上传的音乐名为准"
              onChange={e => this.setState({ uploadAudioName: e.target.value })}
            />
          </p>
          <p>
            <span>为什么分享这首歌?</span>
            <textarea
              placeholder="让我们听听您的故事~"
              name="uploadAudioDesc"
              maxLength="100"
              onChange={e => this.setState({ uploadAudioDesc: e.target.value })}
            />
          </p>
        </Modal>
        <Modal
          key="audio-desc-content-modal"
          title="音乐故事"
          visible={showAudioDesc}
          onCancel={this.hideAudioDesc}
          className="audio-desc-content-modal"
          onOk={this.hideAudioDesc}
        >
          <section style={{ width: "300px" }}>
            <p className="name">
              <span>
                {(audioUploadFile && audioUploadFile.name) ||
                  name ||
                  this.defaultMusicName}
              </span>
            </p>
            <p className="desc">
              {desc || "上传这首歌的人没有填写关于这首歌的东东~"}
            </p>
          </section>
        </Modal>
      </figure>
    );
  }
  onHandleProgress = value => {
    this.audio.currentTime = value;
  };
  onSound = () => {
    this.setAudioVolume(this.state.currentAudioVolume);
  };
  showAudioDesc = () => {
    this.setState({
      showAudioDesc: !this.state.showAudioDesc
    });
  };
  hideAudioDesc = () => {
    this.showAudioDesc();
  };
  saveAudioDesc = () => {};
  closeAudioDescModal = () => {
    this.openAudioDescModal();
    this.setState({
      audioDescReady: true
    });
    if (!this.state.uploadAudioDesc || !this.state.uploadAudioDesc) {
      Message.success("保存成功!");
    }
  };
  openAudioDescModal = () => {
    this.setState({
      audioDescModalVisible: !this.state.audioDescModalVisible
    });
  };
  cantUpLoadAudio = () => {
    Message.warning("请上传音乐!");
  };
  goAdmin = () => {
    RcMessage.prompt({
      content: "请输入密码 :)",
      inputType: "password",
      placeholder: "输入密码进入",
      okText: "是",
      cancelText: "否",
      onOk(pwd) {
        console.info("密码你不都看到了吗...");
        if (pwd != "1996925") return Message.error("密码错误!");
        browserHistory.push("/admin");
      }
    });
  };
  toggleWeather = () => {
    const { weather } = this.state;
    Message.success(weather ? "晴朗天气" : "雨雪天气");
    this.setState({ weather: !weather });
    this.props.toggleWeather(!weather);
  };
  selectAudio = () => {
    const fileBtn = this.dom.querySelector(".music-file-original-btn");
    fileBtn.click();
  };
  selectAudioChange = () => {
    const files = Array.from(this.refs.audioFile.files);
    files.forEach(file => {
      let { type, name, size } = file;
      if (!/.*\/mp3$/.test(type)) {
        return Message.error("请上传mp3文件");
      }
      this.setState({
        audioFileReady: true,
        audioFile: {
          name,
          size:
            ~~(size / 1024) > 1024
              ? `${~~(size / 1024 / 1024)}MB`
              : `${~~(size / 1024)}KB`
        }
      });
    });
  };

  selectAudioImg = () => {
    const fileBtn = this.dom.querySelector(".music-img-file-original-btn");
    fileBtn.click();
  };
  renderImage = files => {
    files.forEach(file => {
      let { type, name, size } = file;
      if (!/.*\/(jpg|jpeg|png)$/.test(type)) {
        return Message.error("无效的图片格式");
      }
      if (~~(size / 1024) >= this.IMG_MAX_SIZE) {
        let max =
          this.IMG_MAX_SIZE > 1024
            ? `${this.IMG_MAX_SIZE}MB`
            : `${this.IMG_MAX_SIZE}KB`;
        return Message.warning(`图片最大 ${max}`);
      }
      const reader = new FileReader();
      reader.onprogress = () => {
        console.debug(`${name}读取中,请稍后`);
      };
      reader.onabort = () => {
        this.setState({
          audioImgReady: false,
          audioImg: {}
        });
        Message.error(`${name}读取中断`);
        console.debug(`${name}读取中断`);
      };
      reader.onerror = () => {
        this.setState({
          audioImgReady: false,
          audioImg: {}
        });
        Message.error(`${name}读取失败`);
        console.debug(`${name}读取失败!`);
      };
      reader.onload = e => {
        console.debug(`${name}读取成功,文件大小：${size / 1024}KB`);
        const result = e.target.result; //读取失败时  null   否则就是读取的结果
        this.setState({
          audioImgReady: true,
          audioImg: {
            src: result,
            size: `${~~size / 1024}KB`
          }
        });
      };
      reader.readAsDataURL(file); //base64
    });
  };
  selectAudioImgChange = () => {
    const files = Array.from(this.refs.audioImg.files);
    this.renderImage(files);
  };
  //上传音乐
  upLoadAudio = () => {
    this.setState({ uploadLoading: true });
    const formEle = this.dom.querySelector(".upload-music-form");
    const formData = new FormData(formEle);
    const { uploadAudioDesc, uploadAudioName } = this.state;
    formData.append("uploadAudioDesc", uploadAudioDesc);
    formData.append("uploadAudioName", uploadAudioName);
    // this.props.uploadAudio(formData)
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = () => {
      console.log("load start");
    };
    xhr.onerror = e => {
      Message.error("上传失败!");
      this.closeUploadModal();
      this.setState({ uploadLoading: false });
    };
    xhr.onload = () => {
      const { imgSrc, name, src } = JSON.parse(xhr.responseText).data;
      Message.success("上传成功!");
      location.reload();
    };
    xhr.onabort = event => {
      Message.warning("连接中断!");
      this.setState({ uploadLoading: false });
    };
    xhr.ontimeout = () => {
      Message.warning("连接超时!");
      this.setState({ uploadLoading: false });
    };
    xhr.onloadend = e => {
      this.closeUploadModal();
      this.setState({ uploadLoading: false });
    };
    xhr.upload.onprogress = e => {
      const { loaded, total } = e;
      const progress = Math.round(loaded * 100 / total);
      this.setState({ uploadProgress: progress });
    };

    xhr.open("POST", this.UPLOAD_URL, true);
    xhr.send(formData);
  };
  showUploadModal = () => {
    this.setState({ uploadModalVisible: true });
  };
  closeUploadModal = () => {
    this.setState({ uploadModalVisible: false });
  };
  stopAll = target => {
    target.stopPropagation();
    target.preventDefault();
  };
  getBoundingClientRect = () => {
    const ele = this.dom.querySelector(".progress");
    const { left } = ele.getBoundingClientRect();
    return {
      left
    };
  };
  progressClick = e => {
    this.stopAll(e);
    const { left } = this.getBoundingClientRect();
    this.audio.currentTime = ~~(e.pageX - left);
  };
  //添加焦点样式
  addDragAreaStyle = dragAreaClass => {
    this.setState({ dragAreaClass: true });
  };
  //添加焦点样式
  removeDragAreaStyle = () => {
    this.setState({ dragAreaClass: false });
  };
  //绑定拖拽事件
  addDragListener = (dragArea, dragAreaClass = true) => {
    document.addEventListener(
      "dragenter",
      e => {
        this.addDragAreaStyle();
      },
      false
    );
    document.addEventListener(
      "dragleave",
      e => {
        this.removeDragAreaStyle();
      },
      false
    );
    //进入
    dragArea.addEventListener(
      "dragenter",
      e => {
        this.stopAll(e);
        this.addDragAreaStyle();
      },
      false
    );
    //离开
    dragArea.addEventListener(
      "dragleave",
      e => {
        this.stopAll(e);
        this.removeDragAreaStyle();
      },
      false
    );
    //移动
    dragArea.addEventListener(
      "dragover",
      e => {
        this.stopAll(e);
        this.addDragAreaStyle();
      },
      false
    );
    dragArea.addEventListener(
      "drop",
      e => {
        this.stopAll(e);
        this.removeDragAreaStyle();
        const files = (e.dataTransfer || e.originalEvent.dataTransfer).files;
        this.renderImage(Array.from(files));
      },
      false
    );
  };
  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);
    this.addDragListener(this.dom.querySelector(".upload-music-modal"));
  }
}
