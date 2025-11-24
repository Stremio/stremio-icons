const fs = require('fs');
const path = require('path');
const { snakeCase } = require('change-case');
const { toDrawableFiles, removeDir } = require('./utils');

const buildAndroid = (icons) => {
    const androidDrawablePath = path.join(process.cwd(), 'android', 'src', 'main', 'res', 'drawable');
    removeDir(androidDrawablePath);
    fs.mkdirSync(androidDrawablePath, { recursive: true });

    const drawableFiles = toDrawableFiles(icons);
    drawableFiles.forEach(({ filename, buffer }) => {
        fs.writeFileSync(path.join(androidDrawablePath, filename), buffer)
    });

    const declarations = icons
        .map(({ name }) => snakeCase(name))
        .map((name) => `\tval ${name} = R.drawable.${name}`)
        .join('\n');

    let object = 'package com.stremio.icons\n\n';
    object += 'object Icons {\n';
    object += declarations;
    object += '\n}';

    const objectPath = path.join(process.cwd(), 'android', 'src', 'main', 'kotlin', 'com', 'stremio', 'icons');
    fs.mkdirSync(objectPath, { recursive: true });

    const objectFile = path.join(objectPath, 'Icons.kt');
    fs.writeFileSync(objectFile, object);
};

module.exports = buildAndroid;