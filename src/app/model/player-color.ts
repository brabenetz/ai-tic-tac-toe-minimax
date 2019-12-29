export enum PlayerColor {
    RED, GREEN, FREE
}

export class PlayerColorUtil {
    public static opposite(playerColor: PlayerColor): PlayerColor {
        switch (playerColor) {
            case PlayerColor.RED:
                return PlayerColor.GREEN;
            case PlayerColor.GREEN:
                return PlayerColor.RED;
            case PlayerColor.FREE:
                return PlayerColor.FREE;
        }
    }
}