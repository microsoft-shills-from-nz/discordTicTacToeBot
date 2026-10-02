import { Client, Events, GatewayIntentBits } from "discord.js";
import * as startGame from "./commands/startGame";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (client) => {
    client.application.commands.create(startGame.data);
});

client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand() && interaction.commandName === startGame.data.name) startGame.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);