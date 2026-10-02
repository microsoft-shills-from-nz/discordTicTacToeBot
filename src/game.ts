import { EmbedBuilder } from "discord.js";

export class Game {
    board: Placement[] = Array(16).fill(null);
    turn = "X";

    static games: Game[] = [];

    constructor(public playerX: string, public playerO: string){
        Game.games.push(this);
    }

    createEmbeds(): EmbedBuilder[] {
        let board = new EmbedBuilder()
            .setDescription(`${this.createBoard()}\n`);

        return [board];
    }

    createBoard(): string {
        
    }
}

enum Behaviour { None, ShiftUp, ShiftLeft, Replace, DestroyRndNearby, WipeRow, WipeColumn }

export type Placement = {
    value: string; // X or O
    behaviour: Behaviour;
}