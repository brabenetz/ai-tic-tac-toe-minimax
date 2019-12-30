import { Game } from './game';
import { PlayerColor, PlayerColorUtil } from './player-color';
import { GameSnapshot } from './game-snapshot';


export class TicTacToeGame implements Game {
    /** Maximum numbers of Moves to prevent endless games because of dump players only move on invalid field. */
    static MAX_MOVES = 12;

    rows = 3;
    cols = 3;
    history: GameSnapshot[];
    playGround: PlayerColor[][];
    lastPosition: { col: number, row: number };
    lastPlayerColor: PlayerColor;
    nextPlayerColor: PlayerColor;

    winnerColor: PlayerColor;
    movesSuccessful: number;
    movesOverall: number;
    hasAlreadySearchedForWinner: boolean;

    constructor() {
        this.reset();
    }

    reset() {
        this.history = [];
        this.playGround = new Array(this.cols).fill(undefined).map(() => new Array(this.rows).fill(PlayerColor.FREE));
        this.lastPosition = undefined;
        this.lastPlayerColor = undefined;
        this.nextPlayerColor = PlayerColor.RED;
        this.winnerColor = undefined;
        this.movesSuccessful = 0;
        this.movesOverall = 0;
        this.hasAlreadySearchedForWinner = true; // empty game: no need to search
    }

    move(playerColor: PlayerColor, col: number, row: number): boolean {
        if (this.isGameFinished()) {
            return false;
        }
        const success = this.setColor(playerColor, col, row);
        this.movesOverall++;
        if (success) {
            this.movesSuccessful++;
            this.hasAlreadySearchedForWinner = false;
        } else {
            // Player (especially if KI) Looses imediatly if it makes an wrong move.
            this.winnerColor = PlayerColorUtil.opposite(playerColor);
            this.hasAlreadySearchedForWinner = true;
        }
        return success;
    }

    revertMove(playerColor: PlayerColor, col: number, row: number): boolean {
        const lastSnapshot = this.history.pop();

        if (lastSnapshot.lastPosition.col !== col || lastSnapshot.lastPosition.row !== row) {
            console.warn(`Cannot revert move with col=${col} row=${row},
            because it doesn't match the last Position col=${this.lastPosition.col} row=${this.lastPosition.col}.`);
            this.history.push(lastSnapshot);
            return false;
        }
        if (lastSnapshot.lastPlayerColor !== playerColor) {
            console.warn(`Cannot revert move for playerColor=${PlayerColor[playerColor]},
            because it doesn't match the last PlayerColor col=${PlayerColor[lastSnapshot.lastPlayerColor]}.`);
            this.history.push(lastSnapshot);
            return false;
        }
        if (this.history.length === 0) {
            this.reset();
            return true;
        }
        const oldSnapshot = this.history[this.history.length - 1].copy();

        this.playGround = oldSnapshot.playGround;
        this.lastPlayerColor = oldSnapshot.lastPlayerColor;
        this.lastPosition = oldSnapshot.lastPosition;
        this.nextPlayerColor = oldSnapshot.nextPlayerColor;
        this.movesOverall--;
        this.movesSuccessful--;
        this.hasAlreadySearchedForWinner = false;
        this.winnerColor = undefined;
        return true;
    }

    getColor(col: number, row: number) {
        return this.playGround[col][row];
    }

    setColor(playerColor: PlayerColor, col: number, row: number): boolean {
        this.lastPlayerColor = playerColor;
        this.nextPlayerColor = PlayerColorUtil.opposite(playerColor);

        let success: boolean;
        if (this.getColor(col, row) === PlayerColor.FREE) {
            this.playGround[col][row] = playerColor;
            this.lastPosition = { col, row };

            success = true;
        } else {
            success = false;
        }
        this.history.push(new GameSnapshot(
            this.playGround,
            this.lastPosition,
            this.lastPlayerColor,
            this.nextPlayerColor));
        return success;
    }

    isGameFinished() {
        this.findWinner();

        if (this.winnerColor !== undefined) {
            console.log('isGameFinished - found winnerColor', this.winnerColor);
            return true;
        }
        if (this.movesSuccessful === this.rows * this.cols) {
            console.log('isGameFinished - movesSuccessful === this.rows * this.cols', this.winnerColor);
            return true;
        }
        if (this.movesOverall >= TicTacToeGame.MAX_MOVES) {
            console.log('isGameFinished - movesOverall >= TicTacToeGame.MAX_MOVES', this.winnerColor);
            return true;
        }
        return false;
    }

    findWinner() {
        if (this.hasAlreadySearchedForWinner) {
            return this.winnerColor;
        }
        this._findWinnerVertical();
        this._findWinnerHorizontal();
        this._findWinnerDiagonal();
        return this.winnerColor;
    }

    private _findWinnerVertical() {
        if (this.winnerColor !== undefined) {
            return;
        }
        let lastField: PlayerColor;
        let counter: number;

        for (let col = 0; col < this.cols; col++) {
            lastField = undefined;
            counter = 0;
            for (let row = 0; row < this.rows; row++) {
                if (this.getColor(col, row) === lastField) {
                    counter++;
                } else {
                    counter = 1;
                }
                if (lastField !== undefined && lastField !== PlayerColor.FREE && counter === 3) {
                    this.winnerColor = lastField;
                    return;
                }
                lastField = this.getColor(col, row);
            }
        }
    }
    private _findWinnerHorizontal() {
        if (this.winnerColor !== undefined) {
            return;
        }
        let lastField: PlayerColor;
        let counter: number;

        for (let row = 0; row < this.rows; row++) {
            lastField = undefined;
            counter = 0;
            for (let col = 0; col < this.cols; col++) {
                if (this.getColor(col, row) === lastField) {
                    counter++;
                } else {
                    counter = 1;
                }
                if (lastField !== undefined && lastField !== PlayerColor.FREE && counter === 3) {
                    this.winnerColor = lastField;
                    return;
                }
                lastField = this.getColor(col, row);
            }
        }
    }
    private _findWinnerDiagonal() {
        if (this.winnerColor !== undefined) {
            return;
        }
        let rowToTest: number;
        let lastField: PlayerColor;
        let counter: number;

        // from left top to right bottom
        for (let row = -this.cols + 1; row < this.rows; row++) {
            lastField = undefined;
            counter = 0;
            for (let col = 0; col < this.cols; col++) {
                rowToTest = row + col;
                if (rowToTest < 0 || rowToTest >= this.rows) {
                    continue;
                }
                if (this.getColor(col, rowToTest) === lastField) {
                    counter++;
                } else {
                    counter = 1;
                }
                if (lastField !== undefined && lastField !== PlayerColor.FREE && counter === 3) {
                    this.winnerColor = lastField;
                    return;
                }
                lastField = this.getColor(col, rowToTest);
            }
        }

        // from left bottom to right top
        for (let row = 0; row < this.rows + this.cols - 1; row++) {
            lastField = undefined;
            counter = 0;
            for (let col = 0; col < this.cols; col++) {
                rowToTest = row - col;
                if (rowToTest < 0 || rowToTest >= this.rows) {
                    continue;
                }
                if (this.getColor(col, rowToTest) === lastField) {
                    counter++;
                } else {
                    counter = 1;
                }
                if (lastField !== undefined && lastField !== PlayerColor.FREE && counter === 3) {
                    this.winnerColor = lastField;
                    return;
                }
                lastField = this.getColor(col, rowToTest);
            }
        }
    }
}
