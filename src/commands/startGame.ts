import { ApplicationCommandOptionType } from "discord.js";
import { Game } from "../game";

export const data = {
    name: "startgame",
    description: "Start a game of Tic Tac Toe",
    options: [
        {
            name: "opponent",
            description: "Who do you want to play against?",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "bet",
            description: "How much you're betting",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
} as const;

export const execute = async (interaction: any) => {
    await interaction.deferReply();

    // DO SCRAP CHECKS HERE

    const opponent = interaction.options.getUser("opponent", true);
    new Game(interaction.user.id, opponent.id);
}