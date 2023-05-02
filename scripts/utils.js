const fs = require('fs');
const path = require('path');
const { paramCase, camelCase, snakeCase } = require('change-case');
const sharp = require('sharp');
const glob = require('glob');

const toInlineStyle = (styles) => {
    return Object.entries(styles)
        .map(([key, value]) => `${paramCase(key)}:${value}`)
        .join(';');
};

const toSVGFile = (viewBox, paths) => {
    const svgPaths = paths
        .map(({ d, styles }) => `<path d="${d}" style="${toInlineStyle(styles)}" />`)
        .join('');
    return `<svg viewBox="${viewBox}">${svgPaths}</svg>`;
};

const toPngFiles = (icons, size) => {
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
    const toDrawableAttributes = (styles = {}) => {
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

        const attributes = Object.entries(styles)
            .filter((([key]) => !ignoreProperties.includes(key)))
            .map((([key, value]) => [renameProperties[key] ?? key, value]))
            .map((([key, value]) => [key, renameValues[value] ?? value]))
            .map((([key, value]) => [camelCase(key), value]));

        if (attributes.find(([key]) => key.startsWith('stroke'))) {
            attributes.push([['strokeColor'], ['#FFFFFFFF']]);
        } else {
            attributes.push([['fillColor'], ['#FFFFFFFF']]);
        }
            
        return attributes.map(([key, value]) => `android:${key}="${value}"`);
    };

    return icons.map((icon) => {
        const paths = icon.paths.map(({ d, styles }) => {
            const attributes = toDrawableAttributes(styles)
                .map((value) => `\t\t${value}`)
                .join('\n');
            return [
                '\t<path',
                attributes,
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

const toJSONFile = (icons, transform) => {
    return Object.fromEntries(icons.map(({ name, viewBox, paths }) => {
        const transformedPaths = paths.map(({ d, styles }) => ({
            d,
            style: transform ? transform(styles) : styles,
        }));

        return [
            name,
            {
                viewBox,
                paths: transformedPaths,
            }
        ]
    }));
};

const removeFiles = (cwd, pattern) => {
    return new Promise((resolve, reject) => {
        glob(pattern ? path.join(cwd, pattern) : cwd, (err, files) => {
            if (err) return reject(err);
            resolve(files.forEach((path) => fs.rmSync(path)));
        });
    });
};

const removeDir = (path) => {
    try {
        fs.rmSync(path, { recursive: true });
    } catch(_e) {}
};

module.exports = {
    toInlineStyle,
    toSVGFile,
    toPngFiles,
    toDrawableFiles,
    toJSONFile,
    removeFiles,
    removeDir
};