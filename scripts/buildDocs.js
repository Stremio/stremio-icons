const fs = require('fs');
const path = require('path');
const { toPngFiles } = require('./utils');

const MARKDOWN_INDEX = `---
layout: default
title: Stremio Icons
---
|preview|name|
|:---:|:---:|\n`;

const buildDocs = (icons) => {
    (async () => {
        const docsPath = path.join(process.cwd(), 'docs');
    
        const pngFiles = await toPngFiles(icons, 32);
        pngFiles.forEach(({ name, buffer }) => {
            fs.writeFileSync(path.join(docsPath, `${name}.png`), buffer);
        });
    
        const indexFile = MARKDOWN_INDEX.concat(icons.map(({ name }) => `|![${name}](${name}.png)|${name}|`).join('\n'));
        fs.writeFileSync(path.join(docsPath, 'index.md'), indexFile);
    })();
};

module.exports = buildDocs;