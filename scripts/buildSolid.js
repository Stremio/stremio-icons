const fs = require('fs');
const path = require('path');
const { removeFiles, toJSONFile } = require('./utils');

const buildSolid = async (icons) => {
    const jsonIconsPath = path.join(process.cwd(), 'solid', 'src', 'icons.json');
    await removeFiles(jsonIconsPath);

    const JSONIcons = toJSONFile(icons);
    fs.writeFileSync(jsonIconsPath, JSON.stringify(JSONIcons));
};

module.exports = buildSolid;