/*
 * @Author: jinke.li
 * @Date: 2017-07-17 19:42:40
 * @Last Modified by: jinke.li
 * @Last Modified time: 2019-05-22 15:05:11
 */
import React from "react";
import Message from "shared/components/Message";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./styles.less";

const images = [
  {
    original: require("images/default.jpeg"),
    thumbnail: require("images/default.jpeg"),
    description: "图片 1"
  },
  {
    original: require("images/alipay.jpg"),
    thumbnail: require("images/alipay.jpg"),
    description: "图片 2"
  },
];

export default class Photo extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div key="photo" className="photo-controller">
        <ImageGallery
          items={images}
          slideInterval={2000}
          lazyLoad={true}
          showPlayButton={false}
          onImageError={() => Message.error("帅照加载失败")}
          showIndex={true}
          showBullets={true}
        />
      </div>
    );
  }
  componentWillMount() {
    document.title = "照片墙-太升南路";
  }
}
