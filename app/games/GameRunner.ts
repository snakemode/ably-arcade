import { Keyboard } from "./Keyboard";
import { IGame } from "./IGame";

export class GameRunner {

    private game: IGame;
    private keyboardState: Keyboard;

    private tick: number;
    private now: number;
    private then: number;
    private elapsed: number;
    private fpsInterval: number;  
    
    public get keyboard() {
        return this.keyboardState;
    }

    constructor(game: IGame) {
        this.game = game;        
        
        this.tick = 0;
        this.fpsInterval = 1000 / this.game.tickRate;
        
        this.keyboardState = new Keyboard();
    }

    public async run() { 
        this.tick = 0;
        this.then = Date.now();
        
        this.keyboardState.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

        await this.game.preStart();
        this.game.start();

        window.requestAnimationFrame(() => { 
            this.tickGame(); 
        }); 
    }

    private tickGame() {
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
