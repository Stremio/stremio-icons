var React = require('react');
var PropTypes = require('prop-types');
var icons = require('./icons.json');

var Icon = React.forwardRef(function(props, ref) {
    var icon = icons[props.name];
    if (!icon) {
        return null;
    }

    return React.createElement('svg', Object.assign({ viewBox: icon.viewBox }, props, { ref: ref }),
        icon.paths.map(function(path, index) {
            return React.createElement('path', { key: index, d: path.d, style: path.style });
        })
    );
});

Icon.displayName = 'Icon';
Icon.propTypes = {
    icon: PropTypes.oneOf(Object.keys(icons))
};

module.exports = Icon;
