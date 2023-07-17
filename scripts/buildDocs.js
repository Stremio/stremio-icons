const fs = require('fs');
const path = require('path');
const { toPngFiles, removeFiles } = require('./utils');

const MARKDOWN_INDEX = `---
layout: default
title: Stremio Icons
---
|preview|name|
|:---:|:---:|\n`;

const buildDocs = async (icons) => {
    const docsPath = path.join(process.cwd(), 'docs');
    await removeFiles(docsPath, '*.?(png|md)');

    const pngFiles = await toPngFiles(icons, 32);
    pngFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(docsPath, filename), buffer);
    });

    const indexFile = MARKDOWN_INDEX.concat(icons.map(({ name }) => `|![${name}](${name}.png)|${name}|`).join('\n'));
    fs.writeFileSync(path.join(docsPath, 'index.md'), indexFile);
};

module.exports = buildDocs;