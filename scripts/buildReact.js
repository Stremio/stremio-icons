const fs = require('fs');
const path = require('path');
const { camelCase } = require('change-case');
const { removeFiles, toJSONFile } = require('./utils');

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

const buildReact = async (icons) => {
    const jsonIconsPath = path.join(process.cwd(), 'react', 'src', 'icons.json');
    await removeFiles(jsonIconsPath);

    const JSONIcons = toJSONFile(icons, toReactStyle);
    fs.writeFileSync(jsonIconsPath, JSON.stringify(JSONIcons));
};

module.exports = buildReact;