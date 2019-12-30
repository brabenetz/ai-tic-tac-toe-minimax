import { Game } from './game';
import { Player } from './player';
import { PlayerColor } from './player-color';

export class PlayGround {
    colorToPlayerMap = {};
    colorToPlayerNameMap = {};

    constructor(public game: Game, public player1: Player, public player2: Player) {
        this.colorToPlayerMap[player1.playerColor] = player1;
        this.colorToPlayerMap[player2.playerColor] = player2;
        this.colorToPlayerNameMap[player1.playerColor] = 'Player-1 ' + PlayerColor[player1.playerColor];
        this.colorToPlayerNameMap[player2.playerColor] = 'Player-2 ' + PlayerColor[player2.playerColor];
        this.startGame();
    }

    getNextPlayer(): Player {
        return this.colorToPlayerMap[this.game.nextPlayerColor];
    }

    getNextPlayerName(): Player {
        return this.colorToPlayerNameMap[this.game.nextPlayerColor];
    }

    getWinnerName(): string {
        return this.colorToPlayerNameMap[this.game.findWinner()];
    }

    async startGame() {
        while (!this.game.isGameFinished()) {
            await this.getNextPlayer().move();
        }
    }
}
