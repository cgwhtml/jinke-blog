/*
 * @Author: jinke.li 
 * @Date: 2017-05-12 13:55:04 
 * @Last Modified by:   jinke.li 
 * @Last Modified time: 2017-05-12 13:55:04 
 */

import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import './styles.less'

export default class RotatePhoto extends React.PureComponent {
    static defaultProps = {
        space:30,
        width:300,
        height:300
    }
    static propTypes = {
        categories:PropTypes.array.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            rotate:0,
            delay:0
        }
    }
    onRotateBoxClick = (e,length)=>{
        const screenWidth = document.body.clientWidth / 2
        const pageX = e.pageX
        const imageRoate = 360 / length;
        let {rotate} = this.state
        if(pageX > screenWidth){
            rotate -=imageRoate
        }else{
            rotate +=imageRoate
        }
        this.setState({
            rotate
        })
    }
    render() {
        const {categories,space,width,height,animateTime,className} = this.props
        const {delay,rotate} = this.state

        const animationDuration = {
            "animationDuration":`${animateTime}s`,
            "animationDelay":delay
        }
        const styles ={
            ...animationDuration,
            transform:`rotateY(${rotate}deg)`
        }
        const categoriesLength = categories.length

        const r = ~~ ( (width /2 ) / Math.tan( (360/categoriesLength/2 ) / 180 * Math.PI )  + space );

        const photoConfig ={
            "photo1":require("images/photo14.jpg"),
            "photo2":require("images/photo1.jpg"),
            "photo3":require("images/photo3.jpg"),
            "photo4":require("images/photo4.jpg"),
            "photo5":require("images/photo5.jpg"),
            "photo6":require("images/photo6.jpg"),
            "photo7":require("images/photo7.jpg"),
            "photo8":require("images/photo8.jpg")
        }
        return(
            <section
                 key="rotateBox"
                 className={classNames("rotateBox",className)}
            >
                <ul className="category"
                    onClick={ (e)=> this.onRotateBoxClick(e,categoriesLength)}
                    onTouchStart={(e)=> this.onRotateBoxClick(e,categoriesLength)}
                    style={styles}
                 >
                    {
                        categories.map((v,i)=>{

                            const {name,title,content} =v
                            const src = photoConfig[name]  || require("images/photo1.jpg")
                            const styles = {
                                width,
                                height,
                                "transform":`rotateY(${360/categoriesLength * i}deg) translateZ(${r}px)`,
                                "backgroundImage":`url(${src})`
                            }
                            return (
                                <li 
                                    className="item"
                                    data-id={i}
                                    alt="category"
                                    key={`category${i}`}
                                    style={styles}
                                >
                                    <div className="photo-cover">
                                        <h4 key="photo-title" className="cover-title">{title}</h4>
                                        <p key="photo-content" className="cover-content">{content}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        )
    }
    componentWillMount(){
        const isFirst= sessionStorage.getItem('welcome') || "yes"
        this.setState({
            "delay": isFirst ==="yes" ? "5s" :"0s" 
        })
    }
    componentDidMount(){
        console.log(`RotatePhoto Component loaded`);
    }
}
