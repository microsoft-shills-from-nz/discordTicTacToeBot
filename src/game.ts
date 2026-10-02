export class Game {
    board: string[] = Array(9).fill("-");
    turn = "X";

    static games: Game[] = [];

    constructor(public playerX: string, public playerO: string){
        Game.games.push(this);
    }
}