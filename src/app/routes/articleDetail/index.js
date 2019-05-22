/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:42:48 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-07-25 15:32:24
 */
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Container from "shared/components/Container";
import Message from "shared/components/Message";
import Button from "shared/components/Button";
import Modal from "shared/components/Modal";
import ReactMarkdown from "react-markdown";
import Pagination from "shared/components/Pagination";
import helper from "shared/libs/helper";
import browser from "shared/libs/browser";
import classNames from "classnames";
import moment from "moment";
import TimeAgo from "timeago-react";
import Spinner from "react-spinkit";
import Share from "shared/components/Share";
import {
  CodeRender,
  LinkRender,
  ImageRender
} from "shared/libs/markdown-render";
import getArticleDetail, {
  toggleLike,
  publishComment,
  getArticleComments,
  toggleLikeComment,
  resetArticlePage
} from "./action";

import "./styles.less";

@connect(
  ({ ArticleDetailAction }) => ({
    articleInfo: ArticleDetailAction.articleInfo,
    pageViewInfo: ArticleDetailAction.pageViewInfo,
    commentInfo: ArticleDetailAction.commentInfo,
    commentData: ArticleDetailAction.commentLists
  }),
  dispatch =>
    bindActionCreators(
      {
        getArticleDetail,
        getArticleComments,
        toggleLike,
        publishComment,
        toggleLikeComment,
        resetArticlePage
      },
      dispatch
    )
)
export default class ArticleDetail extends React.PureComponent {
  state = {
    isLike: false, //true 为点赞 false 为取消赞
    likeNum: 0, //文章喜欢数
    showTip: false, //点赞提示
    commentModalVisible: false,
    articleLoading: true,
    commentLoading: true,
    commentLikeConfig: [], //评论喜欢数,是否点赞
    pageIndex: 1,
    publishLoading: false, //是否正在发表
    commentsKey: Date.now(),
    commentTotal: 0
  };
  pageSize = 5;
  render() {
    const { articleInfo, commentData } = this.props;
    const commentLists = commentData && commentData.commentLists;
    const count = commentData && commentData.count;
    const {
      isLike,
      likeNum,
      showTip,
      commentNum,
      commentModalVisible,
      articleLoading,
      commentLoading,
      commentLikeConfig,
      pageIndex,
      publishLoading,
      commentsKey,
      commentName,
      commentEmail,
      commentTotal
    } = this.state;
    return (
      <>
        <Container className="article-detail-container">
          <article className="article-detail" key="article-detail">
            {articleLoading ? (
              <p className="text-align">
                <Spinner name="ball-clip-rotate" color="#31c27c" /> 文章加载中..
              </p>
            ) : (
              <div key="article-detail-info">
                <h2 className="title">{articleInfo && articleInfo.title}</h2>
                <p className="author">
                  {articleInfo && articleInfo.author} |{" "}
                  {moment(articleInfo && articleInfo.publishDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </p>
                <section className="content">
                  <ReactMarkdown
                    source={articleInfo && articleInfo.content}
                    renderers={{
                      CodeBlock: CodeRender,
                      Code: CodeRender,
                      Link: LinkRender
                    }}
                  />
                </section>
                <p>
                  <button
                    type="button"
                    onClick={this.toggleLike}
                    className={classNames("label", "like", { isLike: isLike })}
                  >
                    <i className="icon icon-dianzan" />
                    {likeNum}
                    {showTip ? (
                      <span className={classNames("like-tip")}>
                        {isLike ? "+1" : "-1"}
                      </span>
                    ) : (
                      undefined
                    )}
                  </button>
                  <span className="label pv">
                    阅读量: {articleInfo && articleInfo.pageView}
                  </span>
                </p>
              </div>
            )}

            <div className="share-section">
              <Share
                description={`${articleInfo.title}:${
                  articleInfo.previewContent
                }`}
              />
            </div>
          </article>
          {/*文章评论*/}
          <section
            id="comment"
            className="article-comments-section"
            ref={node => (this.commentArea = node)}
          >
            <div className="article-comments-title">
              <h3 className="title">
                <span>
                  <i className="icon icon-shuohuaspeak" /> 评论 ({commentTotal})
                  条
                </span>
                <a onClick={this.openCommentModal} className="comment-btn">
                  发表评论
                </a>
              </h3>
            </div>
            {commentLoading ? (
              <p className="text-center">
                <Spinner name="ball-clip-rotate" color="#31c27c" />{" "}
                评论加载中...
              </p>
            ) : commentLists && commentLists.length >= 1 ? (
              <ul
                className="article-comments-lists"
                key="article-comments-lists"
              >
                {commentLists.map((item, i) => {
                  let {
                    commentName,
                    commentContent,
                    publishDate,
                    _id,
                    device,
                    like = 0
                  } = item;

                  {
                    /*const { like: currentLikeNum, isLike } = commentLikeConfig.find(({ commentId }) => commentId == _id)*/
                  }

                  return (
                    <li
                      className="item commentListAnimate"
                      key={`${commentsKey}-${i}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="inner">
                        <div className="comments-header">
                          <div className="img">
                            <img
                              src={require("images/default.jpeg")}
                              alt="head-img"
                            />
                          </div>
                          <span className="name">{commentName}</span>
                        </div>
                        <div className="comments-content">
                          <p>{commentContent}</p>
                        </div>
                        <div className="comments-footer">
                          <div className="device-content">
                            <i className="icon icon-liaotian" />
                            <span className="device">来自 {device}</span>
                          </div>
                          <span className="time">
                            <TimeAgo
                              datetime={moment(publishDate).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                              locale="zh_CN"
                            />
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="not-comments">
                <i className="icon icon-xiayu" /> 暂无评论,说两句噻!
              </p>
            )}
            <Pagination
              className={"article-comments-pagination"}
              total={count}
              current={pageIndex}
              onChange={this.getArticleCommentLists}
            />
          </section>
        </Container>
        <Modal
          title="发表评论"
          visible={commentModalVisible}
          onCancel={this.cancelCommentModal}
          className="comment-modal"
          footer={null}
        >
          <form method="post" className="comment-form">
            <fieldset>
              <p className="label">您的姓名：</p>
              <input
                type="text"
                value={commentName}
                autoComplete="true"
                onChange={e => this.setState({ commentName: e.target.value })}
                name="commentTile"
                className="comment-name"
                placeholder="请填写您的名字"
                minLength="1"
                maxLength="8"
                required
              />
            </fieldset>
            <fieldset>
              <p className="label">您的邮箱：</p>
              <input
                type="email"
                value={commentEmail}
                autoComplete="true"
                onChange={e => this.setState({ commentEmail: e.target.value })}
                name="commentTile"
                className="comment-name"
                placeholder="请填写您的邮箱"
                required
              />
            </fieldset>
            <fieldset>
              <p className="label">评论内容：</p>
              <textarea
                name="commentContent"
                onChange={e =>
                  this.setState({ commentContent: e.target.value })
                }
                className="comment-textarea"
                placeholder="说鸡不说吧,文明你我他!"
                maxLength="100"
                required
              />
            </fieldset>
            <fieldset>
              {publishLoading ? (
                <Button htmlType="button" type="disabled block">
                  <Spinner name="ball-clip-rotate" color="#31c27c" />请稍后.
                </Button>
              ) : (
                <Button
                  htmlType="button"
                  onClick={this.publishComment}
                  type="primary block"
                >
                  立即评论
                </Button>
              )}
            </fieldset>
          </form>
        </Modal>
      </>
    );
  }
  getArticleCommentLists = (type, current) => {
    let { pageIndex } = this.state;

    this.props.getArticleComments({
      articleId: this.props.params._id,
      pageIndex: type == "prev" ? --pageIndex : ++pageIndex,
      pageSize: this.pageSize
    });
    this.setState({
      pageIndex: current,
      commentsKey: Date.now()
    });
  };
  likeComment = (id, isLike) => {
    let { commentLikeConfig } = this.state;

    //先及时给出反馈再进行 请求
    const change = commentLikeConfig.reduce((arr, item) => {
      let o = {};
      if (item.commentId == id) {
        o = {
          ...item,
          isLike: !item.isLike,
          like: !item.isLike ? ++item.like : --item.like
        };
        arr.push(o);
      } else {
        arr.push(item);
      }
      return arr;
    }, []);

    this.setState({ commentLikeConfig: change });

    this.props.toggleLikeComment(id, !isLike, ({ success }) => {
      if (!success) return Message.error("点赞失败!");
    });
  };
  //发表评论
  publishComment = e => {
    const { commentName, commentEmail, commentContent } = this.state;
    if (!commentName) return Message.error("请填写姓名");
    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(commentEmail))
      return Message.error("请填写正确的邮箱");
    if (!commentContent) return Message.error("请填写评论!");

    const device = this.getDevice();

    const {
      params: { _id }
    } = this.props;
    this.setState(
      {
        publishLoading: true
      },
      () => {
        this.props.publishComment(
          {
            articleId: _id,
            commentName,
            commentEmail,
            commentContent,
            device,
            publishDate: helper.getCurrentTime()
          },
          ({ success }) => {
            if (success) {
              Message.success("评论成功!");
              this.setState({ publishLoading: false, commentContent: "" });
              this.cancelCommentModal();
              this.props.getArticleComments({
                articleId: this.props.params._id,
                pageIndex: this.state.pageIndex,
                pageSize: this.pageSize
              });
            } else {
              Message.error("评论失败!");
              this.setState({ publishLoading: false });
            }
          }
        );
      }
    );
  };
  openCommentModal = () => {
    this.setState({ commentModalVisible: true });
  };
  cancelCommentModal = () => {
    this.setState({ commentModalVisible: false });
    this.commentArea.scrollIntoView(true);
    this.commentArea.scrollIntoViewIfNeeded();
  };
  //获取设备
  getDevice = () => {
    return browser.isPC ? "PC" : "手机";
  };
  //喜欢
  toggleLike = () => {
    const {
      params: { _id }
    } = this.props;
    let { isLike, likeNum } = this.state;
    this.setState({
      isLike: !isLike,
      showTip: true,
      likeNum: !isLike ? ++likeNum : --likeNum
    });
    setTimeout(() => {
      this.setState({ showTip: false });
    }, 500);

    this.props.toggleLike(_id, !isLike, ({ success }) => {
      if (!success) return Message.error("点赞失败!");
    });
  };
  setComments = commentLists => {
    const commentLikeConfig =
      commentLists &&
      commentLists.map(({ _id, like }) => {
        return {
          commentId: _id,
          like,
          isLike: false
        };
      });
    return commentLikeConfig;
  };
  //文章详情页 => 回退到 文章列表页  跳转到 跳转详情页之前 的页数
  // componentWillUnmount() {
  //     this.props.resetArticlePage(sessionStorage.getItem('articleOldPageIndex'))
  // }
  async componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const {
      params: { _id },
      getArticleDetail,
      getArticleComments,
      addPageView
    } = this.props;
    getArticleDetail(_id, ({ like }) => {
      this.setState({
        likeNum: like,
        articleLoading: false,
        commentLoading: false
      });
    });
    getArticleComments(
      {
        articleId: _id,
        pageIndex: this.state.pageIndex,
        pageSize: this.pageSize
      },
      ({ total }) => {
        this.setState({
          commentTotal: total
        });
      }
    );

    const { author, email } = JSON.parse(
      localStorage.getItem("authorInfo") || "{}"
    );

    if (author && email) {
      this.setState({
        commentName: author,
        commentEmail: email
      });
    }
  }
}
