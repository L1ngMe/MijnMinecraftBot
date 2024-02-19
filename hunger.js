const autoEatOptions = {
  priority: "foodPoints",
  startAt: 14,
  bannedFood: ["golden_apple"],
};

function setupEating(bot) {
  const autoeat = require("mineflayer-auto-eat").plugin;

  bot.loadPlugin(autoeat);

  bot.once("spawn", () => {
    bot.autoEat.options = autoEatOptions;
  });

  bot.on("autoeat_error", console.error);
}

module.exports = { setupEating };
