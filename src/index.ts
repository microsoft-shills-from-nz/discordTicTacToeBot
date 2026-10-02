import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";
import { Game } from "./game";
import { hasWon } from "../utils/win";
import { getUserData, updateUserData } from "../utils/db";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: any) => {
	client.application.commands.create(startGame.data);
});

client.on(Events.InteractionCreate, async (interaction: any) => {
	if (interaction.isChatInputCommand() && interaction.commandName === startGame.data.name)
		startGame.execute(interaction);

	if (interaction.isButton()) {
		if (interaction.customId.split(":")[0] === "play") {
			const uid = interaction.user.id;
			const gameId = interaction.customId.split("/")[1];
			const x = interaction.customId.split(":")[1].split("/")[0].split(",")[0];
			const y = interaction.customId.split(":")[1].split("/")[0].split(",")[1];

			await interaction.deferUpdate();

			const game = Game.games.find((game: Game) => game.id === gameId);

			if (game) {
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
					interaction.followUp({
						content: "Not your turn!",
						ephemeral: true,
					});
					return;
				}
				if (game.board === null) return;
				game.board[x][y].owner = game.turn as "X" | "O" | null;
				game.board[x][y].isEmpty = false;
				game.turn = game.turn === "X" ? "O" : "X";

				if (hasWon(game.board)?.winner !== null) {
					const bet = game.bet;
					const playerX = (await getUserData(game.playerX))[0];
					const playerO = (await getUserData(game.playerO))[0];
					updateUserData(
						game.playerO,
						hasWon(game.board)?.winner === "O" ? playerO.scraps + bet : playerO.scraps,
					);
					updateUserData(
						game.playerX,
						hasWon(game.board)?.winner === "X" ? playerX.scraps + bet : playerX.scraps,
					);

					interaction.message.edit({
						embeds: game.createEmbeds(),
						components: game.createButtons(),
					});
				} else {
					interaction.message.edit({
						embeds: game.createEmbeds(),
						components: game.createButtons(),
					});
				}
			} else {
				interaction.followUp({ content: "Not an active game :(", ephemeral: true });
			}
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
