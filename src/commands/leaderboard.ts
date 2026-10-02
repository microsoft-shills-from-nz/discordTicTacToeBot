import { client } from "../index";
import { getUserLeaderboard } from "../../utils/db";
import { EmbedBuilder } from "discord.js";

export const data = {
  name: "leaderboard",
  description: "See the Tic Tac Toe leaderboard!",
} as const;

export const execute = async (interaction: any) => {
  await interaction.deferReply();

  const leaderboard = await getUserLeaderboard(10);

  let content = "";

  for (const user of leaderboard) {
    content += `**${(await client.users.fetch(String(user.uid))).username}:** ${user.scraps}\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle("Leaderboard")
    .setDescription(content);

  await interaction.followUp({
    embeds: [embed],
    ephemeral: false,
  });
};
