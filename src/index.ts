import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client: any) => {
	client.application.commands.create(startGame.data);
});

client.on(Events.InteractionCreate, (interaction: any) => {
	if (interaction.isChatInputCommand() && interaction.commandName === startGame.data.name)
		startGame.execute(interaction);

	if (interaction.isButton()) {
		const gameId = interaction.customId.split("/")[1];
		const x = interaction.customId.split(":")[1].split("/")[0].split(",")[0];
		const y = interaction.customId.split(":")[1].split("/")[0].split(",")[1];

		console.log("gameId: ", gameId);
		console.log("x: ", x);
		console.log("y: ", y);
	}
});

client.login(process.env.DISCORD_TOKEN);
