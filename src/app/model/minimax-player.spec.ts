import { MinimaxPlayer } from './minimax-player';
import { TicTacToeGame } from './tic-tac-toe-game';
import { PlayerColor } from './player-color';

describe('MinimaxPlayer', () => {
    it('should create an instance', () => {
        const game = new TicTacToeGame();
        expect(new MinimaxPlayer(game, PlayerColor.RED, 0)).toBeTruthy();
    });
    describe('gameplay', () => {
        it('returns only available solution with right score for win', async () => {
            // Scenario (x=RED, 0=GREEN):
            // x o o
            // o o x
            // x   x
            const game = new TicTacToeGame();
            game.move(PlayerColor.RED, 0, 0);
            game.move(PlayerColor.GREEN, 1, 1);
            game.move(PlayerColor.RED, 2, 2);
            game.move(PlayerColor.GREEN, 1, 0);
            game.move(PlayerColor.RED, 1, 2);
            game.move(PlayerColor.GREEN, 0, 2);
            game.move(PlayerColor.RED, 2, 0);
            game.move(PlayerColor.GREEN, 0, 1);

            // console.log('PlayerGround', game.playGround);
            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            expect(result.bestScore).toEqual(1);
            expect(result.bestPosition).toEqual({ col: 2, row: 1 });
        });
        it('returns only available solution with right score for draw', async () => {
            // Scenario (x=RED, 0=GREEN):
            // x   o
            // o o x
            // x o x
            const game = new TicTacToeGame();
            game.move(PlayerColor.RED, 0, 0);
            game.move(PlayerColor.GREEN, 1, 1);
            game.move(PlayerColor.RED, 2, 2);
            game.move(PlayerColor.GREEN, 1, 0);
            game.move(PlayerColor.RED, 1, 2);
            game.move(PlayerColor.GREEN, 0, 2);
            game.move(PlayerColor.RED, 2, 0);
            game.move(PlayerColor.GREEN, 2, 1);

            // console.log('PlayerGround', game.playGround);
            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            expect(result.bestScore).toEqual(0);
            expect(result.bestPosition).toEqual({ col: 0, row: 1 });
        });
        it('returns only available solution to get at least a draw from 2 left choices', async () => {
            // Scenario (x=RED, 0=GREEN):
            // x   o
            // o o x
            // x   x
            const game = new TicTacToeGame();
            game.move(PlayerColor.RED, 0, 0);
            game.move(PlayerColor.GREEN, 1, 1);
            game.move(PlayerColor.RED, 2, 2);
            game.move(PlayerColor.GREEN, 1, 0);
            game.move(PlayerColor.RED, 1, 2);
            game.move(PlayerColor.GREEN, 0, 2);
            game.move(PlayerColor.RED, 2, 0);

            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.GREEN);

            // console.log('result', result);
            expect(result.bestScore).toEqual(0);
            expect(result.bestPosition).toEqual({ col: 2, row: 1 });
        });
        it('returns only available solution to get at least a draw from 8 left choices', async () => {
            // Scenario (x=RED, 0=GREEN): opposite starts in the corner, The only way to not loss is in the middle
            const game = new TicTacToeGame();
            game.move(PlayerColor.RED, 0, 0);

            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.GREEN);

            // console.log('result', result);
            expect(result.bestScore).toEqual(0);
            expect(result.bestPosition).toEqual({ col: 1, row: 1 });
        });
        it('returns result available solution to win', async () => {
            // Scenario (x=RED, 0=GREEN):
            // x x
            //   o
            //   o
            const game = new TicTacToeGame();
            game.move(PlayerColor.RED, 0, 0);
            game.move(PlayerColor.GREEN, 1, 1);
            game.move(PlayerColor.RED, 0, 1);
            game.move(PlayerColor.GREEN, 2, 1);

            // console.log('PlayerGround', game.playGround);
            // game.playGround.forEach(line => {
            //     console.log('\t\t\t' + line);
            // });
            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            // console.log('result', result);
            expect(result.bestScore).toEqual(1);
            expect(result.bestPosition).toEqual({ col: 0, row: 2 });
        });
        it('returns values for an empty board', async () => {
            // Scenario: Empty Playground
            const game = new TicTacToeGame();

            // console.log('PlayerGround', game.playGround);
            // game.playGround.forEach(line => {
            //     console.log('\t\t\t' + line);
            // });
            const result = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            // console.log('result', result);
            expect(result.bestScore).toEqual(0);
            expect(result.bestPosition).toEqual({ col: 0, row: 0 });
        });
    });
});
