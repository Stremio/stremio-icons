const { paramCase, camelCase, snakeCase } = require('change-case');
const sharp = require('sharp');

const toPngFiles = (icons, size) => {
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

    return Promise.all(icons.map(async ({ name, viewBox, paths }) => {
        const svgBuffer = Buffer.from(toSVGFile(viewBox, paths));
        const pngBuffer = await sharp(svgBuffer).png().resize(size, size).toBuffer();
        return {
            filename: `${name}.png`,
            buffer: pngBuffer
        };
    }));
};

const toDrawableFiles = (icons) => {
    const toDrawableStyle = (styles = {}) => {
        const ignoreProperties = ['fill', 'clip-rule'];
        const renameProperties = {
            'stroke-linejoin': 'stroke-line-join',
            'stroke-linecap': 'stroke-line-cap',
            'stroke-miterlimit': 'stroke-miter-limit',
            'fill-rule': 'fill-type',
        };
        const renameValues = {
            'evenodd': 'evenOdd',
        };

        const style = Object.entries(styles)
            .filter((([key]) => !ignoreProperties.includes(key)))
            .map((([key, value]) => [renameProperties[key] ?? key, value]))
            .map((([key, value]) => [key, renameValues[value] ?? value]))
            .map((([key, value]) => [camelCase(key), value]));

        if (style.find(([key]) => key.startsWith('stroke'))) {
            style.push([['strokeColor'], ['#FFFFFFFF']]);
        } else {
            style.push([['fillColor'], ['#FFFFFFFF']]);
        }
            
        return style.map(([key, value]) => `android:${key}="${value}"`);
    };

    return icons.map((icon) => {
        const paths = icon.paths.map(({ d, styles }) => {
            const style = toDrawableStyle(styles)
                .map((value) => `\t\t${value}`)
                .join('\n');
            return [
                '\t<path',
                style,
                `\t\tandroid:pathData="${d}" />`
            ].join('\n')
        }).join('\n');

        const buffer =  Buffer.from([
            '<?xml version="1.0" encoding="utf-8"?>',
            '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
            `\tandroid:width="${(icon.width || icon.height) / 20}dp"`,
            `\tandroid:height="${icon.height / 20}dp"`,
            `\tandroid:viewportWidth="${icon.width || icon.height}"`,
            `\tandroid:viewportHeight="${icon.height}">`,
                paths,
            '</vector>'
        ].join('\n'));

        return {
            filename: `${snakeCase(icon.name)}.xml`,
            buffer
        };
    });
};

module.exports = {
    toPngFiles,
    toDrawableFiles
};