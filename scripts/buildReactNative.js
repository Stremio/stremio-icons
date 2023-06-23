const fs = require('fs');
const path = require('path');
const { toPngFiles, toDrawableFiles, removeDir } = require('./utils');

const buildIOS = async (cwd, icons) => {
    const iosResourcesPath = path.join(cwd, 'ios', 'png');
    removeDir(iosResourcesPath);
    fs.mkdirSync(iosResourcesPath, { recursive: true });

    const pngFiles = await toPngFiles(icons, 64);
    pngFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(iosResourcesPath, filename), buffer);
    });

    const pngFilesJSIndex = [
        'module.exports = {',
            pngFiles.map(({ name }) => `['${name}']: require('./${name}.png')`).join(',\n'),
        '};'
    ].join('\n');

    fs.writeFileSync(path.join(iosResourcesPath, 'index.js'), pngFilesJSIndex);
};

const buildAndroid = async (cwd, icons) => {
    const androidResourcesPath = path.join(cwd, 'android', 'src', 'main', 'res', 'drawable');
    removeDir(androidResourcesPath);
    fs.mkdirSync(androidResourcesPath, { recursive: true });
    
    const drawableFiles = await toDrawableFiles(icons);
    drawableFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(androidResourcesPath, filename), buffer)
    });
};

const buildReactNative = (icons) => {
    (async () => {
        const reactNativePath = path.join(process.cwd(), 'react-native');
        await buildIOS(reactNativePath, icons)
        await buildAndroid(reactNativePath, icons);
    })();
};

module.exports = buildReactNative;