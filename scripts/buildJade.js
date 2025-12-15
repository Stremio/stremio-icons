const fs = require('fs');
const path = require('path');
const { paramCase } = require('change-case');
const { removeFiles, toJSONFile } = require('./utils');

const toStylusVariables = (icons) => {
    return icons.map(({ name, viewBox }) => {
        const [x, y, width, height] = viewBox.split(' ');
        return `$icon-${paramCase(name)}-viewBox = "${viewBox}"
$icon-${paramCase(name)}-width = ${width}
$icon-${paramCase(name)}-height = ${height}`;
    }).join('\n\n');
};

const toPugMixin = (icon) => {
    const { name, viewBox, paths } = icon;
    const pathsCode = paths.map(({ d, styles }, index) => {
        const styleAttrs = Object.entries(styles)
            .map(([key, value]) => `${paramCase(key)}="${value}"`)
            .join(' ');
        return `    path(d="${d}" ${styleAttrs})`;
    }).join('\n');

    // Compatible with both old Jade and modern Pug
    return `mixin icon-${paramCase(name)}(className)
  - className = className || ''
  svg(xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class=className)
${pathsCode}`;
};

const toPugMixins = (icons) => {
    return icons.map(toPugMixin).join('\n\n');
};

const buildJade = async (icons) => {
    const jadePath = path.join(process.cwd(), 'jade');
    
    // Create jade directory if it doesn't exist
    if (!fs.existsSync(jadePath)) {
        fs.mkdirSync(jadePath, { recursive: true });
    }

    // Clean existing files
    await removeFiles(jadePath, '*.?(json|jade|styl)');

    // Generate Pug mixins file with hardcoded SVG data
    const jadeMixinsPath = path.join(jadePath, 'icons.jade');
    const jadeMixins = toPugMixins(icons);
    fs.writeFileSync(jadeMixinsPath, jadeMixins);

    // Generate Stylus variables file
    const stylusPath = path.join(jadePath, 'icons.styl');
    const stylusVars = toStylusVariables(icons);
    fs.writeFileSync(stylusPath, stylusVars);
};

module.exports = buildJade;