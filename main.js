const fs = require("fs");
const mineflayer = require("mineflayer");
//const inventoryViewer = require("mineflayer-web-inventory");
const autoeat = require("mineflayer-auto-eat").plugin;

const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");

// Читаем JSON-файл
fs.readFile("config/cfg.json", "utf8", (err, data) => {
  if (err) {
    console.error("Ошибка при чтении файла:", err);
    return;
  }

  try {
    // Парсим JSON
    const parsedData = JSON.parse(data);
    //console.log("Данные из файла:", parsedData);

    // Создаем бота после успешного чтения файла
    const bot = mineflayer.createBot({
      host: parsedData.HOST,
      port: parsedData.PORT,
      username: parsedData.BOTNAME,
      version: parsedData.VERSION,
    });

    //inventoryViewer(bot, options);

    // Остальной код, использующий переменную parsedData, также переносится сюда
    const RANGE_GOAL = 1; // get within this radius of the player

    bot.loadPlugin(autoeat);
    bot.loadPlugin(pathfinder);

    bot.once("spawn", () => {
      bot.autoEat.options.priority = "foodPoints";
      bot.autoEat.options.startAt = 14;
      bot.autoEat.options.bannedFood.push("golden_apple");
    });

    bot.on("health", () => {
      if (bot.food !== 20) {
        bot.autoEat.disable();
        bot.autoEat.enable();
      }
    });

    bot.on("autoeat_error", console.error);

    bot.once("spawn", () => {
      const defaultMove = new Movements(bot);

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        if (parsedData.ADMINS.includes(username) && message == "come") {
          const target = bot.players[username]?.entity;
          if (!target) {
            bot.whisper(username, "Іді нахуй, я тебе не бачу"); // Передача имени пользователя и сообщения
            return;
          }

          const { x: playerX, y: playerY, z: playerZ } = target.position;

          bot.pathfinder.setMovements(defaultMove);
          bot.pathfinder.setGoal(
            new GoalNear(playerX, playerY, playerZ, RANGE_GOAL)
          );
        } else return;
      });

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        const args = message.split(" "); // Разбиваем сообщение на отдельные слова
        if (parsedData.ADMINS.includes(username) && args[0] === "go") {
          // Используем разделенные слова для проверки команды
          if (args.length === 4) {
            // Проверяем, что в сообщении есть достаточно аргументов
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(
              new GoalNear(
                parseFloat(args[1]), // Преобразуем координаты в числа
                parseFloat(args[2]),
                parseFloat(args[3]),
                RANGE_GOAL
              )
            );
          } else {
            console.log(
              "Неверное количество аргументов. Команда должна быть вида: go <x> <y> <z>"
            );
          }
        } else {
          return;
        }
      });

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        const args = message.split(" "); // Разбиваем сообщение на отдельные слова
        if (parsedData.ADMINS.includes(username) && args[0] === "go") {
          // Используем разделенные слова для проверки команды
          if (args.length === 4) {
            // Проверяем, что в сообщении есть достаточно аргументов
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(
              new GoalNear(
                parseFloat(args[1]), // Преобразуем координаты в числа
                parseFloat(args[2]),
                parseFloat(args[3]),
                RANGE_GOAL
              )
            );
          } else {
            console.log(
              "Неверное количество аргументов. Команда должна быть вида: go <x> <y> <z>"
            );
          }
        } else {
          return;
        }
      });

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        if (parsedData.ADMINS.includes(username) && message == "login") {
          bot.chat(parsedData.PASSWORD);
          bot.chat(parsedData.PASSWORD);
        } else return;
      });

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        if (parsedData.ADMINS.includes(username) && message == "help") {
          bot.whisper(
            username,
            "come - Прийти к игроку\ngo <x> <y> <z> - Прийти на координаты\nset <set/url> <nickname/url> - Установить боту скин"
          );
        } else return;
      });

      bot.on("whisper", (username, message) => {
        if (username === bot.username) return;
        const args = message.split(" "); // Разбиваем сообщение на отдельные слова
        if (parsedData.ADMINS.includes(username) && args[0] === "skin") {
          if (args.length === 3) {
            if (args[1] != "set" && args[1] != "url") return;
            bot.chat("/skin " + args[1] + " " + args[2]);
            console.log(
              username +
                " установил боту скин на " +
                args[2] +
                ", с помощью " +
                args[1]
            );
          } else {
            bot.whisper(
              username,
              "Неверное количество аргументов. Команда должна быть вида: set <set/url> <nickname/url>"
            );
            console.log(
              "Неверное количество аргументов. Команда должна быть вида: set <set/url> <nickname/url>"
            );
          }
        } else {
          return;
        }
      });
    });
  } catch (err) {
    console.error("Ошибка при парсинге JSON:", err);
  }
});
