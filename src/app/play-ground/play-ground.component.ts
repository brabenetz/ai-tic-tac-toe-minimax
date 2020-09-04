import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayGround } from '../model/play-ground';
import { PlayerColor } from '../model/player-color';
import { HumanPlayer } from '../model/human-player';
import { MinimaxPlayer } from '../model/minimax-player';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { TrainingService } from '../services/training.service';

export type PredictionType = 'MiniMax' | 'Tensorflow';

@Component({
    selector: 'app-play-ground',
    templateUrl: './play-ground.component.html',
    styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnChanges {

    @Input() playGround: PlayGround;
    @Input() showPrediction: PredictionType;

    private gamePlayGroundSubscription: Subscription;
    private prediction: number[][];

    constructor(private trainingService: TrainingService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (_.get(changes, 'playGround')) {
            if (this.gamePlayGroundSubscription) {
                this.gamePlayGroundSubscription.unsubscribe();
            }
            this.gamePlayGroundSubscription = this.playGround.game.playGroundSubject
                .subscribe((game) => {
                    if (this.showPrediction === 'MiniMax') {
                        const gameClone = game.copy();
                        const currentPlayerColor = gameClone.nextPlayerColor;
                        this.prediction = MinimaxPlayer.minimax(gameClone, currentPlayerColor).scores;
                    } else if (this.showPrediction === 'Tensorflow') {
                        const gameClone = game.copy();
                        const currentPlayerColor = gameClone.nextPlayerColor;
                        this.prediction = this.trainingService.predictNextMove(gameClone.playGround, currentPlayerColor).scores;
                    }
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

    getPrediction(col: number, row: number): string {
        if (!this.prediction) {
            return;
        }
        const score = this.prediction[col][row];
        if (this.showPrediction === 'MiniMax') {
            if (score !== undefined) {
                const scoreName = MinimaxPlayer.getScoreName(score);
                return `${scoreName} (${score})`;
            } else {
                return '';
            }
        } else if (this.showPrediction === 'Tensorflow') {
            return `${score}`;
        }
    }
    getCellCss(col: number, row: number): string {
        const playerColor = this.playGround.game.playGround[col][row];
        let cssStyle = `cell`;
        if (playerColor !== undefined) {
            cssStyle += ` ${this.playerColorName(playerColor)}`;
            if (this.playGround.game.lastPosition
                && this.playGround.game.lastPosition.col === col
                && this.playGround.game.lastPosition.row === row) {
                // animate last made move.
                cssStyle += ' animate';
            }
        }
        return cssStyle;
    }
}
