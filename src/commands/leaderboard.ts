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
		content += `${user.uid}: ${user.scraps}\n`;
	}

	await interaction.followUp({
		content,
		ephemeral: false,
	});
};
