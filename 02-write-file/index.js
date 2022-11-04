const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const pathToFile = path.join(__dirname, 'result.txt');
const writeStream = fs.createWriteStream(pathToFile);
const readLine = readline.createInterface({ input, output });

const exit = (readLine) => {
  readLine.close();
  console.log('Bye');
  return;
};

const write = (mes) => {
  writeStream.write(`${mes}\n`);
};

const app = () => {
  readLine.question('Write your message here: ', (mes) => {
    if (mes.toLowerCase() === 'exit') {
      exit(readLine);
    } else {
      console.log(mes);
      write(mes);
      app();
    }
  });

  readLine.on('SIGINT', () => {
    //баг с двойным прощанием
    exit(readLine);
  });
};

app();
