const React = require('react');
const PropTypes = require('prop-types');
const icons = require('./icons');

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

Icon.icons = icons;
Icon.dataUrl = ({ icon, width, height, fill = 'white' } = {}) => `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icons[icon].viewBox}" width="${width}" height="${height}" fill="${fill}">${icons[icon].paths.map(path => `<path d="${path}" />`).join('')}</svg>`;
Icon.displayName = 'Icon';
Icon.propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons)).isRequired
};

module.exports = Icon;
