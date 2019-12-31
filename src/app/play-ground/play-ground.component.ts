import { Component, OnInit, Input } from '@angular/core';
import { PlayGround } from '../model/play-ground';
import { PlayerColor } from '../model/player-color';
import { HumanPlayer } from '../model/human-player';
import { MinimaxPlayer } from '../model/minimax-player';

@Component({
    selector: 'app-play-ground',
    templateUrl: './play-ground.component.html',
    styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {

    @Input() playGround: PlayGround;
    @Input() showMinimaxPrediction: boolean;

    constructor() { }

    ngOnInit() {
    }

    playerColorName(playerColor: PlayerColor) {
        return PlayerColor[playerColor].toString();
    }

    click(col: number, row: number) {
        if (this.playGround.game.playGround[col][row] !== PlayerColor.FREE) {
            // ignore click;
            return;
        }
        const nextPlayer = this.playGround.getNextPlayer();
        if (nextPlayer instanceof HumanPlayer) {
            nextPlayer.click(col, row);
        }
    }

    getMinimaxPrediction(col: number, row: number) {
        if (this.playGround.game.playGround[col][row] !== PlayerColor.FREE || this.playGround.game.isGameFinished()) {
            return undefined;
        }
        const gameClone = this.playGround.game.copy();
        const playerColor = gameClone.nextPlayerColor;

        const success = gameClone.move(playerColor, col, row);
        if (!success) {
            console.log('current playground: ', gameClone.playGround);
            throw new Error(`move for player ${PlayerColor[playerColor]} to ${col}/${row} was not success.`);
        }
        const score = MinimaxPlayer.getScore(gameClone, playerColor);
        gameClone.revertMove(playerColor, col, row);
        return MinimaxPlayer.getScoreName(score);
    }
}
