const fs = require('fs');
const { execSync } = require('child_process');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

mkdirp.sync('android/src/main/res/drawable');
mkdirp.sync('react-native/png');
mkdirp.sync('fonts');
mkdirp.sync('css');
mkdirp.sync('docs');

execSync(`unzip icons.zip -d icons`);

const icons = require('./icons/selection.json');

fs.copyFileSync('icons/fonts/stremio-icons.svg', 'fonts/stremio-icons.svg');
fs.copyFileSync('icons/fonts/stremio-icons.ttf', 'fonts/stremio-icons.ttf');
fs.copyFileSync('icons/fonts/stremio-icons.woff', 'fonts/stremio-icons.woff');

fs.copyFileSync('icons/style.css', 'css/icons.css');

fs.writeFileSync(
    'docs/index.md',
    `---
layout: default
title: Stremio Icons
---

|preview|name|
|:---:|:---:|\n`
    +
    icons.icons.map((icon) => {
        return `|![${icon.properties.name}](${icon.properties.name}.png)|${icon.properties.name}|`;
    }).join('\n')
);

fs.writeFileSync(
    'dom/icons.json',
    JSON.stringify(icons.icons.reduce((result, icon) => {
        result[icon.properties.name] = {
            viewBox: `0 0 ${icon.icon.width || icons.height} ${icons.height}`,
            paths: icon.icon.paths
        };
        return result;
    }, {}))
);

icons.icons.forEach((icon) => {
    const name = icon.properties.name;
    const width = icon.icon.width || icons.height;
    const height = icons.height;
    const paths = icon.icon.paths;
    fs.writeFileSync(
        `android/src/main/res/drawable/${name}.xml`,
        `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
\tandroid:width="${width / 20}dp"
\tandroid:height="${height / 20}dp"
\tandroid:viewportWidth="${width}"
\tandroid:viewportHeight="${height}">
${paths.map((path) => `\t<path
\t\tandroid:fillColor="#ffffffff"
\t\tandroid:pathData="${path}" />`).join('\n')}
</vector>`
    );
    fs.writeFileSync(
        'tmp.svg',
        `<svg viewBox="0 0 ${width} ${height}">${paths.map((d) => `<path d="${d}" />`)}</svg>`
    );
    execSync(`inkscape -z -w ${width / 16} -h ${height / 16} tmp.svg -e react-native/png/${name}.png`);
    execSync(`inkscape -z -w ${width / 30} -h ${height / 30} tmp.svg -e docs/${name}.png`);
    rimraf.sync('tmp.svg');
});

fs.writeFileSync(
    'react-native/png/index.js',
    icons.icons.map((icon) => {
        return `var ${icon.properties.name} = require('./${icon.properties.name}.png');`;
    }).join('\n')
    +
    '\nmodule.exports = {\n'
    +
    icons.icons.map((icon) => icon.properties.name).join(',\n')
    +
    '\n};'
);

rimraf.sync('icons');
