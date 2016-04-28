import {Entity} from "./Entity";
import {IVector2, IBounds} from "./Interfaces";
import {AiPaddle} from "./AiPaddle";

/**
 * Represents pong ball
 */
export class Ball extends Entity {
  private player: Entity;
  private ai: Entity;
  private fired: boolean;
  //private initialState: {xPos,yPos,speed,directionX,directionY};
  /**
   * Direction the ball is moving in
   */
  direction: IVector2;
  /**
   * Speed coefficient of the ball
   */
  speed: number;

  /**
   * Callback invoked when ball reaches either left or right boundary of the world
   */
  private goalScored: (side: "player"|"ai") => void;

  /**
   * Creates new instance of the Ball class
   * @param position Position of the top-left corner of the ball
   * @param width Width of the ball
   * @param height Height of the ball
   * @param worldBounds Bounding rectangle the ball will collide with
   * @param player Reference to the player paddle
   */
  constructor(position: IVector2, width:number, height:number, worldBounds: IBounds, player: Entity) {
    super(position, width, height, worldBounds);
    let speed = 8;
    this.direction = {x: -1, y: 0};
    this.speed = speed;
    this.player = player;

    this.initialState = {
      xPos: position.x,
      yPos: position.y,
      speed: speed,
      directionX: -1,
      directionY: 0
    }
  }

  /**
   * Updates ball's properties
   */
  update() {
    if (this.ai == undefined) throw new Error("Ball's ai reference is undefined. use setAiRef");
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
    if (this.worldBounds.top > this.position.y || this.worldBounds.bottom < this.position.y + this.width){
      // offset by 2 * penetration depth
      this.position.y += 2 * (this.direction.y < 0 ?
        0 - this.position.y : this.worldBounds.bottom - (this.position.y + this.width));
      this.direction.y *= -1;
    }

    // get paddle in direction the ball is moving towards and check/resolve collision
    let paddle: Entity = this.direction.x < 0 ? this.player : this.ai;
    let aPos = {x: paddle.position.x, y: paddle.position.y};
    let aSize = {x: paddle.width, y: paddle.height};
    let bPos = {x: this.position.x, y: this.position.y};
    let bSize = {x: this.width, y: this.height};
    if (Ball.AABBIntersect(aPos, aSize, bPos, bSize)) {
      // set position so ball is not penetrating
      this.position.x = paddle === this.player ? paddle.position.x + paddle.width : paddle.position.x - this.width;
      // 0 to 1 value representing where on the paddle was collision
      let offset = (this.position.y + this.height - paddle.position.y) / (paddle.height + this.height);
      // normalize offset to range -1 .. 1 and multiply by pi/4 (45 degrees)
      // that gives us angle ranging from -45 to 45 degrees
      // according to where on the paddle was the collision
      let phi = (2 * offset - 1) * 0.25 * Math.PI;

      // if angle is under some value, apply boost of 1.5, otherwise normal behavior
      // ..meaning hitting ball with corners (sharp angle) gives ball temporary boost in speed
      let boost = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;
      // set direction depending on who the ball is colliding with (1/-1) and apply rotation
      // multiply by boost
      this.direction.x = boost * (paddle === this.player ? 1 : -1) * Math.cos(phi);
      this.direction.y = boost * Math.sin(phi);
    }

    // goal is scored simply when ball oversteps left or right world
    // boundary by ~25 it's width
    if (this.position.x < this.worldBounds.left - 25 * this.width) {
      if (this.goalScored) this.goalScored('ai');
      this.respawn();
    }

    if (this.position.x > this.worldBounds.right + 25 * this.width) {
      if (this.goalScored) this.goalScored('player');
      this.respawn();
    }
  }

  /**
   * Checks for axis aligned bounding box intersection.
   * @param aPosition Position of the top-left corner of the first AABB
   * @param aSize Width and height of the first AABB
   * @param bPosition Position of the top-left corner of the second AABB
   * @param bSize Width and height of the second AABB
   * @returns {boolean} True if AABBs intersect, False otherwise
   */
  private static AABBIntersect(aPosition: IVector2, aSize: IVector2, bPosition: IVector2, bSize: IVector2){
    return  (aPosition.x < bPosition.x + bSize.x) &&
      (aPosition.y < bPosition.y + bSize.y) &&
      (bPosition.x < aPosition.x + aSize.x) &&
      (bPosition.y < aPosition.y + aSize.y);
  }

  /**
   * Respawns ball moving in the opposite x direction.
   */
  private respawn(){
    this.position.x = this.initialState.xPos;
    this.position.y = this.initialState.yPos;
    this.direction.y = 0;
    this.direction.x = this.direction.x > 0 ? -1 : 1;
  }

  /**
   * Stops and resets the ball to the state it was at the beginning of the game.
   */
  public reset(){
    this.position.x = this.initialState.xPos;
    this.position.y = this.initialState.yPos;
    this.direction.y = this.initialState.directionY;
    this.direction.x = this.initialState.directionX;
    this.fired = false;
  }

  /**
   * Sets reference to AI controlled paddle.
   * Needed for collision detection and scoring callback
   * @param ai Reference to store
   */
  setAiRef(ai:AiPaddle) {
    this.ai = ai;
  }

  /**
   * Sets callback invoked when ball reaches either left or right boundary of the world
   * @param cb Callback to be invoked
   */
  setGoalScoredCallback(cb: (side: "player"|"ai") => void){
    this.goalScored = cb;
  }
}
