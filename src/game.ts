import { EmbedBuilder } from "discord.js";
import type { Board } from "../utils/types";

export class Game {
	board: Board | null = null;
	turn = "X";

	static games: Game[] = [];

	constructor(
		public playerX: string,
		public playerO: string,
	) {
		Game.games.push(this);
	}

	createEmbeds(): EmbedBuilder[] {
		let board = new EmbedBuilder().setDescription(`${this.createBoard()}\n`);

		return [board];
	}

	createBoard(): string {
		let board = "";
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (j === 0) {
					board += "# <:base:1555580885619708039>  ";
				} else if (j === 3) {
					board += "<:base:1555580885619708039>\n";
				} else {
					board += "<:base:1555580885619708039>  ";
				}
			}
		}

		return board;
	}
}

enum Behaviour {
	None,
	ShiftUp,
	ShiftLeft,
	Replace,
	DestroyRndNearby,
	WipeRow,
	WipeColumn,
}

export type Placement = {
	value: string; // X or O
	behaviour: Behaviour;
};
