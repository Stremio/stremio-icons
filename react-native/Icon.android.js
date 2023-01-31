import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, requireNativeComponent } from 'react-native';
import { snakeCase } from 'change-case';

class Icon extends PureComponent {
    render() {
        const { style, icon, color } = this.props;

        return (
            <RCTIcon
                style={style}
                icon={snakeCase(icon)}
                color={color}
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
