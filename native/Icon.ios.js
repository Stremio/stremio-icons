import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import icons from './png';

class Icon extends PureComponent {
    render() {
        const { style, icon, color } = this.props;
        return (
            <Image
                style={[style, { tintColor: color }]}
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
