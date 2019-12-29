import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { PlayerFactory } from '../model/player-factory';
import { HumanPlayer } from '../model/human-player';
import { PlayGround } from '../model/play-ground';
import { TicTacToeGame } from '../model/tic-tac-toe-game';
import { PlayerColor } from '../model/player-color';
import { RandomPlayer } from '../model/random-player';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    public availablePlayers: PlayerFactory[];

    public player1 = HumanPlayer.factory;

    public player2 = HumanPlayer.factory;

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
    }
    restartGame(): void {
        this.stopGame();
        this.startGame();
    }

    stopGame(): void {
        this.gameIsRunning = false;
    }

    startGame(): void {
        const game = new TicTacToeGame();
        const player1 = this.player1.createPlayer(game, PlayerColor.RED);
        const player2 = this.player2.createPlayer(game, PlayerColor.GREEN);
        this.playGround = new PlayGround(game, player1, player2);
        this.gameIsRunning = true;
    }
}
