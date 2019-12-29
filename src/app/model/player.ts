import { PlayerColor } from './player-color';

export interface Player {
    playerColor: PlayerColor;
    move(): Promise<void>;
}
