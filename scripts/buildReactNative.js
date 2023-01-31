const fs = require('fs');
const path = require('path');
const { snakeCase } = require('change-case');
const { toPngFiles } = require('./utils');

const toDrawable = (icon) => {
    return Buffer.from([
        '<?xml version="1.0" encoding="utf-8"?>',
        '<vector xmlns:android="http://schemas.android.com/apk/res/android"',
        `\tandroid:width="${(icon.width || icon.height) / 20}dp"`,
        `\tandroid:height="${icon.height / 20}dp"`,
        `\tandroid:viewportWidth="${icon.width || icon.height}"`,
        `\tandroid:viewportHeight="${icon.height}">`,
            icon.paths.map(({ d }) => [
                '\t<path',
                '\t\tandroid:fillColor="#ffffffff"',
                `\t\tandroid:pathData="${d}" />`
            ].join('\n')).join('\n'),
        '</vector>'
    ].join('\n'));
};

const buildReactNative = (icons) => {
    (async () => {
        const reactNativePath = path.join(process.cwd(), 'react-native');
        const iosResourcesPath = path.join(reactNativePath, 'ios', 'png');
        const androidResourcesPath = path.join(reactNativePath, 'android', 'src', 'main', 'res', 'drawable');

        fs.mkdirSync(iosResourcesPath, { recursive: true });
        fs.mkdirSync(androidResourcesPath, { recursive: true });

        // iOS
        const pngFiles = await toPngFiles(icons, 64);
        pngFiles.forEach(({ name, buffer }) => {
            fs.writeFileSync(path.join(iosResourcesPath, `${name}.png`), buffer);
        });

        const pngFilesJSIndex = [
            'module.exports = {',
                pngFiles.map(({ name }) => `['${name}']: require('./${name}.png')`).join(',\n'),
            '};'
        ].join('\n');

        fs.writeFileSync(path.join(iosResourcesPath, 'index.js'), pngFilesJSIndex);

        // Android
        icons.forEach((icon) => {
            const drawable = toDrawable(icon);
            fs.writeFileSync(path.join(androidResourcesPath, `${snakeCase(icon.name)}.xml`), drawable)
        });
    })();
};

module.exports = buildReactNative;