import React from 'react'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Container from "shared/components/Container"
import { Link } from "react-router"
import cls from "classnames"

import "./styles.less"

@connect(
  ({ RootAction }) => ({
    showHome:RootAction.showHome
  })
)

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { musicData,showHome } = this.props
    const featureConfig = [{
      title:"聊天室",
      text:"蜀汉路东",
      iconName:"icon-liaotian",
      href:"/talk"
    },{
      title:"照片墙",
      text:"太升南路",
      iconName:"icon-zhaopian-copy",
      href:"/photo"
    },{
      title:"杂文集",
      text:"清江西路",
      iconName:"icon-luyinshuohuashengyin",
      href:"/article"
    },{
      title:"关于我",
      text:"金科北路",
      iconName:"icon-2guanyuwomeneps",
      href:"/about"
    }]
    return (
      <div key="home">
        <main className="content" key="content">
          <div className="feature">
            <ul key="home-feature" className={cls("feature-list")}>
              {
                featureConfig.map((item,i)=>{
                  const {title,text,iconName,href} = item
                  return (
                    <li key={`item${i}`} className="item">
                      <div className="info">
                        <h2 className="title">{title}</h2>
                        <p className="text">{text}</p>
                      </div>
                      <span className="line"></span>
                      <div className="icon-content">
                        <i className={cls("icon",iconName)}></i>
                      </div>
                      <Link to={href}></Link>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </main>
      </div>
    )
  }
}
