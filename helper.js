const { execSync } = require("child_process");

function deleteFile(fileName) {
  execSync(`rm -f ${fileName}`);
}

function buildFileName(dbName = "Backup", timestamp = new Date()) {
  const day = timestamp.toString().substr(0,3);
  const time = timestamp.toISOString().substr(0, 19).replace(/:/g, "-");
  return `${dbName}_${day}_${time}.gzip`.toLowerCase();
}

module.exports = {
    deleteFile,
    buildFileName
};
