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
import { identifierModuleUrl } from '@angular/compiler';
import { timeout } from 'q';

@Component({
    selector: 'app-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

    public availablePlayers: PlayerFactory[];

    public testRuns = 100;

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
        this.availablePlayers.push(MinimaxPlayer.createFactory(
            'Robot-Minimax core-logic', 0, { withDepthAdjustment: false, withDrawAdjustment: false }));
        this.availablePlayers.push(MinimaxPlayer.createFactory(
            'Robot-Minimax with depth Adjustment ', 0, { withDepthAdjustment: true, withDrawAdjustment: false }));
        this.availablePlayers.push(MinimaxPlayer.createFactory(
            'Robot-Minimax with DRAW Adjustment', 0, { withDepthAdjustment: false, withDrawAdjustment: true }));
        this.availablePlayers.push(MinimaxPlayer.createFactory(
            'Robot-Minimax Perfect', 0, { withDepthAdjustment: true, withDrawAdjustment: true }));
        this.player1 = this.availablePlayers[0];
        this.player2 = this.availablePlayers[4];

        this.testResultOptions = TestingChartBarUtils.createChartBarOptions('Last Test-Run');

        this.storedData = TestingChartBarUtils.createInitialChartBarData();
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'Random vs Random',
            { redWins: 580, greenWins: 280, draws: 140, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 7604 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, ['Random vs Minimax', '(core-logic)'],
            { redWins: 0, greenWins: 778, draws: 222, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 7380 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, ['Random vs Minimax', '(with depth Adjustment)'],
            { redWins: 0, greenWins: 803, draws: 197, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 7031 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, ['Random vs Minimax', '(with DRAW Adjustment)'],
            { redWins: 0, greenWins: 922, draws: 78, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 7078 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'Random vs Minimax',
            { redWins: 0, greenWins: 918, draws: 82, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 6455 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, ['Minimax vs Random', '(Minimax first)'],
            { redWins: 995, greenWins: 0, draws: 5, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 5344 });
        TestingChartBarUtils.addChartBarDataSet(
            this.storedData, 'Minimax vs Minimax',
            { redWins: 0, greenWins: 0, draws: 1000, countGames: 1000, countFailedMoves: 0, countSuccessMoves: 9000 });

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
        const updateIntervalMilis = 10_000;
        let nextGraphUpdate = new Date().getTime() + updateIntervalMilis;
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

            if (new Date().getTime() > nextGraphUpdate) {
                // console.log('Chart Update');

                TestingChartBarUtils.updateChartBarDataSet(this.testResultData, null, 0, summary);
                this.testResultData = { ...this.testResultData }; // trigger chart update
                nextGraphUpdate = new Date().getTime() + updateIntervalMilis;
            }
        }
        console.log('summary', JSON.stringify(summary));

        TestingChartBarUtils.updateChartBarDataSet(this.testResultData, null, 0, summary);
        this.testResultData = { ...this.testResultData }; // trigger chart update
        this.testingIsRunning = false;

    }

}
