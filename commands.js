const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");

const RANGE_GOAL = 1;

function commandsHandler(bot, parsedData) {
  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    const defaultMove = new Movements(bot);

    bot.on("whisper", (username, message) => {
      if (username === bot.username) return;
      if (parsedData.ADMINS.includes(username) && message == "come") {
        const target = bot.players[username]?.entity;
        if (!target) {
          bot.whisper(username, "Іді нахуй, я тебе не бачу");
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
      const args = message.split(" ");
      if (parsedData.ADMINS.includes(username) && args[0] === "go") {
        if (args.length === 4) {
          bot.pathfinder.setMovements(defaultMove);
          bot.pathfinder.setGoal(
            new GoalNear(
              parseFloat(args[1]),
              parseFloat(args[2]),
              parseFloat(args[3]),
              RANGE_GOAL
            )
          );

          console.log(
            username +
              " отправил бота на координаты: " +
              args[1] +
              " " +
              args[2] +
              " " +
              args[3]
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
      if (parsedData.ADMINS.includes(username) && message == "stopGoing") {
        going = false;
      } else return;
    });

    bot.on("whisper", (username, message) => {
      if (username === bot.username) return;
      const args = message.split(" ");
      if (parsedData.ADMINS.includes(username) && args[0] === "going") {
        if (args.length === 1) {
          const target = bot.players[username]?.entity;
          while (true) {
            const { x: playerX, y: playerY, z: playerZ } = target.position;

            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(
              new GoalNear(
                parseFloat(playerX),
                parseFloat(playerY),
                parseFloat(playerZ),
                RANGE_GOAL
              )
            );
            console.log(
              username +
                " отправил бота на координаты: " +
                playerX +
                " " +
                playerY +
                " " +
                playerZ
            );
          }
        } else {
          console.log(
            "Неверное количество аргументов. Команда должна быть вида: go <x> <y> <z>"
          );

          bot.whisper(
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

        console.log(username + " использовал login");
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
      const args = message.split(" ");
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
}

module.exports = { commandsHandler };
