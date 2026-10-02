import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { Board } from "../utils/types";

export class Game {
	board: Board | null = [
		[
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
		],
		[
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
		],
		[
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
		],
		[
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
			{ owner: "O", isEmpty: false, powerUp: null },
			{ owner: "X", isEmpty: false, powerUp: null },
		],
	];
	turn = "X";

	static games: Game[] = [];

	constructor(
		public playerX: string,
		public playerO: string,
	) {
		Game.games.push(this);
	}

	createEmbeds(): EmbedBuilder[] {
		let board = new EmbedBuilder().setDescription(`${this.createBoard().board}\n`);

		return [board];
	}

	createBoard(board: Board | null = this.board): { board: string; status: boolean } {
		let responseBoard = "";

		if (board === null) {
			return { board: "", status: false };
		}

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (j === 0) {
					if (board[i][j].owner === "O") {
						responseBoard += "# <:o_:1555584951964008499>  ";
					} else if (board[i][j].owner === "X") {
						responseBoard += "# <:x_:1555584949392769225>  ";
					} else {
						responseBoard += "# <:base:1555580885619708039>  ";
					}
				} else if (j === 3) {
					if (board[i][j].owner === "O") {
						responseBoard += "<:o_:1555584951964008499>\n";
					} else if (board[i][j].owner === "X") {
						responseBoard += "<:x_:1555584949392769225>\n";
					} else {
						responseBoard += "<:base:1555580885619708039>\n";
					}
				} else {
					if (board[i][j].owner === "O") {
						responseBoard += "<:o_:1555584951964008499>  ";
					} else if (board[i][j].owner === "X") {
						responseBoard += "<:x_:1555584949392769225>  ";
					} else {
						responseBoard += "<:base:1555580885619708039>  ";
					}
				}
			}
		}

        createButtons() {
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("accept")
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("decline")
                    .setLabel("Decline")
                    .setStyle(ButtonStyle.Danger),
            );
            return row;
        }

		return { board: responseBoard, status: true };
	}
}
