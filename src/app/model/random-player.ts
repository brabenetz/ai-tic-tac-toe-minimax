import { Player } from './player';
import { Game } from './game';
import { PlayerColor } from './player-color';
import { PlayerFactory } from './player-factory';

export class RandomPlayer implements Player {
    public static factory: PlayerFactory = {
        name: 'Robot-Random',
        createPlayer: (game: Game, playerColor: PlayerColor) => {
            return new RandomPlayer(game, playerColor, 300);
        }
    };

    constructor(private game: Game, public playerColor: PlayerColor, private delayMillis: number) {
    }

    async move(): Promise<void> {
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

        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, selectedCell.col, selectedCell.row);
                resolve();
            }, this.delayMillis);
        });
    }
}
