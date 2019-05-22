import React from 'react';
import PropTypes from "prop-types"
import LazyLoad from 'react-lazy-load';
import LegitImage from 'legit-image';

const getProps = ({src, alt, title}) => ({
    src: `https://rexxars.github.io/react-layout-pack/img/${src}`,
    alt: alt.replace(/\(\d+\)$/, ''),
    title: title,
    height: alt.replace(/.*\((\d+)\)$/, '$1') | 0
});

export default class ImageRender extends React.PureComponent{
    static displayName= 'ImageLoader'
    static propTypes =  {
        src: PropTypes.string,
        title: PropTypes.string,
        alt: PropTypes.string
    }

    render() {
        const {src, alt=null, title=null, height} = this.props
        return (
            <div className="image-wrapper">
                <div className="description">{title}</div>

                <LazyLoad height={height || null}>
                    <LegitImage src={src} alt={alt} />
                </LazyLoad>
            </div>
        );
    }
}

