const {readdir, mkdir, unlink} = require('fs/promises');
const path = require('path');
const {createReadStream, createWriteStream} = require('fs');
const {pipeline} = require('stream/promises');

const pathToOriginDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

const copyringFiles = (pathToOrigin, pathToCopy) => {
  const read = createReadStream(pathToOrigin, 'utf-8');
  const write = createWriteStream(pathToCopy);
  pipeline(read, write);
};

const deleteFiles = async(originFiles, copyFiles) => {
  copyFiles.forEach(async(file) => {
    if (!originFiles.includes(file)) {
      const pathToFile = path.join(pathToCopyDir, file);
      await unlink(pathToFile);
    }
  });
};

const copyringDir = async() => {
  await mkdir(pathToCopyDir, { recursive: true });

  const copyingItems = await readdir(pathToCopyDir);

  const originItems = await readdir(pathToOriginDir);
  originItems.forEach((item) => {
    const pathToItem = path.join(pathToOriginDir, item);
    const pathToCopyItem = path.join(pathToCopyDir, item);
    copyringFiles(pathToItem, pathToCopyItem);
  });

  deleteFiles(originItems, copyingItems);
};

copyringDir();
