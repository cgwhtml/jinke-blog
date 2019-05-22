/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:41:27 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-07-25 16:30:31
 */
import React from "react";
import propTypes from "prop-types";
import { createPortal } from "react-dom"; //传送门 将节点挂载在root 节点之外
import classNames from "classnames";
import Button from "shared/components/Button";
import "./styles.less";

export default class Modal extends React.PureComponent {
  state = {
    init: false //是否初始化
  };
  static defaultProps = {
    title: "标题",
    onOk: () => {},
    onCancel: () => {},
    okText: "确定",
    cancelText: "取消",
    footer: [],
    content: null,
    confirmLoading: false
  };
  static propTypes = {
    onCancel: propTypes.func.isRequired,
    footer: propTypes.oneOfType([
      //footer 不需要设置为 footer={null}
      propTypes.array,
      propTypes.bool,
      propTypes.object
    ])
  };
  static confirm = () => {
    const div = document.createElement("div");
    const _modal = ReactDOM.render(
      <Modal
        title="test"
        visible={true}
        onOk={() => alert(1)}
        onCancel={() => alert(2)}
        content={"1111"}
      />,
      div
    );
    document.querySelector(".jk-message").appendChild(_modal);
  };
  //解决第一次进入页面 会闪一下的问题
  componentWillReceiveProps({ visible }) {
    if (visible === true) {
      this.setState({
        init: true
      });
      // {
      //     behavior: "smooth",          //平滑的切换
      // }
      try {
        this.modal.scrollIntoView(true);
        this.modal.scrollscrollIntoViewIfNeeded();
      } catch (error) {
        document.body.scrollTop = this.modal.offsetTop;
      }
    }
  }
  render() {
    const { init } = this.state;
    const {
      children,
      content,
      title,
      visible,
      onCancel,
      onOk,
      className,
      footer,
      okText,
      cancelText,
      confirmLoading,
      ...attr
    } = this.props;
    const initAnimateState = init
      ? { "modal-open": visible, "modal-close": !visible }
      : { "modal-open": visible };
    return (
      <div
        key="jinke-modal-mask"
        {...attr}
        className={classNames("jinke-modal-mask", className, initAnimateState)}
      >
        <div
          key="modal"
          className={classNames("jinke-modal", initAnimateState)}
          ref={node => (this.modal = node)}
        >
          <section key="modal-header" className="modal-header">
            <h2 className="title">{title}</h2>
            <span className="modal-close-btn" onClick={() => onCancel()}>
              <i className="icon icon-guanbi1" />
            </span>
          </section>
          <section key="modal-content" className="modal-content">
            {content || children}
          </section>
          {footer && footer.length >= 1 ? (
            <section key="modal-footer" className="modal-footer">
              {footer.map(btns => btns)}
            </section>
          ) : footer instanceof Array ? (
            <section key="modal-footer" className="modal-footer">
              <Button onClick={() => onCancel()}>{cancelText}</Button>
              <Button
                type={confirmLoading ? "disabled" : "primary"}
                onClick={() => onOk()}
              >
                {confirmLoading ? "请稍后..." : okText}
              </Button>
            </section>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}
