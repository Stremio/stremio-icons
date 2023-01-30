const fs = require('fs');
const path = require('path');
const { xml2js } = require('xml-js');
const svgPath = require('svg-path');
const { camelCase } = require('change-case');

const findSVGElement = (object, id) => {
    if (object?.attributes?.id === id) {
        return object;
    } else {
        if (object.elements) {
            for (const element of object.elements) {
                const found = findSVGElement(element, id);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
}

const getStyleFromAttributes = (attributes) => {
    const strokeAttribtutes = ['stroke-width', 'stroke-miterlimit', 'stroke-linejoin', 'stroke-linecap'];
    const style = Object.fromEntries(Object.entries(attributes)
        .filter(([key]) => strokeAttribtutes.includes(key))
        .map(([key, value]) => [camelCase(key), value]));

    if (Object.keys(style).find((key) => key.startsWith('stroke'))) {
        style['fill'] = 'none';
    }

    return style;
};

const svgIcons = fs.readFileSync(path.join(__dirname, 'stremio-icons.svg'));
const parsedSVG = xml2js(svgIcons);

const stremioIcons = findSVGElement(parsedSVG, 'stremio-icons');
const icons = Object.fromEntries(stremioIcons.elements.filter(({ name }) => name === 'g').map((icon) => {
    const iconOuter = icon.elements.find(({ name }) => name === 'rect');
    const iconInner = icon.elements.find(({ name }) => name !== 'rect');

    const viewBox = `0 0 ${iconOuter.attributes.width} ${iconOuter.attributes.height}`;
    const paths = iconInner.elements.map(({ attributes }) => {
        const style = getStyleFromAttributes(attributes);

        const path = svgPath(attributes.d);
        path.translate(-iconOuter.attributes.x | 0, -iconOuter.attributes.y | 0);
        const d = path.toString();

        return {
            d,
            style
        };
    });

    return [
        icon.attributes.id,
        {
            viewBox,
            paths
        }
    ];
}));

fs.writeFileSync('dom/icons.json', JSON.stringify(icons));
