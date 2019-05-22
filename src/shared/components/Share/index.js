import React from "react"
import "social-share.js/dist/js/social-share.min.js"
import "social-share.js/dist/css/share.min.css"

import {host} from "../../../../config"

export default class Share extends React.PureComponent{
    static defaultProps = {
        sites:["weibo,qq,qzone,tencent,wechat,douban,facebook,twitter,google"],
        mobileSites:["weibo,qq,qzone,tencent,wechat,douban"],
        shareHost:false
    }
    render(){
        const {sites,mobileSites} = this.props
        return (
            <div id="social-share" className="social-share" data-mobile-sites={mobileSites.join(',')} data-sites={sites.join(',')}></div>
        )
    }
    componentDidMount(){
        const {shareHost} = this.props
        socialShare("#social-share",{
            url:shareHost ? host :  location.href,
            image:require('images/default.jpeg')
        })
    }
}