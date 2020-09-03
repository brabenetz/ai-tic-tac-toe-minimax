import { Component, OnInit } from '@angular/core';
import { StatisticSummary } from '../model/statistic-summary';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor } from '../model/player-color';
import { PlayGround } from '../model/play-ground';
import { MinimaxPlayer } from '../model/minimax-player';
import { RandomPlayer } from '../model/random-player';
import { Game } from '../model/game';
import { GameSnapshot } from '../model/game-snapshot';
import * as _ from 'lodash';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import { Visor } from '@tensorflow/tfjs-vis/dist/visor';
import { TrainingService, TrainingsData } from '../services/training.service';

@Component({
    selector: 'app-training',
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

    // tensorflow training:
    visor: Visor;
    // Step 1 generate Games:
    gamesGenerationInfo = '';
    gamesToGenerate = 100;
    gamesAreGenerating = false;
    games: Game[] = [];
    // Step 2 collect trainingsData:
    trainingVsTestingRatio = 90;

    trainingData: TrainingsData;
    testingData: TrainingsData;

    constructor(private trainingService: TrainingService) { }

    ngOnInit(): void {
        this.visor = tfvis.visor();
    }


    async generateGames() {

        this.gamesAreGenerating = true;


        const summary = new StatisticSummary();

        for (let run = 0; run < this.gamesToGenerate && this.gamesAreGenerating; run++) {

            const minimaxPlayerFactory = MinimaxPlayer.createFactory('Robot-Minimax', 0);
            const randomPlayerFactory = RandomPlayer.createFactory(0);

            this.gamesGenerationInfo = `${run + 1}/${this.gamesToGenerate}`;

            // await new Promise( resolve => setTimeout(resolve, 1) );

            // minimax always start on the left , top corner, so we need a little less examples.
            const minimaxStart = (Math.random() < 0.1);
            const game = new TicTacToeGame();
            // for simplification Minimax-Player is always played as red.
            const minimaxPlayer = minimaxPlayerFactory.createPlayer(game, PlayerColor.RED);
            const randomPlayer = randomPlayerFactory.createPlayer(game, PlayerColor.GREEN);

            const player1 = minimaxStart ? minimaxPlayer : randomPlayer;
            const player2 = minimaxStart ? randomPlayer : minimaxPlayer;
            game.nextPlayerColor = player1.playerColor;
            const playGround = new PlayGround(game, player1, player2);
            await playGround.startGame();
            const winner = playGround.game.findWinner();

            summary.draws += (winner === undefined) ? 1 : 0;
            summary.redWins += (winner === PlayerColor.RED) ? 1 : 0;
            summary.greenWins += (winner === PlayerColor.GREEN) ? 1 : 0;
            summary.countGames += 1;
            summary.countSuccessMoves += playGround.game.movesSuccessful;
            summary.countFailedMoves += playGround.game.movesOverall - playGround.game.movesSuccessful;

            this.games.push(playGround.game);

        }
        console.log('summary', JSON.stringify(summary));

        this.gamesAreGenerating = false;

    }

    stopGenerateGames() {
        this.gamesAreGenerating = false;
    }

    collectTrainingsData() {
        // for simplification Minimax-Player is always played as red.
        const minimaxSteps = ([] as GameSnapshot[]).concat(...this.games.map(g => g.history))
            .filter(history => history.lastPlayerColor === PlayerColor.RED);


        this.trainingData = {inputs: [], expectedResults: []};
        this.testingData = {inputs: [], expectedResults: []};



        minimaxSteps.forEach(minimaxStep => {
            const playGround = _.cloneDeep(minimaxStep.playGround);
            // revert last move
            playGround[minimaxStep.lastPosition.col][minimaxStep.lastPosition.row] = PlayerColor.FREE;

            // create empty playGround with zeros and set expected field to one:
            const expectedResult: number[][] = playGround.map((row) => row.map(() => 0));
            expectedResult[minimaxStep.lastPosition.col][minimaxStep.lastPosition.row] = 1;

            const usedForTraining = Math.random() < (this.trainingVsTestingRatio / 100);

            if (usedForTraining) {
                this.trainingData.inputs.push(playGround);
                this.trainingData.expectedResults.push(_.flatten(expectedResult));
            } else {
                this.testingData.inputs.push(playGround);
                this.testingData.expectedResults.push(_.flatten(expectedResult));
            }
        });

    }

    startTraining() {
        // for Tensorflow Visor: see https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
        // const surface = this.visor.surface({ name: 'TEst', styles: { height: '500px' }, tab: "Test" });

        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = {
            name: 'show.fitCallbacks',
            tab: 'Training',
            styles: {
                height: '600px'
            }
        };
        const callbacks = tfvis.show.fitCallbacks(container, metrics);


        this.trainingService.trainModel(this.trainingData, this.testingData, callbacks);

    }
}
