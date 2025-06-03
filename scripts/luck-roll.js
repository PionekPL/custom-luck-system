
Hooks.once("chatMessage", (chatLog, message, chatData) => {
  const command = message.trim().split(" ");
  if (command[0] !== "!r") return;

  const skill = parseInt(command[1]);
  if (isNaN(skill)) return;

  const roll1 = new Roll("1d10").roll({ async: false });
  const roll2 = new Roll("1d10").roll({ async: false });
  const base = roll1.total + roll2.total;
  let total = base + skill;
  let detail = `🎲 Rzuty: [${roll1.total}, ${roll2.total}] + umiejętność (${skill})`;

  if (roll1.total === 1 && roll2.total === 1) {
    total -= 10;
    detail += " → Podwójna 1! -10";
  } else if (roll1.total === 10 && roll2.total === 10) {
    total += 10;
    detail += " → Podwójna 10! +10";
  } else {
    if (roll1.total === 1) {
      const extra = new Roll("1d10").roll({ async: false }).total;
      total -= extra;
      detail += ` → 1 na kości, -${extra}`;
    }
    if (roll2.total === 1) {
      const extra = new Roll("1d10").roll({ async: false }).total;
      total -= extra;
      detail += ` → 1 na kości, -${extra}`;
    }
    if (roll1.total === 10) {
      const extra = new Roll("1d10").roll({ async: false }).total;
      total += extra;
      detail += ` → 10 na kości, +${extra}`;
    }
    if (roll2.total === 10) {
      const extra = new Roll("1d10").roll({ async: false }).total;
      total += extra;
      detail += ` → 10 na kości, +${extra}`;
    }
    if ((roll1.total === 1 && roll2.total === 10) || (roll1.total === 10 && roll2.total === 1)) {
      total -= 1;
      detail += ` → 1 i 10, -1`;
    }
  }

  ChatMessage.create({
    content: `<b>Wynik końcowy:</b> ${total}<br>${detail}`,
    speaker: ChatMessage.getSpeaker()
  });

  return false;
});
