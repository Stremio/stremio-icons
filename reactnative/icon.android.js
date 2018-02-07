import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, UIManager, requireNativeComponent } from 'react-native';

const RCTIconViewConstants = UIManager.RCTIconView.Constants;

class Icon extends PureComponent {
    render() {
        const { style, icon, color, scaleType } = this.props;

        return (
            <RCTIcon
                style={style}
                icon={icon}
                color={color}
                scaleType={scaleType}
            />
        );
    }
}

Icon.propTypes = {
    ...View.propTypes,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    scaleType: PropTypes.string
};
Icon.defaultProps = {
    color: '#ccffffff'
};
Icon.scaleType = { ...RCTIconViewConstants };

const RCTIconInterface = {
    name: 'Icon',
    propTypes: {
        ...View.propTypes,
        icon: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        scaleType: PropTypes.string
    }
};

const RCTIcon = requireNativeComponent('RCTIconView', RCTIconInterface);

export default Icon;
