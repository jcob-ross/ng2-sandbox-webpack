import {Entity} from './Entity';
import {Ball} from "./Ball";
import {IVector2, IBounds} from "./Interfaces";

/**
 * Represents paddle controlled by AI
 */
export class AiPaddle extends Entity {
  private ball: Ball;
  /**
   * Creates new instance of AiPaddle
   * Usage:
   * After instantiating, setBallRef(..) must be called.
   * @param position
   * @param width
   * @param height
   * @param worldBounds
   */
  constructor(position:IVector2, width:number, height:number, worldBounds:IBounds) {
    super(position, width, height, worldBounds);
  }

  /**
   * Updates
   * @throws Error when reference to ball is not defined.
   */
  public update() {
    if (this.ball == undefined) throw new Error("AiPaddle's ball reference is undefined. use setBallRef");

    let ballY = this.ball.position.y - (this.height - this.ball.height) * 0.5;
    this.position.y += (ballY - this.position.y) * 0.1;
    super.update();
  }

  /**
   * Sets pong ball reference.
   * Needed for paddle's ball tracking
   * @param ball
   */
  public setBallRef(ball:Ball) {
    this.ball = ball;
  }

  /**
   * Reset paddle to it's initial state it was at the beginning of the game.
   */
  public reset(){
    this.position.x = this.initialState.xPos;
    this.position.y = this.initialState.yPos;
  }
}
