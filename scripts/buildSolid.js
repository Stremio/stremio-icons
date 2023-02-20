const fs = require('fs');
const path = require('path');
const { removeFiles } = require('./utils');

const buildSolid = (icons) => {
    const jsonIconsPath = path.join(process.cwd(), 'solid', 'src', 'icons.json');
    removeFiles(jsonIconsPath);

    const jsonIcons = Object.fromEntries(icons.map(({ name, viewBox, paths }) => {
        const solidPaths = paths.map(({ d, styles }) => ({
            d,
            style: styles
        }));
        
        return [
            name,
            {
                viewBox,
                paths: solidPaths
            }
        ]
    }));

    fs.writeFileSync(jsonIconsPath, JSON.stringify(jsonIcons));
};

module.exports = buildSolid;