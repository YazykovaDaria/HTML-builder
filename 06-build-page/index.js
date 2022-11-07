const {readdir, stat, mkdir, readFile} = require('fs/promises');
const path = require('path');
const {createReadStream, createWriteStream} = require('fs');
const {pipeline} = require('stream/promises');


const buildStylesBundle = async() => {
  const pathToStylesDir = path.join(__dirname, 'styles');
  const pathToBandle = path.join(__dirname, 'project-dist', 'style.css');

  const write = createWriteStream(pathToBandle);
  const stylesDirItems = await readdir(pathToStylesDir);

  stylesDirItems.forEach(async(item) => {
    const pathToItem = path.join(pathToStylesDir, item);
    const extItem = path.extname(pathToItem);

    if (extItem === '.css') {
      const read = createReadStream(pathToItem, 'utf-8');
      read.on('data', (data) => {
        write.write(`${data}\n`);
      });
    }
  });
};

const copyAssets = async(pathToSourse, pathToResultDir) => {
  await mkdir(pathToResultDir, { recursive: true });

  const originItems = await readdir(pathToSourse);
  originItems.forEach(async(item) => {
    const pathToItem = path.join(pathToSourse, item);
    const itemStat = await stat(pathToItem);
    const pathToCopyItem = path.join(pathToResultDir, item);

    if(itemStat.isFile()) {
      const read = createReadStream(pathToItem, 'utf-8');
      const write = createWriteStream(pathToCopyItem);
      pipeline(read, write);
    } else {
      copyAssets(pathToItem, pathToCopyItem);
    }
  });
};

const buildHtml = () => {
  const pathToComponents = path.join(__dirname, 'components');
  const pathToHtml = path.join(__dirname, 'template.html');
  const pathToResultHtml = path.join(__dirname, 'project-dist', 'index.html');
  let tmp = '';

  const write = createWriteStream(pathToResultHtml);
  const read = createReadStream(pathToHtml, 'utf-8');
  read.on('data', (data) => {
    tmp += data;
  });

  read.on('end', async() => {
    const patternTags = [...tmp.matchAll(/{{(.*)}}/g)];

    for (let tag of patternTags) {
      const pathToComponent = path.join(pathToComponents, `${tag[1]}.html`);
      const component = await readFile(pathToComponent, 'utf8');
      tmp = tmp.replace(tag[0], component);
    }
    write.write(tmp);
  });
};

const buildPage = async() => {
  const pathToResultDir = path.join(__dirname, 'project-dist');
  try {
    await mkdir(pathToResultDir, { recursive: true });
    buildStylesBundle();
    copyAssets(path.join(__dirname,'assets'), path.join(pathToResultDir, 'assets'));
    buildHtml();
  }
  catch(err) {
    throw new Error(err.message);
  }
};

buildPage();
