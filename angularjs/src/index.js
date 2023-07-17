const icons = require('./icons.json');

angular.module('stremio').directive('icon', () => ({
    restrict: 'A',
    link: (scope, element) => {
        const updateIcon = (name) => {
            const icon = icons[name];
            if (icon) {
                const svgElement = document.createElement('svg');

                icon.paths.forEach((path) => {
                    const pathElement = document.createElement('path');
                    pathElement.setAttribute('d', path.d);
                    pathElement.setAttribute('style', path.style);
                    svgElement.appendChild(pathElement);
                });

                element.context.innerHTML = svgElement.innerHTML;
                element.context.setAttribute('viewBox', icon.viewBox);
            }
        };
        
        scope.$watch(() => element.attr('icon'), updateIcon);
    }
}));