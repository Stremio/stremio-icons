import React from 'react';
import PropTypes from 'prop-types';
import icons from './icons';

const Icon = React.forwardRef((props, ref) => (
    <svg
        viewBox={icons[props.icon].viewBox}
        {...props}
        ref={ref}
        children={icons[props.icon].paths.map((path, index) => (
            <path key={index} d={path} />
        ))}
    />
));

Icon.displayName = 'Icon';
Icon.propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons)).isRequired
};

export default Icon;
