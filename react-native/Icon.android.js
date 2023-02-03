import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, requireNativeComponent } from 'react-native';
import { snakeCase } from 'change-case';
import { colord } from 'colord';

const toHex = (n) => parseInt(n).toString(16).toUpperCase();

const toArgbHex = (color) => {
    const { a, r, g, b } = colord(color).rgba;
    return `#${toHex(a * 255)}${toHex(r)}${toHex(g)}${toHex(b)}`;
};

class Icon extends PureComponent {
    render() {
        const { style, name, size, color } = this.props;

        return (
            <RCTIcon
                style={[style, size ? { height: size, width: size } : {}]}
                icon={snakeCase(name)}
                color={toArgbHex(color)}
            />
        );
    }
}

Icon.propTypes = {
    ...View.propTypes,
    name: PropTypes.string.isRequired,
    size: PropTypes.string,
    color: PropTypes.string.isRequired
};
Icon.defaultProps = {
    color: '#ccffffff',
};

const RCTIconInterface = {
    name: 'Icon',
    propTypes: {
        ...View.propTypes,
        icon: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    }
};

const RCTIcon = requireNativeComponent('RCTIconView', RCTIconInterface);

export default Icon;
