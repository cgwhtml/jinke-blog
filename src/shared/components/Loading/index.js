/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:41:42 
 * @Last Modified by:   jinke.li 
 * @Last Modified time: 2017-07-17 19:41:42 
 */
import React from 'react'
import PropTypes from "prop-types"
import "./styles.less"

export default class Loading extends React.PureComponent {
    static defaultProps = {
        time:6
    }
    render(){
        const {isLoading,time} = this.props
        const animationDuration = {
            "animationDuration":`${time}s`
        }
        return(
            <div>
            {
                isLoading 
                ? <div key="loading" className="lijinke-web-loading">
                    <div className="loading-content">
                    <svg>
                        <path
                        style={animationDuration}
                        d="M50 50
                                L50 50
                                A15 2 0 1 0 110 30
                                L105 100
                                v -50
                                L 70 85
                                L141 70
                                L104 120
                                v 100
                                A 1 2 0 0 1 69 204
                                L31 167
                                L196 127">
                        </path>
                        <path 
                            style={animationDuration}
                            d="M300 50
                            L 210 136
                            M257 89
                            L 370 126
                            M 245 155
                            h 70
                            M 245 175
                            h 70
                            M 275 155
                            v 90
                            M 257 232
                            L 228 213
                            M 320 200
                            l 50 -30
                            M 205 245
                            h 160">
                        </path>
                        <path 
                        style={animationDuration}
                        d="M380 50
                            h 90
                            h -45
                            v 70
                            h -50
                            h 100
                            h -50
                            v 80
                            L 280 263
                            L 532 157
                            A 4 3 0 0 1 666 56
                            L 580 130
                            v 30
                            h 30
                            v -25
                            h -30
                            h 30
                            v 150
                            L 545 222">
                        </path>
                    </svg>
                    </div>
                </div>
                : undefined
            }
            </div>
        )
    }
}
