const { execSync } = require("child_process");

function deleteFile(fileName) {
  execSync(`rm -f ${fileName}`);
}


function buildFileName(project = "Backup-", timestamp) {
  const date = timestamp
    .toString()
    .substr(0, 15)
    .replace(/ /g, "-");
  const time = timestamp.toTimeString().substr(0, 8);
  return `${project}-${date}-${time}.gzip`.toLowerCase();
};
module.exports = {
    deleteFile,
    buildFileName
};
