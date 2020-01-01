import { PlayerColor } from './player-color';
import { GameSnapshot } from './game-snapshot';
import { BehaviorSubject } from 'rxjs';

export interface Game {
    rows: number;
    cols: number;
    history: GameSnapshot[];
    nextPlayerColor: PlayerColor;
    playGround: PlayerColor[][];
    playGroundSubject: BehaviorSubject<Game>;
    move(playerColor: PlayerColor, col: number, row: number): boolean;
    revertMove(playerColor: PlayerColor, col: number, row: number): boolean;
    isGameFinished(): boolean;
    findWinner(): PlayerColor;
    resetFindWinner(): void;
    copy(): Game;
}
