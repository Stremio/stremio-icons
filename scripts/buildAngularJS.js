const fs = require('fs');
const path = require('path');
const { removeFiles, toJSONFile, toInlineStyle } = require('./utils');

const buildAngularJS = async (icons) => {
    const JSONIconsPath = path.join(process.cwd(), 'angularjs', 'src', 'icons.json');
    await removeFiles(JSONIconsPath);

    const JSONIcons = toJSONFile(icons, toInlineStyle);
    fs.writeFileSync(JSONIconsPath, JSON.stringify(JSONIcons));
};

module.exports = buildAngularJS;