import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";
import * as leaderboard from "./commands/leaderboard";
import { Game } from "./game";
import { hasWon } from "../utils/win";
import { applyModifier } from "../utils/modifiers";
import { getUserData, updateUserData } from "../utils/db";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: any) => {
  client.application.commands.create(startGame.data);
  client.application.commands.create(leaderboard.data);
});

client.on(Events.InteractionCreate, async (interaction: any) => {
  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === startGame.data.name
  )
    startGame.execute(interaction);

  if (
    interaction.isChatInputCommand() &&
    interaction.commandName === leaderboard.data.name
  )
    leaderboard.execute(interaction);

  if (interaction.isButton() && interaction.customId.split(":")[0] === "play") {
    const uid = interaction.user.id;
    const gameId = interaction.customId.split("/")[1];
    const [placedRow, placedColumn] = interaction.customId
      .split(":")[1]
      .split("/")[0]
      .split(",")
      .map(Number);

    await interaction.deferUpdate();

    const game = Game.games.find((game: Game) => game.id === gameId);

    if (!game) {
      interaction.followUp({
        content: "Not an active game :(",
        ephemeral: true,
      });
      return;
    }

    if (game.playerO !== uid && game.playerX !== uid) {
      interaction.followUp({
        content: "You're not in this game!",
        ephemeral: true,
      });
      return;
    }

    if (
      (game.playerX === uid && game.turn !== "X") ||
      (game.playerO === uid && game.turn === "X")
    ) {
      interaction.followUp({ content: "Not your turn!", ephemeral: true });
      return;
    }

    if (game.board === null) return;

    try {
      const placingPlayer = game.turn as "X" | "O";

      game.board[placedRow][placedColumn].owner = placingPlayer;
      game.board[placedRow][placedColumn].isEmpty = false;
      game.turn = placingPlayer === "X" ? "O" : "X";

      applyModifier(
        game.board,
        game.modifier,
        placedRow,
        placedColumn,
        placingPlayer,
      );

      const winResult = hasWon(game.board);

      game.modifier = Math.floor(Math.random() * 15);
      console.log(`Modifier: ${game.modifier}`);

      if (game.isBoardFull()){
        await interaction.message.edit({
          embeds: game.createEmbeds(),
          components: [],
        });

        const bet = game.bet;
        const playerX = (await getUserData(game.playerX))[0];
        const playerO = (await getUserData(game.playerO))[0];

        await updateUserData(
          game.playerO,
          playerO.scraps += bet
        );
        await updateUserData(
          game.playerX,
          playerX.scraps += bet
        );

        game.remove();

        interaction.followUp(
          "Game over! Scrap bets have been automatically been handled. (TIE)",
        );

        return;
      }

      if (winResult?.winner) {
        await interaction.message.edit({
          embeds: game.createEmbeds(),
          components: [],
        });

        const bet = game.bet;
        const playerX = (await getUserData(game.playerX))[0];
        const playerO = (await getUserData(game.playerO))[0];

        await updateUserData(
          game.playerO,
          winResult.winner === "O" ? playerO.scraps + (bet * 2) : playerO.scraps,
        );
        await updateUserData(
          game.playerX,
          winResult.winner === "X" ? playerX.scraps + (bet * 2) : playerX.scraps,
        );

        game.remove();

        interaction.followUp(
          "Game over! Scrap bets have been automatically been handled.",
        );
        return;
      }

      await interaction.message.edit({
        embeds: game.createEmbeds(),
        components: game.createButtons(),
      });
    } catch (error) {
      console.error("move failed:", error);
      interaction.followUp({
        content: "Something broke processing that move. Blame Typescript.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
