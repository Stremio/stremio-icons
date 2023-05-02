const icons = require('./icons.json');

angular.module('stremio').directive('icon', function() {
    return {
        link: function(_scope, element, attrs) {
            const icon = icons[attrs.icon];
            const svgElement = document.createElement('svg');

            for (var path of icon.paths) {
                const pathElement = document.createElement('path');
                pathElement.setAttribute('d', path.d);
                pathElement.setAttribute('style', path.style);
                svgElement.appendChild(pathElement);
            }

            element.context.innerHTML = svgElement.innerHTML;
            element.context.setAttribute('viewBox', icon.viewBox);
        }
    };
});