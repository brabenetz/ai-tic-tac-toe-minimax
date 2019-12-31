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
            const best = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            expect(best.score).toEqual(1);
            expect(best.position).toEqual({ col: 2, row: 1 });
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
            const best = MinimaxPlayer.minimax(game.copy(), PlayerColor.RED);

            expect(best.score).toEqual(0);
            expect(best.position).toEqual({ col: 0, row: 1 });
        });
        it('returns best available solution to get at least a draw', async () => {
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

            // console.log('PlayerGround', game.playGround);
            const best = MinimaxPlayer.minimax(game.copy(), PlayerColor.GREEN);

            // console.log('result', best);
            expect(best.score).toEqual(0);
            expect(best.position).toEqual({ col: 2, row: 1 });
        });
    });
});
