const fs = require('fs');
const path = require('path');
const { toPngFiles, toDrawableFiles } = require('./utils');

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
        const drawableFiles = await toDrawableFiles(icons);
        drawableFiles.forEach(({ filename, buffer }) => {
            fs.writeFileSync(path.join(androidResourcesPath, filename), buffer)
        });
    })();
};

module.exports = buildReactNative;