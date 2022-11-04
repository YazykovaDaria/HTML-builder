const {readdir, stat} = require('fs/promises');
const path = require('path');

const showFileData = async(folderName) => {
  const pathToFolder = path.join(__dirname, folderName);
  try {
    const folderContent = await readdir(pathToFolder);

    folderContent.forEach(async(item) => {
      const pathToItem = path.join(pathToFolder, item);
      const itemStat = await stat(pathToItem);
      if (itemStat.isFile()) {
        const fileExt = path.extname(pathToItem);
        const fileName = path.basename(pathToItem, fileExt);
        const fileSize = itemStat.size;
        const fileData = `${fileName} - ${fileExt.slice(1)} - ${fileSize}`;
        console.log(fileData);
      }
    });
  }
  catch (err) {
    throw new Error(err.message);
  }
};

showFileData('secret-folder');
