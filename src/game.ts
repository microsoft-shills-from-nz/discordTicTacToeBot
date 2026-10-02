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

	checkDisabled(rowNumber: number, columnNumber: number): boolean {
		if (this.board === null) return false;
		return !this.board[rowNumber][columnNumber].isEmpty;
	}

	createRow(rowNumber: number): ActionRowBuilder<ButtonBuilder> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`play:${rowNumber},0/${this.id}`)
				.setLabel(`0, ${rowNumber}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(this.checkDisabled(rowNumber, 0)),
			new ButtonBuilder()
				.setCustomId(`play:${rowNumber},1/${this.id}`)
				.setLabel(`1, ${rowNumber}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(this.checkDisabled(rowNumber, 1)),
			new ButtonBuilder()
				.setCustomId(`play:${rowNumber},2/${this.id}`)
				.setLabel(`2, ${rowNumber}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(this.checkDisabled(rowNumber, 2)),
			new ButtonBuilder()
				.setCustomId(`play:${rowNumber},3/${this.id}`)
				.setLabel(`3, ${rowNumber}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(this.checkDisabled(rowNumber, 3)),
		);
	}

	createButtons(): ActionRowBuilder<ButtonBuilder>[] {
		return [this.createRow(0), this.createRow(1), this.createRow(2), this.createRow(3)];
	}
}
