import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    public availablePlayers: SelectItem[];

    public player1 = 'human';

    public player2 = 'human';

    public gameIsRunning = false;

    constructor() { }

    ngOnInit() {
        this.availablePlayers = [
            { label: 'Human', value: 'human' },
            { label: 'Robot - Random', value: 'robot-random' },
            { label: 'Robot - Minimax', value: 'robot-minimax' },
            { label: 'Robot - Ki - ???', value: 'robot-ki-??' },
        ];
    }

    stopGame(): void {
        this.gameIsRunning = false;
    }

    startGame(): void {
        this.gameIsRunning = true;
    }
}
