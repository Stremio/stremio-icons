const fs = require('fs');
const path = require('path');
const { toSVGFiles, removeDir } = require('./utils');

const buildKMM = async (icons) => {
    const kmmSVGPath = path.join(process.cwd(), 'android', 'src', 'commonMain', 'resources', 'MR', 'images');
    removeDir(kmmSVGPath);
    fs.mkdirSync(kmmSVGPath, { recursive: true });

    const svgFiles = await toSVGFiles(icons);
    svgFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(kmmSVGPath, filename.replaceAll('-', '_')), buffer)
    });
};

module.exports = buildKMM;