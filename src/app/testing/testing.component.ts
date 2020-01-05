import { Component, OnInit } from '@angular/core';
import { RandomPlayer } from '../model/random-player';
import { MinimaxPlayer } from '../model/minimax-player';
import { PlayerFactory } from '../model/player-factory';
import { StatisticSummary } from '../model/statistic-summary';
import { PlayGround } from '../model/play-ground';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor } from '../model/player-color';
import { TestingChartBarUtils } from './testing-chart-bar-utils';
import * as _ from 'lodash';

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

    public player1: PlayerFactory;

    public player2: PlayerFactory;

    public testingIsRunning = false;

    public testResultData: any;

    public testResultOptions: any;

    public storedData: any;
    public storedOptions: any;

    constructor() { }


    ngOnInit() {
        this.availablePlayers = [];
        this.availablePlayers.push(RandomPlayer.createFactory(0));
        this.availablePlayers.push(MinimaxPlayer.createFactory(0));
        this.player1 = this.availablePlayers[0];
        this.player2 = this.availablePlayers[1];

        this.testResultOptions = TestingChartBarUtils.createChartBarOptions('Last Test-Run');

        this.storedData = TestingChartBarUtils.createInitialChartBarData();
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'TestRun - Random against Random',
            { redWins: 580, greenWins: 280, draws: 140, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 8000 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'TestRun - Minimax without DRAW adjustment',
            { redWins: 0, greenWins: 811, draws: 189, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 7000 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'TestRun - Minimax Perfect',
            { redWins: 0, greenWins: 918, draws: 82, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 6000 });

        this.storedOptions = TestingChartBarUtils.createChartBarOptions('Stored Test-Runs');
        this.storedOptions.onClick = (mouseEvent, selectedDataSets) => {
            // TODO: Implement 'REMOVE', 'Edit Label'
            console.log('selectedDataSets', selectedDataSets);
        };
    }

    stopTesting(): void {
        this.testingIsRunning = false;
    }

    async startTesting(): Promise<void> {
        this.testingIsRunning = true;

        this.testResultData = TestingChartBarUtils.createInitialChartBarData();

        const summary = new StatisticSummary();

        for (let run = 0; run < this.testRuns && this.testingIsRunning; run++) {

            this.currentRunInfo = `${run + 1}/${this.testRuns}`;

            const game = new TicTacToeGame();
            const player1 = this.player1.createPlayer(game, PlayerColor.RED);
            const player2 = this.player2.createPlayer(game, PlayerColor.GREEN);
            const playGround = new PlayGround(game, player1, player2);
            await playGround.startGame();
            const winner = playGround.game.findWinner();

            summary.draws += (winner === undefined) ? 1 : 0;
            summary.redWins += (winner === PlayerColor.RED) ? 1 : 0;
            summary.greenWins += (winner === PlayerColor.GREEN) ? 1 : 0;
            summary.countGames += 1;
            summary.countSuccessMoves += playGround.game.movesSuccessful;
            summary.countFailedMoves += playGround.game.movesOverall - playGround.game.movesSuccessful;

            // TestingChartBarUtils.updateChartBarDataSet(this.testResultData, null, 0, summary);
            // this.testResultData = {...this.testResultData}; // trigger chart update
        }
        TestingChartBarUtils.addChartBarDataSet(this.testResultData, null, summary);
        this.testResultData = {...this.testResultData}; // trigger chart update
        this.testingIsRunning = false;

    }

}
