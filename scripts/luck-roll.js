// scripts/luck-roll.js
Hooks.once("chatCommandsReady", function () {
  game.chatCommands.register({
    commandKey: "r",
    invokeOnCommand: false,
    prerequisite: () => true,
    validate: (input) => /^\s*\d+\s*$/.test(input),
    execute: (input) => {
      const skill = parseInt(input.trim());
      const roll1 = new Roll("1d10").roll({ async: false });
      const roll2 = new Roll("1d10").roll({ async: false });

      const results = [roll1.total, roll2.total];
      let total = roll1.total + roll2.total + skill;

      let extraInfo = "";
      if (results[0] === 1 && results[1] === 1) {
        total -= 10;
        extraInfo = "Podwójna 1! -10 do wyniku.";
      } else if (results[0] === 10 && results[1] === 10) {
        total += 10;
        extraInfo = "Podwójna 10! +10 do wyniku.";
      } else if ((results.includes(1)) && (results.includes(10))) {
        total -= 1;
        extraInfo = "1 i 10 -1 do sumy.";
      } else {
        for (let i = 0; i < 2; i++) {
          if (results[i] === 1) {
            const penalty = new Roll("1d10").roll({ async: false }).total;
            total -= penalty;
            extraInfo += `\n🎲 Kara za 1: -${penalty}`;
          } else if (results[i] === 10) {
            const bonus = new Roll("1d10").roll({ async: false }).total;
            total += bonus;
            extraInfo += `\n🎲 Premia za 10: +${bonus}`;
          }
        }
      }

      const content = `<strong>Wynik końcowy: ${total}</strong><br>` +
                      `🎲 Rzuty: [${results.join(", ")}] + umiejętność (${skill})` +
                      `<br>${extraInfo}`;

      ChatMessage.create({ content });
    },
  });
});
