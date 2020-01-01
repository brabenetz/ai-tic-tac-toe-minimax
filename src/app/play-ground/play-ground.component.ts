import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayGround } from '../model/play-ground';
import { PlayerColor } from '../model/player-color';
import { HumanPlayer } from '../model/human-player';
import { MinimaxPlayer } from '../model/minimax-player';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-play-ground',
    templateUrl: './play-ground.component.html',
    styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnChanges {

    @Input() playGround: PlayGround;
    @Input() showMinimaxPrediction: boolean;

    private gamePlayGroundSubscription: Subscription;
    private minimaxPrediction: number[][];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (_.get(changes, 'playGround')) {
            if (this.gamePlayGroundSubscription) {
                this.gamePlayGroundSubscription.unsubscribe();
            }
            this.gamePlayGroundSubscription = this.playGround.game.playGroundSubject
                .subscribe((game) => {
                    const gameClone = game.copy();
                    const currentPlayerColor = gameClone.nextPlayerColor;
                    this.minimaxPrediction = MinimaxPlayer.minimax(gameClone, currentPlayerColor).scores;
                });
        }
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
        return MinimaxPlayer.getScoreName(this.minimaxPrediction[col][row]);
    }
}
