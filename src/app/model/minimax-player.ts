import { Player } from './player';
import { Game } from './game';
import { PlayerColor } from './player-color';
import { PlayerFactory } from './player-factory';

/** Minimax is explaned in 'Coding Challenge 154': https://youtu.be/trKjYdBASyQ from the https://thecodingtrain.com  */
export class MinimaxPlayer implements Player {
    public static factory: PlayerFactory = {
        name: 'Robot-Minimax',
        createPlayer: (game: Game, playerColor: PlayerColor, delayMillis = 300) => {
            return new MinimaxPlayer(game, playerColor, delayMillis);
        }
    };

    constructor(private game: Game, public playerColor: PlayerColor, private delayMillis: number) {
    }

    async move(): Promise<void> {
        // get free Cells for possible moves
        const freeCells: { col: number, row: number }[] = [];
        this.game.playGround.forEach((line, col) => {
            line.forEach((cell, row) => {
                if (cell === PlayerColor.FREE) {
                    freeCells.push({ col, row });
                }
            });
        });

        // pick a random free Cell:
        const selectedCell = freeCells[Math.floor(Math.random() * freeCells.length)];

        // apply small delay for nicer play-animations.
        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, selectedCell.col, selectedCell.row);
                resolve();
            }, this.delayMillis);
        });
    }
}