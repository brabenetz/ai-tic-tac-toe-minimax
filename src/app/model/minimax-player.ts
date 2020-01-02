import { Player } from './player';
import { Game } from './game';
import { PlayerColor, PlayerColorUtil } from './player-color';
import { PlayerFactory } from './player-factory';
import * as _ from 'lodash';

interface MinimaxResult {
    scores: number[][];
    bestPosition: { col: number, row: number };
    bestScore: number;
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

    static minimax(game: Game, playerColor: PlayerColor, depth = 0): MinimaxResult {
        const currentPlayerColor = game.nextPlayerColor;
        const isMaximizing = playerColor === currentPlayerColor;
        const result: MinimaxResult = {
            scores: new Array(game.cols).fill(undefined).map(() => new Array(game.rows)),
            bestPosition: { col: -1, row: -1 },
            bestScore: isMaximizing ? -Infinity : Infinity
        };
        if (game.isGameFinished()) {
            return result;
        }

        // console.log('init scores: ', result.scores);
        const playGround = _.cloneDeep(game.playGround);
        playGround.forEach((column, col) => {
            column.forEach((cell, row) => {
                if (cell === PlayerColor.FREE) {
                    // make move without TRAKING history
                    game.nextPlayerColor = PlayerColorUtil.opposite(currentPlayerColor);
                    game.playGround[col][row] = currentPlayerColor;
                    // if (!game.move(currentPlayerColor, col, row)) {
                    //     console.log('current playground: ', game.playGround);
                    //     throw new Error(`move for player ${PlayerColor[currentPlayerColor]} to ${col}/${row} was not success.`);
                    // }

                    const score = MinimaxPlayer.getScore(game, playerColor, depth);

                    result.scores[col][row] = score;
                    if (isMaximizing && score > result.bestScore) {
                        result.bestScore = score;
                        result.bestPosition = { col, row };
                    } else if (!isMaximizing && score < result.bestScore) {
                        result.bestScore = score;
                        result.bestPosition = { col, row };
                    }
                    // revert move
                    game.playGround[col][row] = PlayerColor.FREE;
                    game.nextPlayerColor = currentPlayerColor;
                    game.resetFindWinner();
                    // if (!game.revertMove(currentPlayerColor, col, row)) {
                    //     console.log('current playground: ', game.playGround);
                    //     throw new Error(`move for player ${PlayerColor[currentPlayerColor]} to ${col}/${row} was not success.`);
                    // }
                }
            });
        });
        if (Math.round(result.bestScore) === 0) {
            // small correction: prefer moves with higher chance to win and lower chance to loss:
            _.flatten(result.scores).forEach((prediction) => {
                if (prediction !== undefined) {
                    if (isMaximizing) {
                        result.bestScore -= (prediction * 0.001);
                    } else {
                        result.bestScore += (prediction * 0.001);
                    }
                }
            });
        }
        result.bestScore = _.round(result.bestScore, 5);

        return result;
    }

    static getScoreName(score: number): string {
        return this.scorToNameMap[Math.round(score)];
    }

    static getScore(game: Game, playerColor: PlayerColor, depth: number): number {
        if (game.isGameFinished()) {
            // depthCorrection: prefer shorter games: win faster or loss slower
            const depthCorrection = .4 - (0.001 * depth);
            const winner = game.findWinner();

            if (winner === playerColor) {
                // console.log(`Winner: ${PlayerColor[winner]}; player: ${PlayerColor[playerColor]}`);
                return 1 + depthCorrection;
            } else if (winner === PlayerColorUtil.opposite(playerColor)) {
                return -1 - depthCorrection;
            } else {
                return 0;
            }
        } else {
            return MinimaxPlayer.minimax(game, playerColor, depth + 1).bestScore;
        }
    }

    async move(): Promise<void> {
        // get free Cells for possible moves
        const minimax: MinimaxResult = MinimaxPlayer.minimax(this.game.copy(), this.playerColor, 0);

        // apply small delay for nicer play-animations.
        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, minimax.bestPosition.col, minimax.bestPosition.row);
                resolve();
            }, this.delayMillis);
        });
    }
}
