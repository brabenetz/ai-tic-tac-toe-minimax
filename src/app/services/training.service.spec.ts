import { TestBed } from '@angular/core/testing';
import * as tf from '@tensorflow/tfjs';

import { TrainingService } from './training.service';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor } from '../model/player-color';

describe('TrainingService', () => {
    let service: TrainingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TrainingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    fdescribe('Transform Tensorflow Prediction', () => {

        it('should transform prediction to correct coordinates', () => {

            const game = new TicTacToeGame();
            game.nextPlayerColor = PlayerColor.GREEN;
            game.move(PlayerColor.GREEN, 1, 0);
            const fakePrediction = game.playGround.map(v => v.map(cell => cell === 2 ? 0 : cell));

            const result = service.translateTensorflowPrediction(tf.tensor2d(fakePrediction).flatten());

            expect(result.bestScore).toBeCloseTo(1, 1);
            expect(result.bestPosition).toEqual({ col: 1, row: 0 });
        });



        it('should transform prediction', () => {
            const result = service.translateTensorflowPrediction(tf.tensor1d([
                0, 0.1, 0.2,
                0.6, 0.1, 0.1,
                0.2, 0.1, 0.1
            ]));

            expect(result.bestScore).toBeCloseTo(0.6, 1);
            expect(result.bestPosition).toEqual({ col: 1, row: 0 });
        });
    });

});
