import { client } from "../index";
import { getUserLeaderboard } from "../../utils/db";

export const data = {
	name: "leaderboard",
	description: "See the Tic Tac Toe leaderboard!",
} as const;

export const execute = async (interaction: any) => {
	await interaction.deferReply();

	const leaderboard = await getUserLeaderboard(10);

	let content = "";

	for (const user of leaderboard) {
		content += `**${(await client.users.fetch(user.uid)).username}:** ${user.scraps}\n`;
	}

	const embed = new client.EmbedBuilder().setTitle("Leaderboard").setDescription(content);

	await interaction.followUp({
		embed,
		ephemeral: false,
	});
};
