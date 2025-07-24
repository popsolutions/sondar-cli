
const fs = require('node:fs');
const readline = require('node:readline');

const fileUrl = './project.csv';

async function readFile(filePath, action) {
  try {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    let lineNumber = 1;
    for await (const line of rl) {      
      if (lineNumber > 1) {
        const [name, url, isPing] = line.split(',');
        action(name, url, isPing);        
      }
      lineNumber++;
    }
  
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
}

module.exports = readFile;