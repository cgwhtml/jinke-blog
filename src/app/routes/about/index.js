/*
 * @Author: jinke.li
 * @Date: 2017-07-17 19:43:01
 * @Last Modified by: jinke.li
 * @Last Modified time: 2019-05-22 15:19:08
 */
import React, { PureComponent } from "react";
import Container from "shared/components/Container";
import Modal from "shared/components/Modal";
import Button from "shared/components/Button";
import Message from "shared/components/Message";
import Share from "shared/components/Share";
import classNames from "classnames";
import { host, github } from "../../../../config";

import "./styles.less";

const interestConfig = [
  {
    icon: "icon-2guanyuwomeneps",
    text: "李金珂 95后"
  },
  {
    icon: "icon-dianzan",
    text: "手工业体力劳动者!"
  },
  {
    icon: "icon-article",
    text: `GitHub: {github}`
  },
  {
    icon: "icon-shuohuaspeak",
    text: "山前没相见,山后别相逢"
  },
  {
    icon: "icon-laba",
    text: "分享"
  }
];
// 人生就像函数式编程,传入一个参数,返回一个Function,每个阶段付出的东西不一样得到的东西也就不一样,只有不断的执行函数Fun()()()才会得到你想要的结果,我想:人生也是如此
export default class About extends PureComponent {
  state = {
    headerImgModalVisible: false, //照片弹框
    qrCodeModalVisible: false, //二维码弹框
    toggle: false,
    share: false
  };
  render() {
    const {
      headerImgModalVisible,
      qrCodeModalVisible,
      toggle,
      share
    } = this.state;
    return (
      <Container className="about-section">
        <div className="header-img-content">
          <div className="header-img">
            <span className="line" />
            <div className="img" onClick={this.onOpenHeaderImgModal}>
              <div className="show-title">
                <span>
                  <i className="icon icon-zhaopian-copy" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <section className="about-content">
          <ul className="about-interest">
            {interestConfig.map((item, index) => {
              let { icon, text } = item;
              const bindEvents =
                icon == "icon-laba" ? { onClick: this.openShare } : {};
              return (
                <li
                  key={index}
                  {...bindEvents}
                  className={classNames("item")}
                  style={{ animationDelay: `${0.3 * (index + 1) * 4}s` }}
                >
                  <i className={classNames("icon", icon)} />
                  {icon == "icon-article" ? (
                    <a
                      className="text"
                      href={github}
                      alt="github"
                      title="立即前往"
                      target="_blank"
                    >
                      {github}
                    </a>
                  ) : (
                    <span className="text">{text}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        {/*TODO  留言  */}
        <section className="qr-section">
          <Button type="error" onClick={this.openQrCodeModal}>
            打赏
          </Button>
        </section>
        {/*撞击头像小块块*/}
        <div className="strike-section">
          <img src={require("images/cjml.png")} alt="铁头娃" />
        </div>

        {/*查看照片*/}
        <Modal
          title="点击可翻转"
          visible={qrCodeModalVisible}
          onCancel={this.onCloseQrCodeModal}
          className="qr-code-modal"
          footer={null}
        >
          <div className="pay-content">
            <ul
              className={classNames("code-lists", { toggle: toggle })}
              onClick={this.toggleCode}
            >
              <li className="code alipay">
                <img src={require("images/alipay.jpg")} alt="alipay" />
              </li>
              <li className="code we-chat-pay">
                <img src={require("images/weChatPay.png")} alt="weChatPay" />
              </li>
            </ul>
          </div>
        </Modal>
        <Modal
          title="嘿嘿嘿"
          visible={headerImgModalVisible}
          onCancel={this.onCloseHeaderImgModal}
          className="header-img-modal"
          footer={[
            <Button key="badBoy" onClick={this.onBadBoy}>
              打扰了
            </Button>,
            <Button key="goodBoy" type="primary" onClick={this.onGoodBoy}>
              多捞啊
            </Button>
          ]}
        >
          <div className="header-img-modal-content">
            {headerImgModalVisible ? (
              <img src={require("images/default.jpeg")} alt="我" />
            ) : (
              undefined
            )}
          </div>
        </Modal>
        <Modal
          title="分享"
          visible={share}
          onOk={this.closeShare}
          onCancel={this.closeShare}
          className="share-modal"
        >
          <div className="share-content">
            <Share shareHost={true} />
          </div>
        </Modal>
      </Container>
    );
  }
  openShare = () => {
    this.setState({ share: true });
  };
  closeShare = () => {
    this.setState({ share: false });
  };
  toggleCode = () => {
    this.setState({ toggle: !this.state.toggle });
  };
  onCloseQrCodeModal = () => {
    this.setState({ qrCodeModalVisible: false });
  };
  openQrCodeModal = () => {
    this.setState({ qrCodeModalVisible: true });
  };
  onCloseHeaderImgModal = () => {
    this.setState({ headerImgModalVisible: false });
  };
  onBadBoy = () => {
    this.setState({ headerImgModalVisible: false });
    Message.warning("你瞎呀!");
  };
  onGoodBoy = () => {
    this.setState({ headerImgModalVisible: false });
    Message.success("有眼光!");
  };
  onOpenHeaderImgModal = () => {
    this.setState({ headerImgModalVisible: true });
  };
  sayAlas = (text = "李金珂666", lang = "zh-CN") => {
    let speech = new window.SpeechSynthesisUtterance();
    speech.lang = lang;
    speech.text = text;
    speech.rate = 1;
    speech.pitch = 1;
    speech.onstart = () => {
      console.log(`[SpeechSynthesisUtterance-start]:${text}(${lang})`);
    };
    speech.onend = () => {
      console.log(`[SpeechSynthesisUtterance-end]:${text}${lang}`);
    };
    window.speechSynthesis.speak(speech);
    const voices = window.speechSynthesis.getVoices();
  };
  componentWillMount() {
    document.title = "关于我-金科北路";
  }
  componentDidMount() {
    const selfIntroduction = `
        我是李金珂
        前端菜鸟一个
        CV战神
        我的个人网站是:${host}
        GihHub是:${github}
        Copyright © 2017  By 李金珂 jinke.Li')
        觉得我的网站还行,就点一下分享吧!,溜了溜了!
        `;
    console.info("关于我们动画设计制作 By:李金珂 :)");

    //等同于 SpeechSynthesisUtterance in "window"
    if (Reflect.has(window, "SpeechSynthesisUtterance")) {
      setTimeout(() => {
        this.sayAlas("哦豁!");
      }, 2700);

      // setTimeout(()=>{
      //     this.sayAlas(selfIntroduction)
      // },7000)
    }
  }
}
