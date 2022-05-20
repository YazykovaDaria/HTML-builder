const path = require('path');
const fs = require('fs');

const pathForFile = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(pathForFile, 'utf-8');

let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
