/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:41:57 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-08-10 23:05:42
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import "./styles.less"

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop)
        document.body.scrollTop = c - c /8
    }
}

export default class BackTop extends React.PureComponent {
    state = {
        isShow: false
    }
    constructor(props) {
        super(props)
        this.offset = 400
    }
    render() {
        const { isShow } = this.state
        const { className, style } = this.props
        return (
            <div
                className={classNames(
                    "jinke-back-top",
                    { "open": isShow },
                    { "close": !isShow },
                    className
                )}
            >
                <div className="jinke-back-top-inner">
                    <button type="button" onClick={scrollToTop}><i className="icon icon-fanhui"></i></button>
                </div>
            </div>
        )
    }
    bindScroll = () => {
        if (window.onscroll) {
            window.onscroll()
        } else {
            const c = document.documentElement.scrollTop || document.body.scrollTop
            if (c >= this.offset) {
                this.setState({ isShow: true })
            } else {
                this.setState({ isShow: false })
            }
        }

    }
    componentDidMount() {
        document.body.addEventListener('scroll', this.bindScroll)
    }
    componentWillUnmount() {
        document.body.removeEventListener('scroll', this.bindScroll)
    }
}