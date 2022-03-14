import { Keyboard } from "./Keyboard";
import { IGame, GameEndSummary } from "./IGame";

type GameState = "not-started" | "running" | "completed" | "stopped";

export class GameRunner {

    public game: IGame;
    public tick: number;

    private keyboardState: Keyboard;

    private now: number;
    private then: number;
    private elapsed: number;
    private fpsInterval: number;

    public state: GameState = "not-started";

    public get keyboard() {
        return this.keyboardState;
    }

    constructor(game: IGame) {
        this.game = game;

        this.tick = 0;
        this.fpsInterval = 1000 / this.game.tickRate;

        this.keyboardState = new Keyboard();
    }

    public async run(playerName: string, onCompletion: (summary: GameEndSummary) => void = null) {
        this.state = "running";
        this.tick = 0;
        this.then = Date.now();

        this.keyboardState.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

        await this.game.preStart(playerName);
        this.game.start();

        window.requestAnimationFrame(() => {
            this.tickGame();
        });

        this.game.gameEnded = (summary: GameEndSummary) => {
            this.state = "completed";

            if (onCompletion) {
                onCompletion(summary);
            }
        };
    }

    public async stop() {
        this.state = "completed";
        this.game.stop(true);
    }

    private tickGame() {
        if (this.state === "stopped" || this.state === "completed") {
            return;
        }

        window.requestAnimationFrame(() => {
            this.tickGame();
        });

        this.now = Date.now();
        this.elapsed = this.now - this.then;

        // if enough time has elapsed, draw the next frame

        if (this.elapsed > this.fpsInterval) {
            this.tick++;

            this.then = this.now - (this.elapsed % this.fpsInterval);

            const tickContext = {
                tick: this.tick,
                keyboardState: this.keyboardState,
                elapsed: this.elapsed
            };

            this.game.update(tickContext);
            this.game.render(tickContext);
        }
    }
}
