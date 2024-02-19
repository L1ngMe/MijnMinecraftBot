const fs = require("fs");
const mineflayer = require("mineflayer");
const commands = require("./commands");
const hunger = require("./hunger");

fs.readFile("config/cfg.json", "utf8", (err, data) => {
  if (err) {
    console.error("Ошибка при чтении файла:", err);
    return;
  }

  try {
    const parsedData = JSON.parse(data);
    //console.log("Данные из файла:", parsedData);

    const bot = mineflayer.createBot({
      host: parsedData.HOST,
      port: parsedData.PORT,
      username: parsedData.BOTNAME,
      version: parsedData.VERSION,
    });

    commands.commandsHandler(bot, parsedData);
    hunger.setupEating(bot);
  } catch (err) {
    console.error("Ошибка при парсинге JSON:", err);
  }
});
