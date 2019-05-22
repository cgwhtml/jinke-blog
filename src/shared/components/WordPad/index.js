import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import propTypes from "prop-types"

import "./styles.less";
export default class WordPad extends PureComponent {
  state = {
    isMouseDown: false,
    lastCoordinate: {
      //上一次的坐标
      x: 0,
      y: 0
    },
  };
  static defaultProps = {
    clear:false,
    width: 700,
    height: 700,
    strokeColor:"#444"
  };
  static propTypes = {
    width: propTypes.number,
    height: propTypes.number,
    strokeColor: propTypes.string
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <canvas id="word-pad" title="鼠标滑动写字" ref={node => (this.canvas = node)}>
        1周年
      </canvas>
    );
  }
  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }
  windowToCanvas(x, y) {
    const { left, top } = this.canvas.getBoundingClientRect();
    return {
      x: Math.round(x - left),
      y: Math.round(y - top)
    };
  }
  bindEvents() {
    this.canvas.onmousedown = e => {
      e.preventDefault();
      this.setState({isMouseDown:true})
      this.setState({
        lastCoordinate:this.windowToCanvas(e.clientX, e.clientY)
      }) 
    };
    this.canvas.onmouseup = e => {
      e.preventDefault();
      this.setState({
        isMouseDown : false
      })

    };
    this.canvas.onmouseout = e => {
      e.preventDefault();
      this.setState({
        isMouseDown : false
      })
    };
    this.canvas.onmousemove = e => {
      e.preventDefault();
      const { isMouseDown,lastCoordinate } = this.state
      const { strokeColor } = this.props
      if (isMouseDown) {
        //如果鼠标移动的时候鼠标是按下时  执行绘制
        const nowCoordinate = this.windowToCanvas(e.clientX, e.clientY);
        this.ctx.beginPath();
        this.ctx.moveTo(lastCoordinate.x, lastCoordinate.y);
        this.ctx.lineTo(nowCoordinate.x, nowCoordinate.y);
        this.ctx.lineWidth = 10;
        this.ctx.strokeStyle = strokeColor
        this.ctx.lineCap = "round"; //线是圆滑的
        this.ctx.lineJoin = "round"; //两根线过渡圆形
        this.ctx.stroke();

        //更新坐标
        this.setState({
          lastCoordinate:nowCoordinate
        })
      }
    };
  }
  componentWillReceiveProps({clear}){
    if(clear){
      this.clear()
    }
  }
  componentDidMount() {
    const { width, height } = this.props;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.bindEvents();
    this.props.getCanvas(this.canvas,this.ctx)
  }
}
