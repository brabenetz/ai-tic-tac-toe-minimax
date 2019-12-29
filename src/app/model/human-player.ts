import { Player } from './player';
import { Game } from './game';
import { PlayerColor } from './player-color';
import { AsyncSubject } from 'rxjs';
import { PlayerFactory } from './player-factory';

export class HumanPlayer implements Player {
    public static factory: PlayerFactory = {
        name: 'Human',
        createPlayer: (game: Game, playerColor: PlayerColor) => {
            return new HumanPlayer(game, playerColor);
        }
    };
    private isActive = false;
    private finishedMove: AsyncSubject<void>;

    constructor(private game: Game, public playerColor: PlayerColor) { }

    async move(): Promise<void> {
        // this player can now make his move.
        this.isActive = true;
        this.finishedMove = new AsyncSubject();
        return this.finishedMove.toPromise();
    }

    click(col: number, row: number): void {
        if (!this.isActive) {
            // do nothing, ignore the click.
            return;
        }
        this.game.move(this.playerColor, col, row);
        this.isActive = false;
        this.finishedMove.next();
        this.finishedMove.complete();
    }

}
