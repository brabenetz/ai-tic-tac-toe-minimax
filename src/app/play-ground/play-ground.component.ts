import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../model/game';
import { PlayGround } from '../model/play-ground';
import { PlayerColor } from '../model/player-color';
import { HumanPlayer } from '../model/human-player';

@Component({
    selector: 'app-play-ground',
    templateUrl: './play-ground.component.html',
    styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {

    @Input() playGround: PlayGround;

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
            // nextPlayer.move();
            nextPlayer.click(col, row);
        }
    }
}
