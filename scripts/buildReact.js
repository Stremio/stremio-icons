const fs = require('fs');
const path = require('path');
const { camelCase } = require('change-case');

const STYLE_ATTRIBUTES = [
    'stroke-width',
    'stroke-miterlimit',
    'stroke-linejoin',
    'stroke-linecap',
    'fill',
    'fill-rule',
    'clip-rule'
];

const toReactStyle = (styles) => {
    return Object.fromEntries(Object.entries(styles)
        .filter(([key]) => STYLE_ATTRIBUTES.includes(key))
        .map(([key, value]) => [camelCase(key), value]));
};

const buildReact = (icons) => {
    const JSONIcons = Object.fromEntries(icons.map(({ name, viewBox, paths }) => {
        const reactPaths = paths.map(({ d, styles }) => ({
            d,
            style: toReactStyle(styles)
        }));
        
        return [
            name,
            {
                viewBox,
                paths: reactPaths
            }
        ]
    }));

    fs.writeFileSync(path.join(process.cwd(), 'react', 'icons.json'), JSON.stringify(JSONIcons));
};

module.exports = buildReact;