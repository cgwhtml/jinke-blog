/**
 * @name 1周年 展示页面
 * @Author: jinke.li 
 * @Date: 2018-08-10 23:08:40 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-08-11 13:59:48
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Message from "shared/components/Message";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./styles.less";

import getWordLists from "./action";

@connect(
  ({ OneYearAction }) => ({
    lists: OneYearAction.lists
  }),
  dispatch =>
    bindActionCreators(
      {
        getWordLists
      },
      dispatch
    )
)
export default class OneYear extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { lists } = this.props;

    const images = lists.map(({url},i)=>{
      return {
        original: url,
        thumbnail: `${url}?imageView2/1/w/92/h/69`,
        description: `热心网友-${i+1}`
      }
    })
    return (
      <div key="photo" className="photo-controller">
        <ImageGallery
          items={images}
          slideInterval={2000}
          lazyLoad={true}
          showPlayButton={false}
          onImageError={(err) => console.log("图片加载失败:",err)}
          showIndex={true}
          showBullets={true}
        />
      </div>
    );
  }
  componentWillMount() {
    document.title = "1周年特别活动-文字画廊";
  }
  componentDidMount() {
    this.props.getWordLists();
  }
}
