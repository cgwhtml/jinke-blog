/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:41:57 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-08-10 23:05:43
 */
import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import classNames from "classnames"
import "./styles.less"

export default class Button extends React.PureComponent {
    static defaultProps = {
        type: "default",
        htmlType: "button"
    }
    static propTypes = {
        type: PropTypes.oneOf(['','primary', 'default', 'warning', 'success', 'error','info','disabled'])
    }
    render() {
        const { children, type, className, htmlType,onClick,...attr } = this.props
        const Type = ( btnType )=>{
            return type.indexOf(btnType) != -1
        }

        const isDisabled = Type('disabled') ? { disabled :true} :{}
        
        return (
            <button
                {...attr}
                type={htmlType}
                onClick={onClick}
                {...isDisabled}
                className={
                    classNames(
                        'jinke-btn',
                        'btn',
                        { 'btn-primary': Type("primary") },
                        { 'btn-warning': Type("warning") },
                        { 'btn-success': Type("success") },
                        { 'btn-error': Type("error") },
                        { 'btn-default': Type("default") },
                        { 'btn-disabled': Type("disabled") },
                        { 'btn-info': Type("info") },
                        { 'btn-block': Type("block")},
                        className
                    )
                }
            >
                <span>{children}</span>
            </button>
        )
    }
}