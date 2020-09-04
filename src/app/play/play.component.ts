import { Component, OnInit } from '@angular/core';
import { PlayerFactory } from '../model/player-factory';
import { HumanPlayer } from '../model/human-player';
import { PlayGround } from '../model/play-ground';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor, PlayerColorUtil } from '../model/player-color';
import { RandomPlayer } from '../model/random-player';
import * as _ from 'lodash';
import { MinimaxPlayer } from '../model/minimax-player';
import { TensorflowPlayer } from '../model/tensorflow-player';
import { TrainingService } from '../services/training.service';
import { PredictionType } from '../play-ground/play-ground.component';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    public availablePlayers: PlayerFactory[];
    public availablePredictions: SelectItem[] = ['No Prediction', 'MiniMax', 'Tensorflow'].map(v => ({ label: v, value: v }));

    public player1 = HumanPlayer.factory;

    public player2 = HumanPlayer.factory;

    public showPrediction: PredictionType;

    public gameIsRunning = false;

    public playGround: PlayGround;

    constructor(private trainingService: TrainingService) { }

    ngOnInit() {
        // this.availablePlayers = [
        //     { label: 'Human', value: 'human' },
        //     { label: 'Robot - Random', value: 'robot-random' },
        //     { label: 'Robot - Minimax', value: 'robot-minimax' },
        //     { label: 'Robot - Ki - ???', value: 'robot-ki-??' },
        // ];

        this.availablePlayers = [];
        this.availablePlayers.push(HumanPlayer.factory);
        this.availablePlayers.push(RandomPlayer.factory);
        this.availablePlayers.push(MinimaxPlayer.factory);
        this.availablePlayers.push(TensorflowPlayer.createFactory(this.trainingService, 300));
    }
    restartGame(): void {
        this.stopGame();
        this.startGame();
    }

    stopGame(): void {
        this.gameIsRunning = false;
    }

    startGame(): void {
        const redStart = (Math.random() >= 0.5);
        const game = new TicTacToeGame();
        game.nextPlayerColor = redStart ? PlayerColor.RED : PlayerColor.GREEN;
        const player1 = this.player1.createPlayer(game, game.nextPlayerColor);
        const player2 = this.player2.createPlayer(game, PlayerColorUtil.opposite(game.nextPlayerColor));
        this.playGround = new PlayGround(game, player1, player2);
        this.playGround.startGame();
        this.gameIsRunning = true;
    }

    areBothPlayerHuman() {
        return this.player1 === HumanPlayer.factory && this.player2 === HumanPlayer.factory;
    }

    revertLastMove() {
        const wasFinished = this.playGround.game.isGameFinished();
        const currentPlayer = this.playGround.getNextPlayer();
        const history = this.playGround.game.history;
        const lastGameSnapshot = _.last(history);
        const success = this.playGround.game.revertMove(
            lastGameSnapshot.lastPlayerColor,
            lastGameSnapshot.lastPosition.col,
            lastGameSnapshot.lastPosition.row);
        if (success) {
            if (currentPlayer instanceof HumanPlayer) {
                currentPlayer.cancleMove();
            }
            if (wasFinished) {
                // restart movings until finished.
                this.playGround.startGame();
            }
        }
    }
}
