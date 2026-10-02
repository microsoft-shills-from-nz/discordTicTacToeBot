import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { Board } from "../utils/types";

export class Game {
	board: Board | null = [
		[
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
		],
		[
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
		],
		[
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
		],
		[
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
			{ owner: null, isEmpty: true, powerUp: null },
		],
	];
	turn = "X";
	id = Math.random().toString(36).substring(2, 15);

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
		return { board: responseBoard, status: true };
	}

	createButtons(): ActionRowBuilder<ButtonBuilder>[] {
		const row0 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`play:0,0/${this.id}`)
				.setLabel("0, 0")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:0,1/${this.id}`)
				.setLabel("0, 1")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:0,2/${this.id}`)
				.setLabel("0, 2")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:0,3/${this.id}`)
				.setLabel("0, 3")
				.setStyle(ButtonStyle.Secondary),
		);
		const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`play:1,0/${this.id}`)
				.setLabel("1, 0")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:1,1/${this.id}`)
				.setLabel("1, 1")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:1,2/${this.id}`)
				.setLabel("1, 2")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:1,3/${this.id}`)
				.setLabel("1, 3")
				.setStyle(ButtonStyle.Secondary),
		);
		const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`play:2,0/${this.id}`)
				.setLabel("2, 0")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:2,1/${this.id}`)
				.setLabel("2, 1")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:2,2/${this.id}`)
				.setLabel("2, 2")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:2,3/${this.id}`)
				.setLabel("2, 3")
				.setStyle(ButtonStyle.Secondary),
		);
		const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`play:3,0/${this.id}`)
				.setLabel("3, 0")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:3,1/${this.id}`)
				.setLabel("3, 1")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:3,2/${this.id}`)
				.setLabel("3, 2")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId(`play:3,3/${this.id}`)
				.setLabel("3, 3")
				.setStyle(ButtonStyle.Secondary),
		);
		return [row0, row1, row2, row3];
	}
}
