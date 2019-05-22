/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:41:47 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-05-23 14:47:17
 */
import React,{PureComponent} from "react"
import {browserHistory} from "react-router"
import PropTypes from "prop-types"
import "./styles.less"

export default class Header extends PureComponent{
    static defaultProps= {
        title :"李金珂的小屋"
    }
    static propTypes = {
        title:PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ])
    }
    state = {
        showBack:false
    }
    render(){
        const {animateTime,title} = this.props
        const isPhotoTitle = title.startsWith('http')
        const animationDuration = {
            "animationDuration":`${animateTime}s`
        }
        const {showBack} = this.state
        return(
            <header key="header" className="header" style={animationDuration}>
                {
                    showBack
                    ?  <div key="left" className="block left" onClick={this.goBack}>
                        <i className="icon icon-fanhui"></i>
                    </div>
                    : undefined
                }
                <div key="center" className="center" title="鼠标点击一下就可以返回~">
                    <h2 key="title" className="title" onClick={this.goBack}>
                        {
                            isPhotoTitle
                            ? <img src={title}/>
                            : title
                        }
                    </h2>
                </div>
                {
                    showBack
                    ? <div key="right" className="block right"></div>
                    : undefined
                }
            </header>    
        )
    }
    componentDidMount(){
        if(history.length>1){
            this.setState({showBack:true})
        }
    }
    goBack = ( url )=>{
        if(history.length>1){
            this.setState({
                showBack:true
            })
            history.back()
        }else{
            if(typeof url =="undefined" || !url){
                url = "/"
            }
            browserHistory.push('/')
        }
    }
}