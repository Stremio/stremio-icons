const fs = require('fs');
const svgToImg = require("svg-to-img");
const { icons, height: iconsHeight } = require('../icons.json');

Promise.all(icons.map((icon) => {
    const svg = getSvgContent(icon);
    return svgToImg.from(svg).toPng({
        path: `./preview/${icon.properties.name}.png`,
        height: 32
    });
})).then(() => {
    fs.writeFileSync('./README.md', getReadmeContent());
});

function getSvgContent(icon) {
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.icon.width || iconsHeight} ${iconsHeight}">
            ${icon.icon.paths.map(d => `<path d="${d}" />`)}
        </svg>`
    );
}

function getReadmeContent() {
    return '|preview|name|\n' +
        '|:---:|:---:|\n' +
        fs.readdirSync('./preview')
            .map((fileName) => {
                const iconName = fileName.substring(0, fileName.length - 4);
                return `|![${iconName}](/preview/${fileName})|${iconName}|`;
            })
            .join('\n');
}
