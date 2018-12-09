const { execSync } = require("child_process");
const Path = require("path");
const { buildFileName } = require("./helper");

//todo load credentials from env
const HOST = process.env.MONGO_URL || "localhost:27017";
const secureDb = process.env.MONGO_IS_SECURE  || false;
const user = process.env.MONGO_USER ;
const password = process.env.MONGO_PASSWORD ;
const authDb = process.env.MONGO_AUTH_DB ;
if(secureDb){
  if(!user || ! password || !authDb ){
    throw new Error(
      "[backupX] [CORE]: mongo username,password,auth database are required."
    );
  }
}

function backup() {
  //exec backup process
  console.log("[backupX] [core]: Backup started ...");
  execSync(`mkdir ./temp -p`);
  const fileName = buildFileName("test-project", new Date());
  const filePath = Path.join("./temp", fileName);

  //@TODO get more options from user
  let command = `mongodump --host=${HOST} --gzip --archive=${filePath}`
  if(secureDb){
    command += ` --ssl --username ${user} --password=${password} --authenticationDatabase ${authDb}`
  }

  execSync(command);
  console.log("[backupX]: Backup complete.");
  return filePath;
}

module.exports = {
  backup
};
