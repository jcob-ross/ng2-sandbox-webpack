/**
 * Represents axis aligned bounding rectangle
 */
export interface IBounds {
  /**
   * Left boundary, usually 0
   */
  left: number;
  /**
   * Right boundary, usually width
   */
  right: number;
  /**
   * Top boundary, usually 0
   */
  top: number;
  /**
   * Bottom boundary, usually height
   */
  bottom: number;
}

/**
 * Number to boolean key map
 */
export interface IKeyMap {
  [index: number]: boolean;
}

/**
 * Represents 2d point
 */
export interface IVector2{
  x: number;
  y: number;
}

export interface IState {
  xPos: number;
  yPos: number;
  speed: number;
  directionX: number;
  directionY: number;
}
