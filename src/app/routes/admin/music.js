import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "shared/components/Button";
import Message from "shared/components/Message";
import RcMessage from "rc-message";
import { CodeRender, LinkRender } from "shared/libs/markdown-render";
import { getMusicLists } from "../../components/Root/action";
import { browserHistory } from "react-router";
import "react-jinke-music-player/assets/index.css";
import "./styles.less";

import { toggleMusic, uploadMusic } from "./action";

@connect(
  ({ RootAction }) => ({
    musicLists: RootAction.musicLists
  }),
  dispatch =>
    bindActionCreators(
      {
        getMusicLists,
        toggleMusic,
        uploadMusic
      },
      dispatch
    )
)
export default class MusicAdmin extends React.PureComponent {
  state = {
    articleList: [],
    contentModalVisible: false,
    content: "无", //当前文章内容
    loading: false,
    id: "", //当前文章id
    title: "", //当前文章标题
    pageIndex: 1,
    previewContent: "", //修改的预览语
    previewModalVisible: false
  };
  pageSize = 10;
  contentType = "portrait"; //是否是竖屏
  render() {
    const { musicLists } = this.props;

    return (
      <div className="admin-section">
        <h2 className="title">音乐管理</h2>
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
                className="music-img-file-original-btn"
              />
            </p>
            <p>
              <input
                type="file"
                name="audioFile"
                className="music-file-original-btn"
              />
            </p>
            <p>
              <Button
                key="uploadBtn"
                type="primary block"
                htmlType="button"
                onClick={this.upLoadAudio}
                className="music-upload-file-btn"
              >
                立即上传
              </Button>
            </p>
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <td>歌曲名</td>
              <td>歌手</td>
              <td>封面图</td>
              <td>音乐地址</td>
              <td>是否显示</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            {musicLists.length >= 1 ? (
              musicLists.map((item, i) => {
                const { _id, name, singer, cover, musicSrc, isShow } = item;
                return (
                  <tr key={i}>
                    <td>{name}</td>
                    <td>{singer}</td>
                    <td>
                      <img src={cover} width="80" />
                    </td>
                    <td>
                      <audio src={musicSrc} controls preload="none" />
                    </td>
                    <td>{isShow ? "是" : "否"}</td>
                    <td colSpan="2">
                      <Button
                        type={isShow ? "error" : "success"}
                        className="delete-link"
                        onClick={() => this.toggleMusic(_id, !isShow)}
                      >
                        {isShow ? "隐藏" : "显示"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10">暂无数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  upLoadAudio = () => {
    this.setState({ uploadLoading: true });
    const formEle = document.querySelector(".upload-music-form");
    const formData = new FormData(formEle);

    this.props.uploadMusic(formData, success => {
      if (success) {
        Message.success("上传成功!");
        this.props.getMusicLists();
      } else {
        Message.error("上传成功!");
      }
    });
  };
  toggleMusic = (id, isShow) => {
    this.props.toggleMusic({ id, isShow }, success => {
      if (success) {
        Message.success("修改成功!");
        this.props.getMusicLists();
      } else {
        Message.error("修改失败!");
      }
    });
  };
  saveTitle = e => {
    this.setState({ title: e.target.value });
  };
  savePreviewContent = e => {
    this.setState({ previewContent: e.target.value });
  };
  showPreviewArticle = () => {
    this.setState({ previewModalVisible: true });
  };
  closePreviewArtice = () => {
    this.setState({ previewModalVisible: false });
  };
  updateArticle = e => {
    this.setState({ content: e.target.value });
  };
  //编辑文章
  editContent = (id, title, content, previewContent) => {
    RcMessage.confirm({
      content: `确认修改 ${title} 吗?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.props.editContent(
          { id, title, content, previewContent },
          ({ success }) => {
            if (success) {
              Message.success("修改成功!");
              this.cancelContentModal();
              this.props.getArticleLists({
                pageIndex: this.state.pageIndex,
                pageSize: this.pageSize
              });
            } else {
              Message.error("修改失败!");
            }
          }
        );
      }
    });
  };
  //删除文章
  onDeleteArticle = (id, title) => {
    RcMessage.confirm({
      content: `确认删除 ${title} 吗?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.props.deleteArticle(id, ({ success }) => {
          if (success) {
            Message.success("删除成功!");
            this.props.getArticleLists({
              pageIndex: this.state.pageIndex,
              pageSize: this.pageSize
            });
          } else {
            Message.error("删除失败!");
          }
        });
      }
    });
  };
  //如果用户是小屏通知他横屏显示
  landScapeNotice = () => {
    //拿到css 里面的伪类  屌屌哒
    const content = getComputedStyle(this.section, ":after").getPropertyValue(
      "content"
    );
    if (content.replace(/(\'|\")/g, "") == this.contentType) {
      Message.info("请横屏查看!");
    }
  };

  componentDidMount() {
    this.section = ReactDOM.findDOMNode(this);
    window.addEventListener("resize", this.landScapeNotice);
    this.landScapeNotice();
    this.props.getMusicLists();
  }
}
