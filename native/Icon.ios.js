import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';
import icons from './png';

const styles = StyleSheet.create({
    icon: {
        width: undefined,
        height: undefined
    }
});

class Icon extends PureComponent {
    render() {
        const { style, icon, color } = this.props;
        const tintColor = typeof color === 'string' ? 
            `#${color.slice(3, 10)}${color.slice(1, 3)}`
            :
            null;
        return (
            <Image
                style={[styles.icon, style, { tintColor }]}
                source={icons[icon]}
                resizeMode={'contain'}
            />
        );
    }
}

Icon.propTypes = {
    ...View.propTypes,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};
Icon.defaultProps = {
    color: '#ccffffff'
};

export default Icon;
