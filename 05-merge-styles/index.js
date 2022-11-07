const {readdir, stat} = require('fs/promises');
const path = require('path');
const {createReadStream, createWriteStream} = require('fs');

const pathToBandle = path.join(__dirname, 'project-dist', 'bundle.css');
const write = createWriteStream(pathToBandle);
const pathToStylesDir = path.join(__dirname, 'styles');

const buildBandle = async() => {

  const stylesDirItems = await readdir(pathToStylesDir);

  stylesDirItems.forEach(async(item) => {
    const pathToItem = path.join(pathToStylesDir, item);
    const extItem = path.extname(pathToItem);
    const statItem = await stat(pathToItem);

    if (statItem.isFile() && extItem === '.css') {
      const read = createReadStream(pathToItem, 'utf-8');
      read.on('data', (data) => {
        write.write(`${data}\n`);
      });
    }
  });
};

buildBandle();
