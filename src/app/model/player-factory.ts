import { Player } from './player';
import { Game } from './game';
import { PlayerColor } from './player-color';

export interface PlayerFactory {
    name: string;
    createPlayer(game: Game, playerColor: PlayerColor): Player;
}
