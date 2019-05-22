import React from 'react'
import PropTypes from "prop-types"
import {Link} from 'react-router'

export default class LinkRenderer extends React.PureComponent{
    static displayName = 'LinkRenderer'
    static propTypes =  {
        children: PropTypes.node,
        href: PropTypes.string
    }

    render() {
        if (this.props.href.match(/^(https?:)?\/\//)) {
            return (
                <a href={this.props.href} target="_blank">
                    {this.props.children} <sup>☁</sup>
                </a>
            );
        }

        return <Link to={this.props.href}>{this.props.children}</Link>
    }
}


