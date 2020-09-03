import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { CustomCallbackArgs, Tensor, Rank, reshape } from '@tensorflow/tfjs';
import { BaseCallback, History } from '@tensorflow/tfjs-layers/dist/base_callbacks';
import { PlayerColor, PlayerColorUtil } from '../model/player-color';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import * as _ from 'lodash';

export interface TrainingsData {
    inputs: number[][][];
    expectedResults: number[][];
}

interface PredictionResult {
    scores: number[][];
    bestPosition: { col: number, row: number };
    bestScore: number;
}


@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    public model: tf.Sequential;
    private game = new TicTacToeGame();

    private modelIsTrained = false;

    constructor() {
        this.model = this.createModel();
    }

    createModel(): tf.Sequential {
        const model = tf.sequential();
        model.add(tf.layers.conv2d({
            inputShape: [this.game.rows, this.game.cols, 1],
            kernelSize: 1,
            filters: 8,
            activation: 'relu'
        }));
        model.add(tf.layers.conv2d({ kernelSize: 3, filters: 8, activation: 'relu' }));
        model.add(tf.layers.flatten({}));
        model.add(tf.layers.dense({ units: 100, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.1, trainable: true }));
        model.add(tf.layers.dense({ units: 100, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.1, trainable: true }));
        model.add(tf.layers.dense({ units: 50, activation: 'relu' }));
        model.add(tf.layers.dense({ units: this.game.rows * this.game.cols, activation: 'sigmoid' }));

        model.compile({ loss: 'binaryCrossentropy', optimizer: 'adam' });

        return model;
    }

    isModelTrained() {
        return this.modelIsTrained;
    }

    resetModel() {
        this.model = this.createModel();
        this.modelIsTrained = false;
    }

    async trainModel(
        trainingsdata: TrainingsData,
        testingdata: TrainingsData,
        fitCallbacks: BaseCallback[] | CustomCallbackArgs | CustomCallbackArgs[]
    ): Promise<History> {
        const [trainXs, trainYs] = this.prepareTrainingsData(trainingsdata);
        const [testXs, testYs] = this.prepareTrainingsData(testingdata);


        const history = await this.model.fit(trainXs, trainYs, {
            batchSize: 100,
            validationData: [testXs, testYs],
            epochs: 100,
            shuffle: true,
            callbacks: fitCallbacks,
        });
        this.modelIsTrained = true;

        return history;
    }

    prepareTrainingsData(trainingsdata: TrainingsData) {
        return tf.tidy(() => {
            return [
                tf.tensor(trainingsdata.inputs, [trainingsdata.inputs.length, this.game.rows, this.game.cols, 1]),
                tf.tensor(trainingsdata.expectedResults, [trainingsdata.expectedResults.length, this.game.rows * this.game.cols])
            ];
        });
    }

    normalizeInputPlayerColor(playGround: PlayerColor[][], playerColor: PlayerColor): PlayerColor[][] {
        if (playerColor === PlayerColor.RED) {
            // fine, thats waht i want.
            return playGround;
        }

        // invert player-Color:
        return playGround.map(row => row.map(cell => PlayerColorUtil.opposite(cell)));
    }

    prepareInput(playGround: PlayerColor[][][]) {
        return tf.tidy(() => {
            return tf.tensor(playGround, [1, this.game.rows, this.game.cols, 1]);
        });
    }

    predictNextMove(playGround: PlayerColor[][], playerColor: PlayerColor): PredictionResult {
        const input = this.prepareInput([this.normalizeInputPlayerColor(playGround, playerColor)]);

        const prediction = this.model.predict(input) as Tensor;
        return this.translateTensorflowPrediction(prediction);
    }

    translateTensorflowPrediction(prediction: Tensor<Rank>): PredictionResult {
        const scoresRaw = Array.from(prediction.dataSync());


        // create scores from scoresRaw single-Array to multi-array:
        const scores: number[][] = scoresRaw.reduce((rows, cell, index) => {
            if (index % this.game.cols === 0) {
                rows.push([_.round(cell, 5)]);
            } else {
                rows[rows.length - 1].push(_.round(cell, 5));
            }
            return rows;
        }, []);

        let bestScore = 0;
        let bestPosition: { col: number, row: number };
        scores.forEach((column, col) => {
            column.forEach((cell, row) => {
                if (cell > bestScore) {
                    bestScore = cell;
                    bestPosition = { col, row };
                }
            });
        });
        // scoresRaw.forEach((cell, idx) => {
        //     if (cell > bestScore) {
        //         bestScore = cell;
        //         const col = idx % this.game.rows;
        //         const row = (idx - col) / this.game.cols;
        //         bestPosition = { col, row };
        //     }
        // });

        return { scores, bestScore, bestPosition };
    }
}
