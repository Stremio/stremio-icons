const fs = require('fs');
const path = require('path');
const { xml2js } = require('xml-js');
const parseSVGPath = require('parse-svg-path');
const svgpath = require('svgpath');
const { optimize } = require('svgo');
const { toSVGFile } = require('./utils');
const buildSolid = require('./buildSolid');
const buildReact = require('./buildReact');
const buildReactNative = require('./buildReactNative');
const buildAndroid = require('./buildAndroid');
const buildDocs = require('./buildDocs');
const buildAngularJS = require('./buildAngularJS');

const findSVGElement = (object, options) => {
    if ((options.id && object?.attributes?.id === options.id) || (options.name && object?.name === options.name)) {
        return object;
    } else {
        if (object.elements) {
            for (const element of object.elements) {
                const found = findSVGElement(element, options);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
}

const SVGBuffer = fs.readFileSync(path.join(process.cwd(), 'stremio-icons.svg'));
const { data: optimizedSVG } = optimize(SVGBuffer, {
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    cleanupIds: false,
                    moveElemsAttrsToGroup: false,
                    moveGroupAttrsToElems: false,
                },
            },
        },
    ],
});

const parsedSVG = xml2js(optimizedSVG);
const stremioIcons = findSVGElement(parsedSVG, { id: 'stremio-icons' });

const ICON_SIZE = 512;

const icons = stremioIcons.elements.filter(({ name }) => name === 'g').map((icon) => {
    const iconOuter = icon.elements.find(({ name }) => name === 'path');
    const iconInner = icon.elements.find(({ name }) => name === 'g');

    const iconInnerTransform = iconInner.attributes['transform'] || '';

    const [[, x, y]] = parseSVGPath(iconOuter.attributes.d);
    const iconOuterOffset = {
        x: -(x - ICON_SIZE),
        y: -y,
    };

    const viewBox = `0 0 ${ICON_SIZE} ${ICON_SIZE}`;

    const paths = iconInner.elements.map(({ attributes }) => {
        const ignoreAttributes = ['id', 'data-name', 'd', 'transform'];
        const styles = Object.fromEntries(Object.entries(attributes).filter(([key]) => !ignoreAttributes.includes(key)));
        if (styles['fill']) {
            styles['fill'] = 'currentcolor';
        }
        if (styles['stroke']) {
            styles['stroke'] = 'currentcolor';
            styles['fill'] = 'none';
        }

        const iconTransform = attributes['transform'] || '';

        const d = svgpath(attributes.d)
            .transform(iconInnerTransform)
            .transform(iconTransform)
            .translate(iconOuterOffset.x, iconOuterOffset.y)
            .toString();

        return {
            d,
            styles
        };
    });

    const svg = toSVGFile(viewBox, paths);
    const { data } = optimize(svg);
    const parsedSVG = xml2js(data);
    const root = findSVGElement(parsedSVG, { name: 'svg' });
    const optimizedPaths = root.elements.map(({ attributes }) => {
        const { d, style } = attributes;
        const styles = style ? Object.fromEntries(style.split(';').map((s) => s.split(':'))) : {};
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
        paths: optimizedPaths,
    }
});

if (process.argv.includes('all') || process.argv.includes('solid')) {
    buildSolid(icons);
}

if (process.argv.includes('all') || process.argv.includes('react')) {
    buildReact(icons);
}

if (process.argv.includes('all') || process.argv.includes('react-native')) {
    buildReactNative(icons);
}

if (process.argv.includes('all') || process.argv.includes('android')) {
    buildAndroid(icons);
}

if (process.argv.includes('all') || process.argv.includes('docs')) {
    buildDocs(icons);
}

if (process.argv.includes('all') || process.argv.includes('json')) {
    buildAngularJS(icons);
}
