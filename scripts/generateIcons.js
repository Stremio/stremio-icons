const fs = require('fs');
const icons = require('../icons.json');

function updateAndroidDrawables() {
    const height = icons.height;
    icons.icons.forEach((icon) => {
        const width = icon.icon.width || height;
        const drawable = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
\tandroid:width="${width / 20}dp"
\tandroid:height="${height / 20}dp"
\tandroid:viewportWidth="${width}"
\tandroid:viewportHeight="${height}">
${icon.icon.paths.map((path) => `\t<path
\t\tandroid:fillColor="#ffffffff"
\t\tandroid:pathData="${path}" />`)
                .join('\n')
            }
</vector>`;

        fs.writeFileSync(`./android/src/main/res/drawable/${icon.properties.name}.xml`, drawable);
    });
}

function updateWebIcons() {
    const webIcons = icons.icons.reduce((webIcons, icon) => {
        webIcons[icon.properties.name] = {
            viewBox: `0 0 ${icon.icon.width || icons.height} ${icons.height}`,
            paths: icon.icon.paths
        };
        return webIcons;
    }, {});
    fs.writeFileSync(`./dom/icons.json`, JSON.stringify(webIcons));
}

updateAndroidDrawables();
updateWebIcons();
