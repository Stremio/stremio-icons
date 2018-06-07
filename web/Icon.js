import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import icons from './icons';

class Icon extends PureComponent {
    render() {
        return (
            <svg viewBox={icons[this.props.icon].viewBox}
                style={this.props.style}
                className={this.props.className}
                width={this.props.width}
                height={this.props.height}
                fill={this.props.fill}>
                {icons[this.props.icon].paths.map((path, index) => (
                    <path key={index} d={path} />
                ))}
            </svg>
        );
    }
}

Icon.propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons)).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string
};

export default Icon;
