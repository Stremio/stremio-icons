const fs = require('fs');
const path = require('path');
const { xml2js } = require('xml-js');
const { optimize } = require('svgo');
const buildSolid = require('./buildSolid');
const buildReact = require('./buildReact');
const buildAndroid = require('./buildAndroid');
const buildDocs = require('./buildDocs');

const ICONS_DIR = 'icons';

const parseStyles = (attributes) => {
    const styleAttribute = attributes['style'];
    if (styleAttribute) return Object.fromEntries(styleAttribute.split(';').map((attribute) => attribute.split(':')));

    const ignoreAttributes = ['id', 'data-name', 'd', 'transform'];
    return Object.fromEntries(Object.entries(attributes).filter(([key]) => !ignoreAttributes.includes(key)));
};

const parseViewBox = (attributes) => {
    const viewBox = attributes['viewBox'];

    const width = attributes['width'];
    const height = attributes['height'];
    
    return viewBox ?? `0 0 ${width} ${height}`;
};

const parseSize = (viewBox) => {
    const [,, width, height] = viewBox.split(' ');
    return [width, height];
};

const icons = fs.readdirSync(ICONS_DIR)
    .map((filename) => {
        const filepath = path.join(ICONS_DIR, filename);
        const buffer = fs.readFileSync(filepath);
        const { data } = optimize(buffer);
        const { elements } = xml2js(data);

        const container = elements.find(({ name }) => name === 'svg');
        const paths = container.elements.map(({ attributes }) => {
            const styles = parseStyles(attributes);

            if (styles['fill']) {
                styles['fill'] = 'currentcolor';
            }

            if (styles['stroke']) {
                styles['stroke'] = 'currentcolor';
                styles['fill'] = 'none';
            }

            return {
                d: attributes.d,
                styles,
            };
        });

        const name = filename.replace('.svg', '');
        const viewBox = parseViewBox(container.attributes);
        const [width, height] = parseSize(viewBox);

        return {
            name,
            width,
            height,
            viewBox,
            paths,
        };
    });

console.log(`${icons.length} icons processed`);

if (process.argv.includes('all') || process.argv.includes('solid')) {
    buildSolid(icons);
}

if (process.argv.includes('all') || process.argv.includes('react')) {
    buildReact(icons);
}

if (process.argv.includes('all') || process.argv.includes('android')) {
    buildAndroid(icons);
}

if (process.argv.includes('all') || process.argv.includes('docs')) {
    buildDocs(icons);
}

