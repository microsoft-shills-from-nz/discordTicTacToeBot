import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";
import * as leaderboard from "./commands/leaderboard";
import { Game } from "./game";
import { hasWon } from "../utils/win";
import { getUserData, updateUserData } from "../utils/db";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: any) => {
	client.application.commands.create(startGame.data);
	client.application.commands.create(leaderboard.data);
});

client.on(Events.InteractionCreate, async (interaction: any) => {
	if (interaction.isChatInputCommand() && interaction.commandName === startGame.data.name)
		startGame.execute(interaction);

	if (
		interaction.isChatInputCommand() &&
		interaction.commandName === leaderboard.data.name
	)
		leaderboard.execute(interaction);

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

				const powerUp = Math.floor(Math.random() * 6);

				game.currentPowerUp = powerUp;
				if (powerUp === 0) {
					game.board[x][y].powerUp = "upShift";
					for (let i = 0; i < 4; i++) {
						let cellBelow = game.board[x][i + 1];
						if (i === 4) cellBelow = game.board[x][0];
						game.board[x][i].owner = cellBelow.owner;
						game.board[x][i].isEmpty = cellBelow.isEmpty;
					}
				} else if (powerUp === 1) {
					game.board[x][y].powerUp = "leftShift";
					for (let i = 0; i < 4; i++) {
						let cellToTheRight = game.board[x][i + 1];
						if (i === 4) cellToTheRight = game.board[x][0];
						game.board[x][i].owner = cellToTheRight.owner;
						game.board[x][i].isEmpty = cellToTheRight.isEmpty;
					}
				} else if (powerUp === 2) {
					game.board[x][y].powerUp = "replace";
					const possableTargets = [];
					for (const cellRow of game.board) {
						for (const cell of cellRow) {
							possableTargets.push(cell);
						}
					}
					const target =
						possableTargets[Math.floor(Math.random() * possableTargets.length)];
					target.owner = null;
					target.isEmpty = true;
				} else if (powerUp === 3) {
					game.board[x][y].powerUp = "destroy";
					const possableTargets = [];
					for (const cellRow of game.board) {
						for (const cell of cellRow) {
							if (cell.owner === null) continue;
							if (cell.owner === game.turn) continue;
							possableTargets.push(cell);
						}
					}
					const target =
						possableTargets[Math.floor(Math.random() * possableTargets.length)];
					target.owner = null;
					target.isEmpty = true;
				} else if (powerUp === 4) {
					game.board[x][y].powerUp = "wipeRow";
					for (let i = 0; i < 4; i++) {
						if (i === y) continue;
						game.board[x][i].owner = null;
						game.board[x][i].isEmpty = true;
					}
				} else if (powerUp === 5) {
					game.board[x][y].powerUp = "wipeCol";
					for (let i = 0; i < 4; i++) {
						if (i === x) continue;
						game.board[i][y].owner = null;
						game.board[i][y].isEmpty = true;
					}
				}

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
