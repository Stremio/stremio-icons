const fs = require('fs');
const { execSync } = require('child_process');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

function toSVG(icon) {
    return `<svg viewBox="0 0 ${icon.icon.width || icons.height} ${icons.height}">${icon.icon.paths.map((d) => `<path d="${d}" />`)}</svg>`;
}

function toDrawable(icon) {
    return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
\tandroid:width="${(icon.icon.width || icons.height) / 20}dp"
\tandroid:height="${icons.height / 20}dp"
\tandroid:viewportWidth="${icon.icon.width || icons.height}"
\tandroid:viewportHeight="${icons.height}">
${icon.icon.paths.map((path) => `\t<path
\t\tandroid:fillColor="#ffffffff"
\t\tandroid:pathData="${path}" />`).join('\n')}
</vector>`;
}

execSync(`unzip icons.zip -d icons`);

const icons = JSON.parse(fs.readFileSync('./icons/selection.json'));

if (process.argv.includes('all') || process.argv.includes('docs')) {
    mkdirp.sync('docs');
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
    icons.icons.forEach((icon) => {
        const svg = toSVG(icon);
        fs.writeFileSync('tmp.svg', svg);
        execSync(`inkscape -z -w ${(icon.icon.width || icons.height) / 30} -h ${icons.height / 30} tmp.svg -e docs/${icon.properties.name}.png`);
        rimraf.sync('tmp.svg');
    });
}

if (process.argv.includes('all') || process.argv.includes('fonts')) {
    mkdirp.sync('fonts');
    fs.copyFileSync('icons/fonts/stremio-icons.svg', 'fonts/stremio-icons.svg');
    fs.copyFileSync('icons/fonts/stremio-icons.ttf', 'fonts/stremio-icons.ttf');
    fs.copyFileSync('icons/fonts/stremio-icons.woff', 'fonts/stremio-icons.woff');
}

if (process.argv.includes('all') || process.argv.includes('css')) {
    mkdirp.sync('css');
    fs.copyFileSync('icons/style.css', 'css/icons.css');
}

if (process.argv.includes('all') || process.argv.includes('android')) {
    mkdirp.sync('android/src/main/res/drawable');
    icons.icons.forEach((icon) => {
        const drawable = toDrawable(icon);
        fs.writeFileSync(
            `android/src/main/res/drawable/${icon.properties.name}.xml`,
            drawable
        );
    });
}

if (process.argv.includes('all') || process.argv.includes('react-native')) {
    mkdirp.sync('react-native/ios/png');
    icons.icons.forEach((icon) => {
        const svg = toSVG(icon);
        fs.writeFileSync('tmp.svg', svg);
        execSync(`inkscape -z -w ${(icon.icon.width || icons.height) / 16} -h ${icons.height / 16} tmp.svg -e react-native/ios/png/${icon.properties.name}.png`);
        rimraf.sync('tmp.svg');
    });
    fs.writeFileSync(
        'react-native/ios/png/index.js',
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

    mkdirp.sync('react-native/android/src/main/res/drawable');
    icons.icons.forEach((icon) => {
        const drawable = toDrawable(icon);
        fs.writeFileSync(
            `react-native/android/src/main/res/drawable/${icon.properties.name}.xml`,
            drawable
        );
    });
}

if (process.argv.includes('all') || process.argv.includes('dom')) {
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
}

rimraf.sync('icons');
