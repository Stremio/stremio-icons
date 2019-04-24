const fs = require('fs');

fs.writeFileSync('../README.md', getReadmeContent());

function getReadmeContent() {
    return '|preview|name|' +
        '|:---:|:---:|' +
        fs.readdirSync('./preview')
            .map((fileName) => {
                const iconName = fileName.substring(0, fileName.length - 4);
                return `|![${iconName}](/preview/${fileName})|${iconName}|`;
            })
            .join('\n');
}
