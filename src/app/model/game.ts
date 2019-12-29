import { PlayerColor } from './player-color';

export interface Game {
    nextPlayerColor: PlayerColor;
    playGround: PlayerColor[][];
    move(playerColor: PlayerColor, col: number, row: number): void;
    isGameFinished(): boolean;
    findWinner(): PlayerColor;
}