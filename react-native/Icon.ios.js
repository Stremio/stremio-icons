import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import icons from './ios/png';

const styles = StyleSheet.create({
    icon: {
        width: undefined,
        height: undefined
    }
});

class Icon extends PureComponent {
    render() {
        const { style, name, color } = this.props;
        const tintColor = typeof color === 'string' ? 
            `#${color.slice(3, 10)}${color.slice(1, 3)}`
            :
            null;
        return (
            <Image
                style={[styles.icon, style, { tintColor }]}
                source={icons[name]}
                resizeMode={'contain'}
            />
        );
    }
}

Icon.propTypes = {
    ...View.propTypes,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};
Icon.defaultProps = {
    color: '#ccffffff'
};

export default Icon;
