const fs = require('fs');
const path = require('path');
const { xml2js } = require('xml-js');
const svgPath = require('svg-path');
const { camelCase, paramCase } = require('change-case');
const sharp = require('sharp');

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

const svgIcons = fs.readFileSync(path.join(__dirname, 'stremio-icons.svg'));
const parsedSVG = xml2js(svgIcons);

const stremioIcons = findSVGElement(parsedSVG, 'stremio-icons');

const icons = stremioIcons.elements.filter(({ name }) => name === 'g').map((icon) => {
    const iconOuter = icon.elements.find(({ name }) => name === 'rect');
    const iconInner = icon.elements.find(({ name }) => name !== 'rect');

    const viewBox = `0 0 ${iconOuter.attributes.width} ${iconOuter.attributes.height}`;
    const paths = iconInner.elements.map(({ attributes }) => {
        const ignoreAttributes = ['id', 'd', 'fill', 'stroke'];
        const styles = Object.fromEntries(Object.entries(attributes).filter(([key]) => !ignoreAttributes.includes(key)));

        if (Object.keys(styles).some((key) => key === 'stroke-width')) {
            styles['fill'] = 'none';
        }

        const path = svgPath(attributes.d);
        path.translate(-iconOuter.attributes.x | 0, -iconOuter.attributes.y | 0);
        const d = path.toString();

        return {
            d,
            styles
        };
    });

    return {
        name: icon.attributes.id,
        viewBox,
        paths,
    }
});

if (process.argv.includes('all') || process.argv.includes('dom')) {
    const styleAttribtutes = ['stroke-width', 'stroke-miterlimit', 'stroke-linejoin', 'stroke-linecap', 'fill'];

    const toReactStyle = (styles) => {
        return Object.fromEntries(Object.entries(styles)
            .filter(([key]) => styleAttribtutes.includes(key))
            .map(([key, value]) => [camelCase(key), value]));
    }

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

    fs.writeFileSync('dom/icons.json', JSON.stringify(JSONIcons));
}

if (process.argv.includes('all') || process.argv.includes('docs')) {
    const toInlineBlackStyle = (style) => {
        const styleEntries = Object.entries(style);
        if (styleEntries.some(([key]) => key === 'stroke-width')) {
            styleEntries.push(['stroke', '#000000']);
        }

        return styleEntries
            .map(([key, value]) => `${paramCase(key)}:${value}`)
            .join(';');
    };

    const toSVGFile = (viewBox, paths) => {
        const svgPaths = paths
            .map(({ d, styles }) => `<path d="${d}" style="${toInlineBlackStyle(styles)}" />`)
            .join('');
        return `<svg viewBox="${viewBox}">${svgPaths}</svg>`;
    };

    (async () => {
        const pngFiles = await Promise.all(icons.map(async ({ name, viewBox, paths }) => {
            const svgBuffer = Buffer.from(toSVGFile(viewBox, paths));
            const pngBuffer = await sharp(svgBuffer).png().resize(32, 32).toBuffer();
            return {
                name,
                buffer: pngBuffer
            };
        }));
        
        pngFiles.forEach(({ name, buffer }) => {
            fs.writeFileSync(path.join(__dirname, 'docs', `${name}.png`), buffer);
        });
    })();

    const markdownIndex = `---
layout: default
title: Stremio Icons
---
|preview|name|
|:---:|:---:|\n`
        +
        icons.map(({ name }) => `|![${name}](${name}.png)|${name}|`).join('\n');

    fs.writeFileSync('docs/index.md', markdownIndex);
}
