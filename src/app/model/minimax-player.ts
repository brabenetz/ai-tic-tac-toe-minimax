import { Player } from './player';
import { Game } from './game';
import { PlayerColor, PlayerColorUtil } from './player-color';
import { PlayerFactory } from './player-factory';
import * as NodeCache from 'node-cache';
import * as _ from 'lodash';

interface MinimaxResult {
    scores: number[][];
    bestPosition: { col: number, row: number };
    bestScore: number;
}
interface MinimaxOptions {
    withDepthAdjustment: boolean;
    withDrawAdjustment: boolean;
}

/** Minimax is explaned in 'Coding Challenge 154': https://youtu.be/trKjYdBASyQ from the https://thecodingtrain.com  */
export class MinimaxPlayer implements Player {
    static scorToNameMap = {
        '-1': 'LOOS',
        1: 'WIN',
        0: 'DRAW',
    };

    private static myCache = new NodeCache();
    public static factory: PlayerFactory = MinimaxPlayer.createFactory(
        'Robot-Minimax', 300, { withDepthAdjustment: true, withDrawAdjustment: true });

    public static createFactory(name: string, delayMillis: number, minimaxOptions: MinimaxOptions): PlayerFactory {
        return {
            name,
            createPlayer: (game: Game, playerColor: PlayerColor) => {
                return new MinimaxPlayer(game, playerColor, delayMillis, minimaxOptions);
            }
        };
    }

    constructor(private game: Game, public playerColor: PlayerColor, private delayMillis: number, private minimaxOptions: MinimaxOptions) {
    }

    static minimax(
        game: Game, playerColor: PlayerColor,
        depth = 0, minimaxOptions = { withDepthAdjustment: true, withDrawAdjustment: true }): MinimaxResult {

        const cacheKey = [
            PlayerColor[playerColor],
            ...game.playGround,
            minimaxOptions.withDepthAdjustment, minimaxOptions.withDrawAdjustment
        ].toString();
        const cachedResult: MinimaxResult = this.myCache.get(cacheKey);
        if (cachedResult !== undefined) {
            return cachedResult;
        }

        const currentPlayerColor = game.nextPlayerColor;
        const isMaximizing = playerColor === currentPlayerColor;
        const result: MinimaxResult = {
            scores: new Array(game.cols).fill(undefined).map(() => new Array(game.rows)),
            bestPosition: { col: -1, row: -1 },
            bestScore: isMaximizing ? -Infinity : Infinity
        };
        if (game.isGameFinished()) {
            this.myCache.set(cacheKey, result);
            return result;
        }

        // console.log('init scores: ', result.scores);
        const playGround = _.cloneDeep(game.playGround);
        playGround.forEach((column, col) => {
            column.forEach((cell, row) => {
                if (cell === PlayerColor.FREE) {
                    // make move without TRAKING history (is a little bit faster)
                    game.nextPlayerColor = PlayerColorUtil.opposite(currentPlayerColor);
                    game.playGround[col][row] = currentPlayerColor;
                    // if (!game.move(currentPlayerColor, col, row)) {
                    //     console.log('current playground: ', game.playGround);
                    //     throw new Error(`move for player ${PlayerColor[currentPlayerColor]} to ${col}/${row} was not success.`);
                    // }

                    const score = MinimaxPlayer.getScore(game, playerColor, depth, minimaxOptions);

                    result.scores[col][row] = score;
                    if (isMaximizing && score > result.bestScore) {
                        result.bestScore = score;
                        result.bestPosition = { col, row };
                    } else if (!isMaximizing && score < result.bestScore) {
                        result.bestScore = score;
                        result.bestPosition = { col, row };
                    }
                    // revert move without un-traking history
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

        if (minimaxOptions.withDrawAdjustment) {
            // small correction if prediction is DRAW, adjust it by count the possible wins or loses of all scores
            // In other words: hoping the opponent makes NOT the best move.
            if (Math.round(result.bestScore) === 0) {
                // small correction: prefer moves with higher chance to win and lower chance to loss:
                _.flatten(result.scores).forEach((prediction) => {
                    if (prediction !== undefined) {
                        if (!isMaximizing) {
                            // only count opposite possibilities to lose, because minimax itself will always do the best move.
                            result.bestScore += (Math.round(prediction) * 0.001);
                        }
                    }
                });
            }
            result.bestScore = _.round(result.bestScore, 5);
        }

        this.myCache.set(cacheKey, result);
        return result;
    }

    static getScoreName(score: number): string {
        return this.scorToNameMap[Math.round(score)];
    }

    static getScore(game: Game, playerColor: PlayerColor, depth: number, minimaxOptions: MinimaxOptions): number {
        if (game.isGameFinished()) {
            // depthCorrection: prefer shorter games: win faster or loss slower
            let depthCorrection = 0;
            if (minimaxOptions.withDepthAdjustment) {
                depthCorrection = .4 - (0.001 * depth);
            }
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
            return MinimaxPlayer.minimax(game, playerColor, depth + 1, minimaxOptions).bestScore;
        }
    }

    async move(): Promise<void> {
        // get free Cells for possible moves
        const minimax: MinimaxResult = MinimaxPlayer.minimax(this.game.copy(), this.playerColor, 0, this.minimaxOptions);

        // apply small delay for nicer play-animations.
        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, minimax.bestPosition.col, minimax.bestPosition.row);
                resolve();
            }, this.delayMillis);
        });
    }
}
