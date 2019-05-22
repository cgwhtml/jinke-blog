/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:42:04 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-01-21 17:23:41
 */
import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import classNames from "classnames"
import Button from "shared/components/Button"
import "./styles.less"

export default class Pagination extends React.PureComponent {
    defaultCurrentPage = "1"
    typeConfig = {
        prev: "prev",
        next: "next"
    }
    state = {
        current: "1"
    }
    static defaultProps = {
        current: "N/A",
        total: "N/A",
        locale: {
            prevText: "上一页",
            nextText: "下一页"
        }
    }
    static propTypes = {
        total: PropTypes.oneOfType([
            PropTypes.number.isRequired,
            PropTypes.string.isRequired
        ]),                                       //总数
        current: PropTypes.oneOfType([            //当前索引
            PropTypes.number.isRequired,
            PropTypes.string.isRequired
        ]), 
        locale: PropTypes.object,                //自定义按钮
        onChange: PropTypes.func                 //回调(type,current)
    }
    getPageList = (type) => {
        let { current } = this.props
        const { prev, next } = this.typeConfig
        type == prev ? --current : ++current,
        this.props.onChange(type,current)
        this.setState({
            current
        })
    }
    render() {
        const {
            total,
            locale: {
                prevText,
                nextText
            },
            onChange,
            className,
            ...attr
        } = this.props
        const { prev, next } = this.typeConfig
        const { current } = this.state

        return (
            <section
                className={
                    classNames("pagination-section", className)
                }
                {...attr}
            >
                {
                    current <= this.defaultCurrentPage
                        ? <Button type="disabled">{prevText}</Button>
                        : <Button type="primary" onClick={() => this.getPageList(prev)}>{prevText}</Button>
                }
                <span className="pages"><span className="pageIndex">{current}</span> / {total}</span>
                {
                    current >= total
                        ? <Button type="disabled">{nextText}</Button>
                        : <Button type="primary" onClick={() => this.getPageList(next)}>{nextText}</Button>
                }
            </section>
        )
    }
    componentDidMount() {
        this.setState({
            current: this.props.current
        })
    }
    componentWillReceiveProps({current}){
        this.setState({
            current
        })
    }
}