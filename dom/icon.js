import React from 'react';
import PropTypes from 'prop-types';
import icons from './icons';

const Icon = React.forwardRef((props, ref) => (
    <svg
        {...props}
        ref={ref}
        viewBox={icons[props.icon].viewBox}
        children={icons[props.icon].paths.map((path, index) => (
            <path key={index} d={path} />
        ))}
    />
));

Icon.propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons)).isRequired
};

export default Icon;
