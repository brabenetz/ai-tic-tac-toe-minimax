import { Component, OnInit } from '@angular/core';
import { PlayerFactory } from '../model/player-factory';
import { HumanPlayer } from '../model/human-player';
import { PlayGround } from '../model/play-ground';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor, PlayerColorUtil } from '../model/player-color';
import { RandomPlayer } from '../model/random-player';
import * as _ from 'lodash';
import { MinimaxPlayer } from '../model/minimax-player';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    public availablePlayers: PlayerFactory[];

    public player1 = HumanPlayer.factory;

    public player2 = HumanPlayer.factory;

    public showMinimaxPrediction = false;

    public gameIsRunning = false;

    public playGround: PlayGround;

    constructor() { }

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
        this.availablePlayers.push(MinimaxPlayer.createFactory('Robot-Minimax', 5000));
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
        return this.player1 === HumanPlayer.factory && this.player2  === HumanPlayer.factory;
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
