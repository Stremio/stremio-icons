const fs = require('fs');
const path = require('path');
const { xml2js } = require('xml-js');
const svgPath = require('svg-path');
const { parseSVG } = require('svg-path-parser');
const buildReact = require('./buildReact');
const buildReactNative = require('./buildReactNative');
const buildDocs = require('./buildDocs');

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

const svgIcons = fs.readFileSync(path.join(process.cwd(), 'stremio-icons.svg'));
const parsedSVG = xml2js(svgIcons);

const stremioIcons = findSVGElement(parsedSVG, 'stremio-icons');

const ICON_SIZE = 512;

const icons = stremioIcons.elements.filter(({ name }) => name === 'g').map((icon) => {
    const iconOuter = icon.elements.find(({ name }) => name === 'path');
    const iconInner = icon.elements.find(({ name }) => name === 'g');

    const pathCommands = parseSVG(iconOuter.attributes.d);
    const moveToCommand = pathCommands[0];
    const iconOuterOffset = {
        x: -(moveToCommand.x - ICON_SIZE),
        y: -moveToCommand.y,
    };

    const viewBox = `0 0 ${ICON_SIZE} ${ICON_SIZE}`;

    const paths = iconInner.elements.map(({ attributes }) => {
        const ignoreAttributes = ['id', 'd', 'fill', 'stroke'];
        const styles = Object.fromEntries(Object.entries(attributes).filter(([key]) => !ignoreAttributes.includes(key)));

        if (Object.keys(styles).some((key) => key === 'stroke-width')) {
            styles['fill'] = 'none';
        }

        const path = svgPath(attributes.d);
        path.translate(iconOuterOffset.x, iconOuterOffset.y);
        const d = path.toString();

        return {
            d,
            styles
        };
    });

    return {
        name: icon.attributes.id,
        width: ICON_SIZE,
        height: ICON_SIZE,
        viewBox,
        paths,
    }
});

if (process.argv.includes('all') || process.argv.includes('react')) {
    buildReact(icons);
}

if (process.argv.includes('all') || process.argv.includes('react-native')) {
    buildReactNative(icons);
}

if (process.argv.includes('all') || process.argv.includes('docs')) {
    buildDocs(icons);
}
