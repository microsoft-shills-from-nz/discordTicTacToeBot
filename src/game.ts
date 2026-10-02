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
	bet = 0;
	modifier = 999;

	static games: Game[] = [];

    remove() {
    const gameIndex = Game.games.indexOf(this);
        if (gameIndex !== -1) {
            Game.games.splice(gameIndex, 1);
        }
    }

	constructor(
		public playerX: string,
		public playerO: string,
	) {
		Game.games.push(this);
	}

	createEmbeds(): EmbedBuilder[] {
		let board = new EmbedBuilder().setDescription(`${this.createBoard().board}\n`);
		let dialog = new EmbedBuilder().setDescription(`${this.createDialog()}\n`);

		return [board, dialog];
	}

    createDialog(board: Board | null = this.board): string {
        let dialog;
        switch (this.modifier){
            case 0: {
                dialog = "**FALLEN:** All items in the same column will fall 1 tile.";
                break;
            }
            case 1: {
                dialog = "**SHIFT:** All items in the same row will shift 1 tile to the left.";
                break;
            }
            case 2: {
                dialog = "**REPLACE:** Replace any of your opponent's placements.";
                break;
            }
            case 3: {
                dialog = "**ANARCHY:** Destroy a random opponent placement.";
                break;
            }
            case 4: {
                dialog = "**NUKE:** Destroy all items in the same row";
                break;
            }
            case 5: {
                dialog = "**SEAMINE:** Destroy all items in the same column";
                break;
            }
            default: {
                dialog = "No modifiers.";
                break;
            }
        }
        if (this.bet !== null)
            dialog += `\nBet: ${this.bet}`;

        return dialog;
    }

	createBoard(board: Board | null = this.board): { board: string; status: boolean } {
		let responseBoard = "";

		if (board === null) {
			return { board: "", status: false };
		}

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
        switch (j) {
          case 0:
       			if (board[i][j].owner === "O") {
              responseBoard += "# <:o_:1555584951964008499>  ";
            } else if (board[i][j].owner === "X") {
              responseBoard += "# <:x_:1555584949392769225>  ";
            } else {
              responseBoard += "# <:base:1555580885619708039>  ";
              }
            break
          case 3:
       			if (board[i][j].owner === "O") {
              responseBoard += "<:o_:1555584951964008499>\n";
            } else if (board[i][j].owner === "X") {
                responseBoard += "<:x_:1555584949392769225>\n";
            } else {
                responseBoard += "<:base:1555580885619708039>\n";
              }
            break
          default:
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
		const activePlayer = this.turn === "X" ? this.playerX : this.playerO;
		responseBoard += `\n<@${activePlayer}>'s turn!`;
		return { board: responseBoard, status: true };
	}

	checkDisabled(rowNumber: number, columnNumber: number): boolean {
		if (this.board === null || this.modifier === 2) return false;
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
