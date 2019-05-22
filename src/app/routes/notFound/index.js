import React from "react";
import { browserHistory } from "react-router";
import "./styles.less";
export default class Photo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.time = 5;
    this.timer = null;
    this.state = {
      time: this.time
    };
  }
  render() {
    return (
      <div className="not-found">
        <h1 className="not-found-title">404</h1>,
        <p className="not-found-text">
          页面在火星,{this.state.time}s后回到首页...
        </p>
      </div>
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    document.title = "李金珂的小屋";
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(({ time }) => ({
        time: time - 1
      }));
    }, 1000);
    setTimeout(() => {
      browserHistory.push("/");
    }, this.time * 1000);
  }
  componentWillMount() {
    document.title = "404";
  }
}
