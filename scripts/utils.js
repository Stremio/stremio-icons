const { paramCase } = require('change-case');
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
            name,
            buffer: pngBuffer
        };
    }));
};

module.exports = {
    toPngFiles
};