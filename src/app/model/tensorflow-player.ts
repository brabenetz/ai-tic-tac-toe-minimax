import { Player } from './player';
import { Game } from './game';
import { PlayerColor } from './player-color';
import { PlayerFactory } from './player-factory';
import { TrainingService } from '../services/training.service';
import * as _ from 'lodash';


export class TensorflowPlayer implements Player {

    public static createFactory(trainingService: TrainingService, delayMillis: number): PlayerFactory {
        return {
            name: 'Robot-Tensorflow',
            createPlayer: (game: Game, playerColor: PlayerColor) => {
                return new TensorflowPlayer(trainingService, game, playerColor, delayMillis);
            }
        };
    }

    constructor(
        private trainingService: TrainingService,
        private game: Game,
        public playerColor: PlayerColor,
        private delayMillis: number) {
    }

    async move(): Promise<void> {

        const predictionResult = this.trainingService.predictNextMove(this.game.playGround, this.playerColor);

        // apply small delay for nicer play-animations.
        return new Promise((resolve) => {
            setTimeout(() => {
                this.game.move(this.playerColor, predictionResult.bestPosition.col, predictionResult.bestPosition.row);
                resolve();
            }, this.delayMillis);
        });
    }
}
