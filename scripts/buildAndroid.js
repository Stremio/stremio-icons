const fs = require('fs');
const path = require('path');
const { toDrawableFiles, removeDir } = require('./utils');

const buildAndroid = (icons) => {
    const androidDrawablePath = path.join(process.cwd(), 'android', 'src', 'androidMain', 'res', 'drawable');
    removeDir(androidDrawablePath);
    fs.mkdirSync(androidDrawablePath, { recursive: true });

    const drawableFiles = toDrawableFiles(icons);
    drawableFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(androidDrawablePath, filename), buffer)
    });
};

module.exports = buildAndroid;