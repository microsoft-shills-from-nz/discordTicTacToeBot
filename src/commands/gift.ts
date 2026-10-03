import { giftScraps } from "../../utils/db";
import { client } from "../index";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export const data = {
	name: "gift",
	description: "Gift scraps to a user!",
	options: [
		{
			name: "user",
			description: "Who do you want to give scraps to?",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "amount",
			description: "How much scraps do you want to give?",
			type: ApplicationCommandOptionType.Integer,
			required: true,
			min_value: 0,
		},
	],
} as const;

export const execute = async (interaction: any) => {
	await interaction.deferReply();

	giftScraps(
		interaction.user.id,
		interaction.options.getUser("user").id,
		interaction.options.getInteger("amount"),
	);

	let content = `You have gifted ${interaction.options.getInteger("amount")} scraps to ${interaction.options.getUser("user").username}!`;

	const embed = new EmbedBuilder().setTitle("Leaderboard").setDescription(content);

	await interaction.followUp({
		embeds: [embed],
		ephemeral: false,
	});
};
