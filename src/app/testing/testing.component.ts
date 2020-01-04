import { Component, OnInit } from '@angular/core';
import { HumanPlayer } from '../model/human-player';
import { RandomPlayer } from '../model/random-player';
import { MinimaxPlayer } from '../model/minimax-player';
import { PlayerFactory } from '../model/player-factory';
import { StatisticSummary } from '../model/statistic-summary';
import { PlayGround } from '../model/play-ground';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor } from '../model/player-color';

@Component({
    selector: 'app-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

    public availablePlayers: PlayerFactory[];

    public testRuns = 10;

    // public currentRun = 0;
    public currentRunInfo = '';

    public currentStatisticSummary = new StatisticSummary();

    public player1: PlayerFactory;

    public player2: PlayerFactory;

    public testingIsRunning = false;

    constructor() { }

    ngOnInit() {
        this.availablePlayers = [];
        this.availablePlayers.push(RandomPlayer.createFactory(0));
        this.availablePlayers.push(MinimaxPlayer.createFactory(0));
        this.player1 = this.availablePlayers[0];
        this.player2 = this.availablePlayers[1];
    }

    stopTesting(): void {
        this.testingIsRunning = false;
    }

    async startTesting(): Promise<void> {
        this.testingIsRunning = true;
        this.currentStatisticSummary = new StatisticSummary();

        const winners = { draw: 0 };
        winners[PlayerColor.RED] = 0;
        winners[PlayerColor.GREEN] = 0;
        for (let run = 0; run < this.testRuns && this.testingIsRunning; run++) {

            this.currentRunInfo = `${run + 1}/${this.testRuns}`;

            const game = new TicTacToeGame();
            const player1 = this.player1.createPlayer(game, PlayerColor.RED);
            const player2 = this.player2.createPlayer(game, PlayerColor.GREEN);
            const playGround = new PlayGround(game, player1, player2);
            await playGround.startGame();
            const winner = playGround.game.findWinner();
            if (winner === undefined) {
                winners.draw += 1;
            } else {
                winners[winner] += 1;
            }

        }
        console.log('winners:', winners);
        this.testingIsRunning = false;

    }
}
