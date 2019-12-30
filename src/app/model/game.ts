import { PlayerColor } from './player-color';
import { GameSnapshot } from './game-snapshot';

export interface Game {
    history: GameSnapshot[];
    nextPlayerColor: PlayerColor;
    playGround: PlayerColor[][];
    move(playerColor: PlayerColor, col: number, row: number): boolean;
    revertMove(playerColor: PlayerColor, col: number, row: number): boolean;
    isGameFinished(): boolean;
    findWinner(): PlayerColor;
}
