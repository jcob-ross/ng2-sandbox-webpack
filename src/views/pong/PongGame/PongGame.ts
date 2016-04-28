import {Ball} from "./Ball";
import {AiPaddle} from "./AiPaddle";
import {IKeyMap, IBounds} from "./Interfaces";
import {Entity} from "./Entity";

/**
 * Very simple pong-like game
 */
export class PongGame {
  private key_upArrow = 38;
  private key_downArrow = 40;
  private key_p = 80;
  private key_esc = 27;
  private key_space = 32;
  private paused: boolean = false;
  private started: boolean = false;
  private width: number;
  private height: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private keystate: IKeyMap;
  private player: Entity;
  private ai: Entity;
  private ball: Entity;
  private gameReset: () => void;
  private gamePaused: (state: "running"|"paused") => void;


  /**
   * Current score of the player (left) paddle
   */
  public scorePlayer: number;
  /**
   * Current score of the AI paddle (right)
   */
  public scoreAi: number;

  /**
   * Creates new instance of the PongGame.
   * Usage:
   * After instantiation, PongGame must be initialized by calling init(..)
   * Then started with run() method.
   * @param width Width of the canvas
   * @param height Height of the canvas
   * @param canvasWrapperId ID of the Element after which canvas will be appended as a child
   * @throws Error if element with id specified by 'canvasWrapperId' is not found
   */
  constructor(width: number, height: number, canvasWrapperId: string) {
    this.keystate = {};
    let canvasWrapper = document.getElementById(canvasWrapperId);
    if (canvasWrapper == undefined) throw new Error("Element with ID " + canvasWrapperId + " was not found");
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    canvasWrapper.appendChild(this.canvas);
  }

  /**
   * Initializes PongGame instance. Invoke before run() method
   * @param scoredCallback Callback to be invoked when either side scores a point
   * @param pausedCallback Callback to be invoked when game is paused and unpaused
   * @param resetCallback Callback to be invoked when game is reset
   */
  init(scoredCallback: (side: "player"|"ai") => void,
       pausedCallback: (state: "running"|"paused") => void,
       resetCallback: () => void) {

    this.gamePaused = pausedCallback;
    this.gameReset = resetCallback;

    let canvasWidth = this.width;
    let canvasHeight = this.height;
    let worldBounds: IBounds = {left: 0, right: canvasWidth, top: 0, bottom: canvasHeight};
    let paddleWidth = 10;
    let paddleHeight = 100;
    let ballSide = 14;

    let playerPosition = {x: paddleWidth, y: (canvasHeight - paddleHeight) / 2};
    let player = new Entity(playerPosition, paddleWidth, paddleHeight, worldBounds);

    let ballPosition = {x: (canvasWidth - ballSide) / 2, y: (canvasHeight - ballSide) / 2};
    let ball = new Ball(ballPosition, ballSide, ballSide, worldBounds, player);

    let aiPosition = {x: canvasWidth - (paddleWidth * 2), y: (canvasHeight - paddleHeight) / 2};
    let ai = new AiPaddle(aiPosition, paddleWidth, paddleHeight, worldBounds);

    ai.setBallRef(ball);
    ball.setAiRef(ai);
    ball.setGoalScoredCallback(scoredCallback);
    this.player = player;
    this.ai = ai;
    this.ball = ball;
    document.addEventListener('keydown', (evt) => {this.onKeyDown(evt, this.keystate)});
    document.addEventListener('keyup', (evt) => {this.onKeyUp(evt, this.keystate)});
  };

  /**
   * Starts the game update and draw loop
   */
  run() {
    let that = this;
    let loop = () => {
      that.update();
      that.draw();
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  };

  /**
   * Pauses or unpauses the game
   */
  public togglePause() {
    this.paused = !this.paused;
    this.onGamePaused();
  }

  private update() {
    if (this.paused || !this.started) return;

    if (this.keystate[this.key_upArrow]) {
      this.player.move({x: 0, y: -5});
    }
    if (this.keystate[this.key_downArrow]) {
      this.player.move({x: 0, y: 5});
    }

    this.player.update();
    this.ai.update();
    this.ball.update();
  };

  /**
   * Resets the game to it's initial state
   */
  public reset(){
    this.scoreAi = 0;
    this.scorePlayer = 0;
    this.player.reset();
    this.ai.reset();
    this.ball.reset();
    this.paused = false;
    this.started = false;
    this.onGameReset();
  }

  private draw() {
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.fillStyle = '#fff';
    this.drawNet();

    this.player.draw(this.ctx);
    this.ai.draw(this.ctx);

    if (this.started && !this.paused){
      this.ball.draw(this.ctx);
    }

    if (!this.started) this.drawStartMessage();
    if (this.started && this.paused) this.drawPausedMessage();
    if (!this.started || this.paused) this.drawLegend();
    this.ctx.restore();
  };

  /**
   * Draws vertical dashed line representing net.
   */
  private drawNet() {
    let netWidth = 3;
    let x = (this.width - netWidth) * 0.5;
    let y = 0;
    let step = this.height / 15;
    while (y < this.height) {
      this.ctx.fillRect(x , y + step * 0.25, netWidth, step * 0.5);
      y += step;
    }
  }

  // UI messages
  private pauseMessage = '[P]aused ...';
  private startMessage = 'Press Space to start';
  private legendMessage = 'Up/Down to moveme, P/Space to toggle pause, Esc to reset';

  private drawLegend(){
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.legendMessage, this.canvas.width / 2, this.canvas.height / 20 * 19);
  }
  private drawStartMessage() {
    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.startMessage, this.canvas.width / 2, this.canvas.height / 2);
  }
  private drawPausedMessage(){
    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.pauseMessage, this.canvas.width / 2, this.canvas.height / 2);
  }
  private onKeyDown(evt: any, keys: IKeyMap) {
    keys[evt.keyCode] = true;
  }

  private onKeyUp(evt: any, keys: IKeyMap){
    delete keys[evt.keyCode];

    if (evt.keyCode === this.key_p) this.togglePause();
    if (evt.keyCode === this.key_space && this.started) this.togglePause();
    if (evt.keyCode === this.key_space && !this.started) this.started = true;
    if (evt.keyCode === this.key_esc) this.reset();
  }

  private onGameReset() {
    if (this.gameReset()) this.gameReset();
  }

  private onGamePaused() {
    if (this.gamePaused) this.gamePaused(this.paused ? 'paused' : 'running');
  }
}
