const fs = require('fs');
const path = require('path');
const { toDrawableFiles, toSVGFiles, removeDir } = require('./utils');

const buildAndroid = (icons) => {
    const androidDrawablePath = path.join(process.cwd(), 'android', 'src', 'androidMain', 'res', 'drawable');
    removeDir(androidDrawablePath);
    fs.mkdirSync(androidDrawablePath, { recursive: true });

    const drawableFiles = toDrawableFiles(icons);
    drawableFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(androidDrawablePath, filename), buffer)
    });

    const kmmSVGPath = path.join(process.cwd(), 'android', 'src', 'commonMain', 'resources', 'MR', 'images');
    removeDir(kmmSVGPath);
    fs.mkdirSync(kmmSVGPath, { recursive: true });

    const svgFiles = toSVGFiles(icons);
    svgFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(kmmSVGPath, filename.replace(/-/g, '_')), buffer)
    });
};

module.exports = buildAndroid;