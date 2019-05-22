/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:42:14 
 * @Last Modified by:   jinke.li 
 * @Last Modified time: 2017-07-17 19:42:14 
 */
import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import classNames from "classnames"
import "./styles.less"

export default class Weather extends React.PureComponent {
  static defaultProps = {
    maxNum: 20, //数量
    type: "snow", //类型,
    angle:0,      //角度
  }
  CREATE_TIME = 5000 //每隔多少秒创建
  static PropTypes = {
    maxNum: PropTypes.number, //数量
    type: PropTypes.oneOf(['snow', 'rain']), //飘雪 or  下雨
    angle: PropTypes.number //角度  (单位deg)
  }
  constructor(props) {
    super(props)
    this.rainArray = []
  }
  //给随机数限定一个范围
  random(max, min) {
    return Math.random() * max + min
  }
  render() {
    return (
      <canvas className="rain-canvas"></canvas>
    )
  }
  _resize = () => {
    window.addEventListener('resize', () => {
      this.canvasWidth = document.body.clientWidth
      this.canvasHeight = document.body.clientHeight
      this.canvas.setAttribute('width', document.body.clientWidth)
      this.canvas.setAttribute('height', document.body.clientHeight)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    })
  }
  move = () => {
    const {maxNum} = this.props
    if(this.rainArray.length >= maxNum){
        this.rainArray.splice(0,1)
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.rainArray.forEach((rain) => {
      rain.draw()
    })
    requestAnimationFrame(this.move)
  }
  draw = () => {
    let {type,angle} = this.props
    let rain = new Rain(
      this.ctx,
      Math.random() * this.canvasWidth,
      0,
      this.random(10,3), 
      this.random(5,2),
      this.canvasHeight,
      angle,
      type
      
    )
    this.rainArray.push(rain)
  }
  componentDidMount = () => {
    this.canvas = ReactDOM.findDOMNode(this)
    const {num, snowR} = this.props
    this.ctx = this.canvas.getContext('2d')
    this.canvasWidth = document.body.clientWidth
    this.canvasHeight = document.body.clientHeight
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight

    setInterval(this.draw, this.CREATE_TIME)
    this.move()
    this._resize()
  }
}


function Rain(ctx, drawX, drawY, speed, r, canvasHeight,angle,type = "snow") {
  this.ctx = ctx
  this.drawX = drawX
  this.drawY = drawY
  this.speed = speed
  this.cH = canvasHeight
  this.type = type
  this.angle = angle
  this.draw = function() {
    this.ctx.save()
    if(this.angle != 0 ){
        this.ctx.translate(- this.angle, -this.angle);
        this.ctx.rotate(  this.angle * Math.PI / 180)
    }
    this.ctx.beginPath()
    this.ctx.shadowBlur = Math.random() * 10 + 2;
    this.ctx.shadowColor = "rgba(0,0,0,.2)";
    this.ctx.strokeStyle = "#fff"
    this.ctx.fillStyle = "#fff"
    this.ctx.moveTo(this.drawX,this.drawY)
    if(type === "snow"){
        this.ctx.arc(this.drawX, this.drawY, r, 0, Math.PI * 2)
    }else{
        this.ctx.lineTo(this.drawX,this.drawY+= Math.random()*10 + 4)
    }
    this.ctx.fill()
    this.ctx.lineWidth = 1
    this.ctx.stroke()

    this.ctx.closePath()
    this.ctx.restore()
    this.move()
  }
  this.move = function() {
    if (this.drawY >= this.cH) {
      this.drawY = 0
    } else {
      this.drawY += this.speed
    }
  }
}