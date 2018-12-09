const emailTransporter = require("./plugins/mail");
const telegramTransporter = require("./plugins/telegram");

const plugins = [telegramTransporter, emailTransporter];

function isSupportedTransporter(name) {
  return plugins.map(plugin => plugin.id).includes(name);
}

function getPluginById(name) {
  for (const p of plugins) {
    if (p.id === name) return p;
  }
  throw new Error("Unsupported transporter");
}

function transport(data, transporter = "telegram") {
  if (!isSupportedTransporter(transporter)) {
    throw new Error("Unsupported transporter.");
  }
  const plugin = getPluginById(transporter);
  plugin.send(data);

}

module.exports = transport;
