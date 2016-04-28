import {IState, IBounds, IVector2} from "./Interfaces";

/**
 * Represents entity that can be drawn and updated.
 * Base class for AiPaddle and Ball.
 */
export class Entity {
  protected initialState: IState;
  /**
   * Bounding rectangle of the collidable world.
   */
  protected worldBounds: IBounds;
  /**
   * Position of the top-left corner of the entity
   */
  position: IVector2;
  /**
   * Width of the entity
   */
  width: number;
  /**
   * Height of the entity
   */
  height: number;

  /**
   * Creates new instance of Entity class
   * @param position Position of the entity. Top-left corner
   * @param width Width of the entity.
   * @param height Height of the entity.
   * @param worldBounds IBounds of the collidable world.
   */
  constructor(position: IVector2, width: number, height: number, worldBounds: IBounds) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.worldBounds = worldBounds;
    this.initialState = {xPos: position.x, yPos: position.y, speed: null, directionX: null, directionY: null};
  }

  /**
   * Draws the entity using provided 2d context.
   * @param ctx Context used to draw the entity on the canvas
   */
  public draw(ctx: CanvasRenderingContext2D){
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  /**
   * Updates entity.
   */
  public update(){
    this.position.y = Math.max(Math.min(this.position.y, this.worldBounds.bottom - this.height), 0);
  }

  /**
   * Moves the entity by provided offset
   * @param offset Offset value to move the entity by.
   */
  public move(offset: IVector2) {
    this.position.x += offset.x;
    this.position.y += offset.y;
  }

  /**
   * Resets paddle to it's initial state it was at the beginning of the game.
   */
  public reset(){
    this.position.x = this.initialState.xPos;
    this.position.y = this.initialState.yPos;
  }
}
