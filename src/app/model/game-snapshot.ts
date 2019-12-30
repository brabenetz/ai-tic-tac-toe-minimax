import { PlayerColor } from './player-color';

export class GameSnapshot {

    constructor(
        readonly playGround: PlayerColor[][],
        readonly lastPosition: { col: number, row: number },
        readonly lastPlayerColor: PlayerColor,
        readonly nextPlayerColor: PlayerColor,
        readonly lastMoveWasSuccess: boolean) {
        this.playGround = playGround.map((line) => {
            return line.slice();
        });
        this.lastPosition = { ...lastPosition };
    }

    copy() {
        return new GameSnapshot(
            this.playGround,
            this.lastPosition,
            this.lastPlayerColor,
            this.nextPlayerColor,
            this.lastMoveWasSuccess);
    }
}
