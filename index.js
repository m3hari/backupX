//load env vars from .env
require("dotenv").config();

const core = require("./core");
const transport = require("./transporter");
const { deleteFile } = require("./helper");
const Scheduler = require("node-schedule");

function process() {
  console.log("[backupX] [CRON] started");
  const defaultTransporter = "telegram";
  try {
    //1 - do backup
    const backupFilePath = core.backup();
    if (!backupFilePath) {
      console.log("[backupX] [Error]:", "something went wrong");
      process.exit(-1);
    }
    // 2 - send
    transport(backupFilePath, defaultTransporter);

    // 3 - clean up
    deleteFile(backupFilePath);
  } catch (err) {
    console.log("[backupX]:", err);
  }
}

function start() {
  //default schedule ever day at 23:59
  const schedule = "59 23 * * *"
  // const schedule = "*/1 * * * *";
  Scheduler.scheduleJob(schedule, process);
}

function stop() {
  //gracefully stop
  //clean up, e.g stop scheduler
  //@todo listen for KILL signal to trigger  stop
}

start();
