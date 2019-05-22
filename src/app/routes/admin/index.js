import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "shared/components/Button";
import Message from "shared/components/Message";
import Modal from "shared/components/Modal";
import Pagination from "shared/components/Pagination";
import moment from "moment";
import { adminEmail } from "../../../../config";
import ReactMarkdown from "react-markdown";
import RcMessage from "rc-message";
import { CodeRender, LinkRender } from "shared/libs/markdown-render";
import getArticleLists, { deleteArticle, editContent, approve } from "./action";
import { browserHistory } from "react-router";
import "react-jinke-music-player/assets/index.css";
import "./styles.less";

@connect(
  ({ AdminAction }) => ({
    articleData: AdminAction.lists
  }),
  dispatch =>
    bindActionCreators(
      {
        getArticleLists,
        deleteArticle,
        editContent,
        approve
      },
      dispatch
    )
)

//暂时性的管理后台  用来管理文章审核
export default class Admin extends React.PureComponent {
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
    const {
      articleList,
      contentModalVisible,
      content,
      previewContent,
      id,
      title,
      loading,
      pageIndex,
      previewModalVisible
    } = this.state;
    const { articleData } = this.props;
    const articleLists = articleData && articleData.articleLists;

    const count = articleData && articleData.count;
    return (
      <div className="admin-section">
        <div>
          <Button
            type="primary"
            onClick={() => browserHistory.push("/admin/music")}
          >
            音乐管理
          </Button>
          <Button
            type="primary"
            onClick={() => browserHistory.push("/admin/photo")}
          >
            照片墙管理
          </Button>
        </div>
        <h2 className="title">文章审核</h2>
        <table>
          <thead>
            <tr>
              <td>标题</td>
              <td>内容</td>
              <td>作者</td>
              <td>发表日期</td>
              <td>PV</td>
              <td>赞</td>
              <td>邮箱</td>
              <td>分类</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            {articleLists && articleLists.length >= 1 ? (
              articleLists.map((item, i) => {
                const {
                  _id,
                  title = "",
                  content = "",
                  author,
                  publishDate,
                  pageView,
                  previewContent = "",
                  like,
                  approve,
                  email = adminEmail,
                  category
                } = item;
                let date = moment(publishDate).format("YYYY-MM-DD HH:mm:ss");
                return (
                  <tr key={i}>
                    <td>{title}</td>
                    <td>
                      <a
                        onClick={() =>
                          this.showContent(_id, title, content, previewContent)
                        }
                        className="btn btn-info"
                      >
                        编辑
                      </a>
                    </td>
                    <td>{author}</td>
                    <td>{date}</td>
                    <td>{pageView}</td>
                    <td>{like}</td>
                    <td>{email}</td>
                    <td>{category}</td>
                    <td colSpan="2">
                      {!approve ? (
                        loading ? (
                          <Button type="disbled">审核中...</Button>
                        ) : (
                          <Button
                            type="info"
                            onClick={() =>
                              this.onApprove(_id, title, date, email)
                            }
                          >
                            通过
                          </Button>
                        )
                      ) : (
                        <span>已审核</span>
                      )}
                      <a
                        className="delete-link"
                        onClick={() => this.onDeleteArticle(_id, title)}
                      >
                        删除
                      </a>
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
        <Pagination
          className="admin-pagination"
          total={count}
          current={pageIndex}
          onChange={this.getArticlePageLists}
        />
        <Modal
          key="edit-article-modal"
          title="查看文章内容"
          visible={contentModalVisible}
          onCancel={this.cancelContentModal}
          className="edit-article-modal"
          footer={[
            <Button
              key="edit-article-cancel"
              type=""
              onClick={this.cancelContentModal}
            >
              取消
            </Button>,
            <Button
              key="edit-article-ok"
              type="primary"
              onClick={() =>
                this.editContent(id, title, content, previewContent)
              }
            >
              修改
            </Button>
          ]}
        >
          <p>
            {" "}
            文章标题：
            <input
              type="text"
              name="title"
              onChange={this.saveTitle}
              value={title}
              className="edit-title"
              placeholder="修改文章标题"
              required
            />
          </p>

          <p>
            文章预览描述：
            <input
              type="text"
              name="previewContent"
              value={previewContent}
              onChange={this.savePreviewContent}
              className="preview-content"
              placeholder="文章预览,简短的一句话"
              required
            />
          </p>
          <textarea
            className="edit-textarea"
            key="edit-textarea"
            value={content}
            placeholder="暂无内容"
            onChange={this.updateArticle}
          />
          <Button
            type="info"
            className="preview-btn"
            onClick={this.showPreviewArticle}
          >
            预览
          </Button>
        </Modal>
        <Modal
          title={title}
          visible={previewModalVisible}
          onCancel={this.closePreviewArtice}
          className="edit-article-modal"
          footer={null}
        >
          <ReactMarkdown
            source={content}
            renderers={{
              CodeBlock: CodeRender,
              Code: CodeRender,
              Link: LinkRender
            }}
          />
        </Modal>
      </div>
    );
  }
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
  getArticlePageLists = (type, current) => {
    let { pageIndex } = this.state;

    this.props.getArticleLists({
      pageIndex: type == "prev" ? --pageIndex : ++pageIndex,
      pageSize: this.pageSize
    });
    this.setState({
      pageIndex: current
    });
  };

  cancelContentModal = () => {
    this.setState({
      contentModalVisible: false
    });
  };
  showContent = (id, title, content, previewContent) => {
    this.setState({
      contentModalVisible: true,
      content,
      id,
      title,
      previewContent
    });
  };
  onApprove = (id, title, publishDate, email) => {
    RcMessage.confirm({
      content: `确认通过 [ ${title} ] 吗?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.setState({ loading: true });
        this.props.approve({ id, title, publishDate, email }, ({ success }) => {
          if (success) {
            Message.success("审核通过！");
            this.props.getArticleLists({
              pageIndex: this.state.pageIndex,
              pageSize: this.pageSize
            });
          } else {
            Message.error("审核失败!");
          }
          this.setState({
            loading: false
          });
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
    this.props.getArticleLists({
      pageIndex: this.state.pageIndex,
      pageSize: this.pageSize
    });
  }
}
