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
		return `
        <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>\n
        <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>\n
        <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>\n
        <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>  <:base:1555580885619708039>\n
        `;
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
