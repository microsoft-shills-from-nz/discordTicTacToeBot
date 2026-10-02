import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";
import { Game } from "./game";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: any) => {
	client.application.commands.create(startGame.data);
});

client.on(Events.InteractionCreate, async (interaction: any) => {
	if (interaction.isChatInputCommand() && interaction.commandName === startGame.data.name)
		startGame.execute(interaction);

	if (interaction.isButton()) {
		const gameId = interaction.customId.split("/")[1];
		const x = interaction.customId.split(":")[1].split("/")[0].split(",")[0];
		const y = interaction.customId.split(":")[1].split("/")[0].split(",")[1];

		await interaction.deferUpdate();

		const game = Game.games.find((game: Game) => game.id === gameId);

		if (game) {
			interaction.followUp({ content: "An active game :)", ephemeral: true });
		} else {
			interaction.followUp({ content: "Not an active game :(", ephemeral: true });
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
