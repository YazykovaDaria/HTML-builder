const {readdir, mkdir} = require('fs/promises');
const path = require('path');
const {createReadStream, createWriteStream} = require('fs');
const {pipeline} = require('stream/promises');

const pathToOriginDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

const copyingFiles = async(pathToOrigin, pathToCopy) => {
  const read = createReadStream(pathToOrigin, 'utf-8');
  const write = await createWriteStream(pathToCopy);
  pipeline(read, write);
};

const copyringDir = async() => {

  await mkdir(pathToCopyDir, { recursive: true });

  const originItems = await readdir(pathToOriginDir);
  originItems.forEach((item) => {
    const pathToItem = path.join(pathToOriginDir, item);
    const pathToCopyItem = path.join(pathToCopyDir, item);
    copyingFiles(pathToItem, pathToCopyItem);
  });
};

copyringDir();
