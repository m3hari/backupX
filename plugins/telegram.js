const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("[backupX] [TELEGRAM]:Bot Token is required");
}

const password = process.env.TELEGRAM_BOT_ON_DEMAND_BACKUP_PIN;
if (!password) {
  throw new Error("[backupX] [TELEGRAM]: bot password  is required");
}
const subscribedChannelIDs = process.env.TELEGRAM_BOT_SUBSCRIBED_CHANNEL_IDS.split(',');


if (!subscribedChannelIDs || !subscribedChannelIDs.length) {
  throw new Error(
    "[backupX] [TELEGRAM]: white listed  channels list is required"
  );
}

const core = require("../core");

const bot = new TelegramBot(token, { polling: true });

// bot.sendDocument('-1001482710851', '.temp/test-project-sun-dec-09-2018-13:17:10.gzip');

console.log("[backupX] [TELEGRAM]:: bot loaded waiting command ");

bot.onText(/\/backup (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const pin = match[1];
  if (pin === password) {
    const backupFileName = core.backup();
    console.log("[backupX]  [TELEGRAM]:: sending ...");
    try {
      await bot.sendDocument(chatId, backupFileName);
      console.log("[backupX]  [TELEGRAM]:: Sent.");
    } catch (err) {
      console.log(err);
    }
  } else {
    bot.sendMessage(chatId, "ላሽ ላሽ");
  }
});

const telegramTransporter = {
  id: "telegram",
  description: "Telegram Transporter",
  send: async backupFileName => {
    console.log("[backupX] [TELEGRAM] [CRON]:: sending ", backupFileName);
    for (const channelId of subscribedChannelIDs) {
      const chat = await bot.getChat(channelId);
      if (!chat || !chat.id) {
        console.log("Invalid channel:", channelId);
        continue;
      }
      console.log('CHAT iD:',chat.id)
      console.log('backupFileName:',backupFileName)
      bot.sendDocument(chat.id, backupFileName);
    }
    console.log("[backup-x] [TELEGRAM] [CRON]:: complete.");
  }
};

module.exports = telegramTransporter;
