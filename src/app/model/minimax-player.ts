import { Player } from './player';
import { Game } from './game';
import { PlayerColor, PlayerColorUtil } from './player-color';
import { PlayerFactory } from './player-factory';
import * as _ from 'lodash';

interface MinimaxResult {
    position: { col: number, row: number };
    score: number;
}

/** Minimax is explaned in 'Coding Challenge 154': https://youtu.be/trKjYdBASyQ from the https://thecodingtrain.com  */
export class MinimaxPlayer implements Player {
    static scorToNameMap = {
        '-1': 'LOOS',
        1: 'WIN',
        0: 'DRAW',
    };

    public static factory: PlayerFactory = {
        name: 'Robot-Minimax',
        createPlayer: (game: Game, playerColor: PlayerColor, delayMillis = 300) => {
            return new MinimaxPlayer(game, playerColor, delayMillis);
        }
    };

    constructor(private game: Game, public playerColor: PlayerColor, private delayMillis: number) {
    }

    static minimax(game: Game, playerColor: PlayerColor): MinimaxResult {
        const currentPlayerColor = game.nextPlayerColor;
        const isMaximizing = playerColor === currentPlayerColor;
        const best: MinimaxResult = { position: { col: -1, row: -1 }, score: isMaximizing ? -Infinity : Infinity };
        const playGround = _.cloneDeep(game.playGround);
        playGround.forEach((column, col) => {
            column.forEach((cell, row) => {
                if (cell === PlayerColor.FREE) {
                    if (!game.move(currentPlayerColor, col, row)) {
                        console.log('current playground: ', game.playGround);
                        throw new Error(`move for player ${PlayerColor[currentPlayerColor]} to ${col}/${row} was not success.`);
                    }
                    const score = MinimaxPlayer.getScore(game, playerColor);

                    if (isMaximizing && score > best.score) {
                        best.score = score;
                        best.position = { col, row };
                    } else if (!isMaximizing && score < best.score) {
                        best.score = score;
                        best.position = { col, row };
                    }

                    if (!game.revertMove(currentPlayerColor, col, row)) {
                        console.log('current playground: ', game.playGround);
                        throw new Error(`move for player ${PlayerColor[currentPlayerColor]} to ${col}/${row} was not success.`);
                    }
                }
            });
        });
        return best;
    }

    static getScoreName(score: number): string {
        return this.scorToNameMap[score];
    }

    static getScore(game: Game, playerColor: PlayerColor): number {
        if (game.isGameFinished()) {
            const winner = game.findWinner();

            if (winner === playerColor) {
                // console.log(`Winner: ${PlayerColor[winner]}; player: ${PlayerColor[playerColor]}`);
                return 1;
            } else if (winner === PlayerColorUtil.opposite(playerColor)) {
                return -1;
            } else {
                return 0;
            }
        } else {
            return MinimaxPlayer.minimax(game, playerColor).score;
        }
    }

    async move(): Promise<void> {
        // get free Cells for possible moves
        const best: MinimaxResult = MinimaxPlayer.minimax(this.game.copy(), this.playerColor);

        // apply small delay for nicer play-animations.
        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, best.position.col, best.position.row);
                resolve();
            }, this.delayMillis);
        });
    }
}
