const fs = require('fs');
const path = require('path');

const serverDir = './'; 
function getCurrentDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
}
function fileNameToCmdName(fileName) {
  return fileName.replace(/-/g, '_').toLowerCase();
}
function collectCommandFiles(directory) {
  return fs.readdirSync(directory)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .map(file => ({
      fileName: file,
      cmdName: fileNameToCmdName(file)
    }));
}
function updateAvailableCmds(commandFiles) {
  const cmds = commandFiles.map(file => ({
    cmd: file.cmdName,
    author: "Dipto",
    update: getCurrentDate(),
    status: "on"
  }));

  const availableCmds = { cmdName: cmds };
  const availableCmdsPath = path.join(__dirname, 'availableCmds.json');
  fs.writeFileSync(availableCmdsPath, JSON.stringify(availableCmds, null, 2));
}
function updateCmdUrls(commandFiles) {
  const cmdUrls = {};
  commandFiles.forEach(file => {
    const fileName = file.fileName;
    const url = `https://raw.githubusercontent.com/Blankid018/D1PT0/main/${fileName}`;
    cmdUrls[file.cmdName] = url;
  });

  const cmdUrlsPath = path.join(__dirname, 'cmdUrls.json');
  fs.writeFileSync(cmdUrlsPath, JSON.stringify(cmdUrls, null, 2));
}
function main() {
  try {
    const commandFiles = collectCommandFiles(serverDir);
    updateAvailableCmds(commandFiles);
    updateCmdUrls(commandFiles);
    console.log('Command files updated successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
main();