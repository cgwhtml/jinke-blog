import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactMarkdown from "react-markdown";
import Container from "shared/components/Container";
import Modal from "shared/components/Modal";
import Button from "shared/components/Button";
import Message from "shared/components/Message";
import Pagination from "shared/components/Pagination";
import helper from "shared/libs/helper";
import { Link } from "react-router";
import classNames from "classnames";
import moment from "moment";
import Spinner from "react-spinkit";
import Calendar from "rc-calendar";
import DatePicker from "rc-calendar/lib/Picker";

import {
  CodeRender,
  LinkRender,
} from "shared/libs/markdown-render";
import getArticleLists, {
  getArticleRanking,
  addPageView,
  uploadArticle
} from "./action";
import "moment/locale/zh-cn";
import zhCN from "rc-calendar/lib/locale/zh_CN";

const format = "YYYY-MM-DD";
const now = moment()
  .locale("zh-cn")
  .utcOffset(8);

import "rc-time-picker/assets/index.css";
import "rc-calendar/assets/index.css";
import "./styles.less";

function getFormat(time) {
  return time ? format : "YYYY-MM-DD";
}

@connect(
  ({ ArticleAction, ArticleDetailAction }) => ({
    articleData: ArticleAction.lists,
    ranking: ArticleAction.ranking,
    uploadInfo: ArticleAction.uploadInfo,
    articleOldPageIndex: ArticleDetailAction.articleOldPageIndex
  }),
  dispatch =>
    bindActionCreators(
      {
        getArticleLists,
        getArticleRanking,
        uploadArticle,
        addPageView
      },
      dispatch
    )
)
export default class Article extends React.PureComponent {
  state = {
    rankingType: "like", //默认喜欢 降序排列
    articleModalVisible: false,
    editTitle: "", //上传文章标题
    editAuthor: "李金珂", //上传文章作者
    editContent: "", //上传文章内容
    editCategory: ["杂文"], //上传文章分类
    editEmail: "", //作者邮箱
    rankingLoading: true,
    articleLoading: true,
    pageIndex: 1, //当前页码
    draftTip: false, //保存草稿提示
    publishLoading: false, //是否正在提交文章
    previewModalVisible: false,
    searchInpVisible: false, //搜索框
    previewContent: "", //文章预览语句
    listKey: Date.now(), //列表出现的动画 每次分页时  key是一样 会导致无动画 加一个随机key就行
    searchLoading: false,
    searchTitle: "", //搜素文章作者
    searchAuthor: "",
    searchStartDate: "",
    searchEndDate: "",
    searchCategory: "", //搜索文章类型
    focusedInput: null,
    rankingKey: Date.now()
  };
  pageIndex = 1;
  pageSize = 5; //文章每页个数
  render() {
    const { articleData, ranking } = this.props;
    const articleLists = articleData && articleData.articleLists;
    const count = articleData && articleData.count;
    const {
      rankingType,
      articleModalVisible,
      rankingLoading,
      articleLoading,
      pageIndex,
      editContent,
      draftTip,
      publishLoading,
      previewContent,
      editTitle,
      previewModalVisible,
      searchInpVisible,
      rankingKey,
      listKey,
      searchLoading,
      focusedInput, //搜素文章作者
      searchTitle,
      searchAuthor,
      searchStartDate,
      searchEndDate,
      editAuthor,
      searchCategory, //搜索文章类型
      editEmail
    } = this.state;

    const calendar = (
      <Calendar
        locale={zhCN}
        style={{ zIndex: 1000 }}
        dateInputPlaceholder="请输入"
        defaultValue={now}
        timePicker={false}
        formatter={getFormat(searchStartDate)}
        showDateInput={true}
        onChange={this.searchDateChange}
      />
    );

    return (
      <Container className="article-section">
        <div className="article-list">
          <section className="article-content-header">
            <h2 className="title">
              <span>
                <i className="icon icon-article" />
                <span>文章列表</span>
              </span>
              <a
                onClick={this.openSearchInp}
                className="article-search-link"
                title="搜索文章"
              >
                <i className="icon icon-sousuo" />
              </a>
              {/* <a onClick={this.openArticleModal} className="eidt-article-btn"><i className="icon icon-sousuo"></i>搜索</a> */}
              <a onClick={this.openArticleModal} className="eidt-article-btn">
                <i className="icon icon-bianji" />写文章
              </a>
            </h2>
          </section>
          <section className="article-content">
            {articleLoading ? (
              <p className="text-center">
                <Spinner name="ball-clip-rotate" color="#31c27c" />拼了老命加载中...
              </p>
            ) : articleLists && articleLists.length >= 1 ? (
              <ul>
                {articleLists.map((list, i) => {
                  const {
                    title,
                    content = "",
                    previewContent = "",
                    author,
                    publishDate,
                    pageView,
                    like,
                    category,
                    _id,
                    comments = 0
                  } = list;
                  return (
                    <li
                      className="item articleListAnimate"
                      key={`random-${listKey}-${i}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                      onClick={() => this.addPageView(_id, title)}
                    >
                      <h2 className="title">
                        <Link to={`/article/detail/${_id}`}>{title}</Link>
                      </h2>
                      <p className="content">{previewContent}</p>
                      <div className="info">
                        <div>
                          <span className="auth">{author}</span>
                          <span className="time">
                            {moment(publishDate).format("YYYY-MM-DD HH:mm:ss")}
                          </span>
                          <span className="label">
                            {category.map((item, index) => {
                              return <span key={index}>{item}</span>;
                            })}
                          </span>
                        </div>

                        <div className="like">
                          <span>
                            阅读量:<i className="num">{pageView}</i>
                          </span>
                          <span>
                            <i className="icon icon-dianzan" />
                            <i className="num">{like}</i>
                          </span>
                          <span>
                            <i className="icon icon-shuohuaspeak" />
                            <i className="num">{comments}</i>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center color-white">
                <i className="icon icon-xiayu" /> 暂无文章
              </p>
            )}
          </section>
          {/*分页器*/}
          <Pagination
            className={"article-pagination"}
            total={count}
            current={pageIndex}
            onChange={this.getArticlePageLists}
          />
        </div>
        {/*文章点击排行*/}
        <div className="article-ranking">
          <section className="article-ranking-header">
            <h2 className="title">
              <i className="icon icon-dianzandian" />
              <span>文章排行</span>
              <span className="category">
                <a
                  className={classNames({ active: rankingType === "like" })}
                  onClick={() => this.toggleRanking("like")}
                >
                  喜欢榜
                </a>
                <a
                  className={classNames({ active: rankingType === "pageView" })}
                  onClick={() => this.toggleRanking("pageView")}
                >
                  阅读榜
                </a>
              </span>
            </h2>
          </section>
          <ul className="article-ranking-list">
            {rankingLoading ? (
              <p className="text-center">
                <Spinner name="ball-clip-rotate" color="#31c27c" />拼了老命加载中...
              </p>
            ) : ranking && ranking.length >= 1 ? (
              ranking.map((data, i) => {
                let { title, like, pageView, _id, commentNum = 0 } = data;
                return (
                  <li
                    key={`ranking-${rankingKey}-${i}`}
                    className="ranking-item"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span
                      className="article-name"
                      onClick={() => this.addPageView(_id)}
                    >
                      <Link to={`/article/detail/${_id}`}>{title}</Link>
                    </span>
                    {rankingType === "like" ? (
                      <span className={classNames("type", "like")}>
                        喜欢量: {like}
                      </span>
                    ) : (
                      <span className={classNames("type", "pageView")}>
                        阅读量: {pageView}
                      </span>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="text-center color-white">暂无排行</li>
            )}
          </ul>
        </div>
        <Modal
          title="编写文章"
          visible={articleModalVisible}
          onCancel={this.cancelArticleModal}
          className="edit-article-modal"
          footer={null}
        >
          <form method="post" className="edit-form">
            <fieldset>
              {/*<span className="label">文章名：</span>*/}
              <input
                type="text"
                onChange={e => this.setState({ editTitle: e.target.value })}
                name="editTile"
                className="edit-title"
                placeholder="标题,做个标题党"
                maxLength="30"
                required
              />
            </fieldset>
            <fieldset>
              {/*<span className="label">作者名：</span>*/}
              <input
                type="text"
                onChange={e => this.setState({ editAuthor: e.target.value })}
                name="editAuthor"
                value={editAuthor}
                className="edit-author"
                placeholder="姓名,默认【佚名】"
                maxLength="10"
              />
            </fieldset>
            <fieldset>
              {/*<span className="label">邮箱：</span>*/}
              <input
                type="email"
                value={editEmail}
                onChange={e => this.setState({ editEmail: e.target.value })}
                name="editEmail"
                className="edit-editEmail"
                placeholder="邮箱,审核通过将通过此邮箱通知你"
                required
              />
            </fieldset>
            <fieldset>
              <input
                type="text"
                name="previewContent"
                onChange={this.savePreviewContent}
                className="edit-author"
                placeholder="文章预览,简短的一句话"
                required
              />
            </fieldset>
            <fieldset>
              <p>文章内容：</p>
              <span
                className={classNames("draft-tip", {
                  "draft-animate": draftTip
                })}
                key="draft-tip"
              >
                草稿已保存
              </span>
              <textarea
                name="editContent"
                onChange={this.saveEditContent}
                className="edit-textarea"
                placeholder="支持markdown语法"
                value={editContent}
                required
              />
              <Button
                type="info"
                className="preview-btn"
                onClick={this.showPreviewArticle}
              >
                预览
              </Button>
            </fieldset>
            <fieldset>
              <p>文章分类：</p>
              <select onChange={this.categoryChange}>
                <option value="杂文">杂文</option>
                <option value="日记">日记</option>
                <option value="心得">心得</option>
                <option value="感悟">感悟</option>
                <option value="随笔">随笔</option>
                <option value="前端代码">前端代码</option>
                <option value="后端代码">后端代码</option>
                <option value="其他">其他</option>
              </select>
            </fieldset>
            <fieldset>
              {publishLoading ? (
                <Button htmlType="button" type="disabled block">
                  正在发表...
                </Button>
              ) : (
                <Button
                  htmlType="button"
                  onClick={this.publishArticle}
                  type="primary block"
                >
                  发表
                </Button>
              )}
            </fieldset>
          </form>
        </Modal>
        <Modal
          title={editTitle || "请填写文章标题"}
          visible={previewModalVisible}
          onCancel={this.closePreviewArtice}
          className="edit-article-modal"
          footer={null}
        >
          <ReactMarkdown
            source={editContent || "请填写文章内容"}
            renderers={{
              CodeBlock: CodeRender,
              Code: CodeRender,
              Link: LinkRender
            }}
          />
        </Modal>
        <Modal
          title={"搜索文章"}
          visible={searchInpVisible}
          onOk={this.searchArticle}
          onCancel={this.closeSearchInp}
          confirmLoading={searchLoading}
          className="search-article-modal"
        >
          <form method="post" className="edit-form">
            <fieldset>
              <p>标题：</p>
              <input
                type="text"
                onChange={e => this.setState({ searchTitle: e.target.value })}
                name="editTile"
                className="edit-title"
                placeholder="按标题进行搜索"
                maxLength="30"
                required
              />
            </fieldset>
            <fieldset>
              <p>作者:</p>
              <input
                type="text"
                onChange={e => this.setState({ searchAuthor: e.target.value })}
                name="editAuthor"
                className="edit-author"
                placeholder="按作者名进行搜索"
                maxLength="10"
              />
            </fieldset>
            <fieldset>
              <p>发表日期:</p>
              <DatePicker
                animation="slide-up"
                locale={zhCN}
                calendar={calendar}
                dateInputPlaceholder="请选择文章发表日期:"
                onChange={this.searchDateChange}
                showDateInput={true}
              >
                {({ value }) => {
                  return (
                    <input
                      type="text"
                      placeholder="点击选择"
                      readOnly
                      tabIndex="-1"
                      className="ant-calendar-picker-input ant-input"
                      value={
                        (value && value.format(getFormat(searchStartDate))) ||
                        ""
                      }
                    />
                  );
                }}
              </DatePicker>
            </fieldset>
            <fieldset>
              <p>文章分类：</p>
              <select onChange={this.categorySearchChange}>
                <option value="">不限</option>
                <option value="杂文">杂文</option>
                <option value="日记">日记</option>
                <option value="心得">心得</option>
                <option value="感悟">感悟</option>
                <option value="随笔">随笔</option>
                <option value="前端代码">前端代码</option>
                <option value="后端代码">后端代码</option>
                <option value="其他">其他</option>
              </select>
            </fieldset>
          </form>
        </Modal>
      </Container>
    );
  }
  searchDateChange = value => {
    const date = (value && value.format(format)) || "";
    this.setState({
      searchStartDate: date
    });
  };
  categorySearchChange = e => {
    this.setState({ searchCategory: [e.target.value] });
  };
  //搜索文章
  searchArticle = () => {
    const {
      searchTitle,
      searchAuthor,
      searchStartDate,
      searchCategory
    } = this.state;

    // if (!searchTitle &&
    //     !searchAuthor &&
    //     !searchStartDate &&
    //     !searchCategory
    // ) return Message.error('请至少选择一项进行搜索')

    this.setState({ searchLoading: true });

    this.props.getArticleLists(
      {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        title: searchTitle,
        author: searchAuthor,
        date: searchStartDate,
        category: searchCategory
      },
      () => {
        Message.success("文章查询成功!");
        this.setState({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          searchInpVisible: false,
          searchLoading: false
        });
      }
    );
  };
  searchInpChange = e => {
    this.setState({ searchTitle: e.target.value });
  };
  keyDown = e => {
    if (e.keyCode == 13 && this.state.searchTitle != "") {
      this.setState(
        {
          searchInpVisible: false
        },
        () => {
          this.setState(
            {
              articleLoading: true
            },
            () => {
              const { pageIndex, searchTitle } = this.state;
              this.props.getArticleLists(
                {
                  title: searchTitle,
                  pageIndex: pageIndex,
                  pageSize: this.pageSize
                },
                () => {
                  this.setState({ articleLoading: false });
                }
              );
            }
          );
        }
      );
    }
  };
  openSearchInp = () => {
    this.setState({ searchInpVisible: true });
  };
  closeSearchInp = () => {
    this.setState({ searchInpVisible: false });
    document.body.scrollTop = 0;
  };
  showPreviewArticle = () => {
    this.setState({ previewModalVisible: true });
  };
  closePreviewArtice = () => {
    this.setState({ previewModalVisible: false });
  };
  savePreviewContent = e => {
    this.setState({ previewContent: e.target.value });
  };
  //保存用户文章至草稿  以防丢失
  //函数节流 绑定的onkeyUp事件  会高频多次触发  这次已停止操作的最后一次为准 保存到草稿
  saveEditContent = e => {
    const content = e.target.value;
    this.setState({ editContent: content });
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      localStorage.setItem("contentDraft", content);
      this.setState({ draftTip: true });
      setTimeout(() => {
        this.setState({ draftTip: false });
      }, 1000);
    }, 2000);
  };
  getArticlePageLists = (type, current) => {
    let {
      pageIndex,
      searchTitle,
      searchAuthor,
      times,
      searchCategory
    } = this.state;

    this.props.getArticleLists({
      pageIndex: type == "prev" ? --pageIndex : ++pageIndex,
      pageSize: this.pageSize,
      title: searchTitle,
      author: searchAuthor,
      date: times,
      category: searchCategory
    });
    this.setState(
      {
        listKey: Date.now(),
        pageIndex: current
      },
      () => {
        document.body.scrollTop = 0;
        sessionStorage.setItem("articleOldPageIndex", current);
      }
    );
  };
  addPageView = (id, title) => {
    this.props.addPageView(id);
    document.title = title;
  };
  categoryChange = e => {
    this.setState({ editCategory: [e.target.value] });
  };
  openArticleModal = () => {
    this.setState({ articleModalVisible: true });
  };
  cancelArticleModal = () => {
    this.setState({ articleModalVisible: false });
    document.body.scrollTop = 0;
  };
  //上传文章
  publishArticle = () => {
    const {
      editTitle,
      editAuthor = "佚名",
      editContent,
      editEmail,
      previewContent,
      editCategory
    } = this.state;

    if (!editTitle) return Message.error("请填写文章标题!");
    if (!previewContent) return Message.error("请填写预览文章内容!");
    if (!editContent) return Message.error("文章内容不能为空!");
    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(editEmail))
      return Message.error("请填写正确的邮箱");

    let values = {};
    values.editTitle = editTitle;
    values.editAuthor = editAuthor;
    values.previewContent = previewContent;
    values.editContent = editContent;
    values.editCategory = editCategory;
    values.editEmail = editEmail;
    values.publishDate = helper.getCurrentTime();
    values.pageView = "0";
    (values.like = "0"),
      (values.approve = false), //是否审核通过
      this.setState(
        {
          publishLoading: true
        },
        () => {
          this.props.uploadArticle(values, ({ success }) => {
            if (success) {
              Message.success("上传成功,请等待审核!");
              this.setState({ publishLoading: false });
              this.cancelArticleModal();
              this.clearDraft();
              localStorage.setItem(
                "authorInfo",
                JSON.stringify({ author: editAuthor, email: editEmail })
              );
            } else {
              Message.error("上传失败!");
            }
          });
        }
      );
  };
  clearDraft = () => {
    localStorage.removeItem("contentDraft");
  };
  addDraft = () => {
    const draft = localStorage.getItem("contentDraft") || "";
    this.setState({
      editContent: draft
    });
  };
  //切换排行榜
  toggleRanking = rankingType => {
    this.setState({ rankingType, rankingKey: Date.now() });
    this.props.getArticleRanking(rankingType);
  };
  _getArticleLists = pageIndex => {
    const _pageIndex = ~~(
      pageIndex ||
      sessionStorage.getItem("articleOldPageIndex") ||
      this.state.pageIndex
    );

    this.props.getArticleLists(
      {
        pageIndex: _pageIndex,
        pageSize: this.pageSize
      },
      () => {
        this.setState({ articleLoading: false, pageIndex: _pageIndex });
      }
    );
  };
  componentWillMount() {
    document.title = "杂文集-清江西路";
  }
  componentDidMount() {
    this.time = null;
    this.props.getArticleRanking(this.state.rankingType, () => {
      this.setState({ rankingLoading: false });
    });

    this._getArticleLists();
    this.addDraft();

    const { author, email } = JSON.parse(
      localStorage.getItem("authorInfo") || "{}"
    );

    if (author && email) {
      this.setState({
        editAuthor: author,
        editEmail: email
      });
    }
  }
}
