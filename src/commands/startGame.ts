import { ApplicationCommandOptionType } from "discord.js";
import { Game } from "../game";
import { getUserData, updateUserData } from "../../utils/db";

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
      required: false,
      min_value: 0,
    },
  ],
} as const;

export const execute = async (interaction: any) => {
  await interaction.deferReply();

  const opponent = interaction.options.getUser("opponent", true);
  let game = new Game(interaction.user.id, opponent.id);

  const bet = interaction.options.getInteger("bet");
  if (bet < 0) {
    await interaction.followUp({
      content: "Bet must be a positive number!",
      ephemeral: true,
    });
    return;
  }

  const userScaps = (await getUserData(interaction.user.id))[0].scraps;
  const opponentScaps = (await getUserData(opponent.id))[0].scraps;

  if (userScaps < bet) {
    await interaction.followUp({
      content: `You don't have enough scraps! (${(await getUserData(interaction.user.id))[0].scraps}/${bet})`,
      ephemeral: true,
    });
    return;
  }

  if (opponentScaps < bet) {
    await interaction.followUp({
      content: `Your opponent doesn't have enough scraps! (${(await getUserData(opponent.id))[0].scraps}/${bet})`,
      ephemeral: true,
    });
    return;
  }

  game.bet = bet;

  updateUserData(interaction.user.id, userScaps - bet);
  updateUserData(opponent.id, opponentScaps - bet);

  await interaction.followUp({
    embeds: game.createEmbeds(),
    components: game.createButtons(),
  });
};
