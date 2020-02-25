const fs = require('fs');
const svgToImg = require('svg-to-img');
const icons = require('./icons.json');

const androidDrawables = icons.icons.map((icon) => {
    const width = icon.icon.width || icons.height;
    const drawable = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
\tandroid:width="${width / 20}dp"
\tandroid:height="${icons.height / 20}dp"
\tandroid:viewportWidth="${width}"
\tandroid:viewportHeight="${icons.height}">
${icon.icon.paths.map((path) => `\t<path
\t\tandroid:fillColor="#ffffffff"
\t\tandroid:pathData="${path}" />`)
            .join('\n')
        }
</vector>`;
    return {
        name: icon.properties.name,
        drawable
    };
});

const webIcons = icons.icons.reduce((webIcons, icon) => {
    webIcons[icon.properties.name] = {
        viewBox: `0 0 ${icon.icon.width || icons.height} ${icons.height}`,
        paths: icon.icon.paths
    };
    return webIcons;
}, {});

const previewIcons = Promise.all(icons.icons.map((icon) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.icon.width || icons.height} ${icons.height}">
            ${icon.icon.paths.map((d) => `<path d="${d}" />`)}
        </svg>
    `;
    return svgToImg.from(svg).toPng({ height: 32 }).then((image) => ({
        name: icon.properties.name,
        image
    }));
}));

const readme = '|preview|name|\n' +
    '|:---:|:---:|\n' +
    icons.icons.map((icon) => `|![${icon.properties.name}](/preview/${icon.properties.name}.png)|${icon.properties.name}|`)
        .join('\n');

androidDrawables.forEach(({ name, drawable }) => {
    fs.writeFileSync(`./android/src/main/res/drawable/${name}.xml`, drawable);
});
fs.writeFileSync(`./dom/icons.json`, JSON.stringify(webIcons));
fs.writeFileSync('./README.md', readme);
previewIcons.then((icons) => {
    icons.forEach(({ name, image }) => {
        fs.writeFileSync(`./preview/${name}.png`, image);
    });
});
