//load env vars from .env
const { parsed } = require("dotenv").config();
const core = require("./core");
const transport = require("./transporter");
const { deleteFile } = require("./helper");
const Scheduler = require("node-schedule");

async function scheduledBackup() {
  console.log("[backupX] [CRON] started");
  const defaultTransporter = "telegram";
  try {
    //1 - do backup
    const db = parsed && parsed.MONGO_BACKUP_DB;
    const backupFilePath = core.backup(db);
    if (!backupFilePath) {
      console.log("[backupX] [Error]:", "something went wrong");
    }
    // 2 - send
    await transport(backupFilePath, defaultTransporter);

    // 3 - clean up
    deleteFile(backupFilePath);
  } catch (err) {
    console.log("[backupX]:", err);
  }
}

function start() {
  //default schedule ever day at 23:59
  const schedule = "59 23 * * *"
  Scheduler.scheduleJob(schedule, scheduledBackup);
}

function stop() {
  //gracefully stop
  //clean up, e.g stop scheduler
  //@todo listen for KILL signal to trigger  stop
}

start();
