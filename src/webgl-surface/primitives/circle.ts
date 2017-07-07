import {Bounds} from './bounds';
import {IPoint} from './point';

let UID = 0;

export class Circle<T> extends Bounds<T> {
  /** a UID of the circle */
  _id = ++UID;
  /** Radius of the circle */
  _radius = 0;
  /** X coord of the center of the circle */
  _centerX = 0;
  /** Y coord of the center of the circle */
  _centerY = 0;

  get values() {
    return {
      radius: this._radius,
      x: this._centerX,
      y: this._centerY,
    };
  }

  set radius(val) {
    this._radius = val;
    this.updateBounds();
  }

  get radius() {
    return this._radius;
  }

  set centerX(val) {
    this._centerX = val;
    this.updateBounds();
  }

  get centerX() {
    return this._centerX;
  }

  set centerY(val) {
    this._centerY = val;
    this.updateBounds();
  }

  get centerY() {
    return this._centerY;
  }

  /**
   * Generate a new Circle object
   *
   * @param x The center of the circle
   * @param y The center of the circle
   * @param r The radius of the circle
   * @param d A data object to associate with the circle
   */
  constructor(x : number, y : number, r : number, d?: any) {
    super(0, 0, 0, 0);
    this._centerX = x;
    this._centerY = y;
    this._radius = r;
    this.d = d;
    this.updateBounds();
  }

  /**
   * Tests if the specified bounds is inside this circle
   *
   * @param b The bounds to test against
   */
  boundsInside(b: Bounds<any>) {
    const r2 = this._radius * this._radius;
    let dx = b.x - this._centerX;
    let dy = b.y - this._centerY;
    let dy2 = dy * dy;
    let dx2 = dx * dx;

    if ((dx2 + dy2) > r2) {
      return false;
    }
    dx = b.right - this._centerX;
    dx2 = dx * dx;

    if ((dx2 + dy2) > r2) {
      return false;
    }
    dy = b.bottom - this._centerY;
    dy2 = dy * dy;

    if ((dx2 + dy2) > r2) {
      return false;
    }
    dx = b.x - this._centerX;
    dx2 = dx * dx;

    return (dx2 + dy2) < r2;
  }

  /**
   * Calculates the distance to a provided point
   *
   * @param {IPoint} p The point to calculate the distance of the middle of the
   *                   circle to
   * @param {boolean} notSquared Flag true to prevent the Math.sqrt operation, leaving
   *                             the result as distance^2
   *
   * @return {number} The distance from mid circle to the point
   */
  distanceTo(p: IPoint, notSquared?: boolean) {
    const dx = this._centerX - p.x;
    const dy = this._centerY - p.y;

    if (notSquared) {
      return dx * dx + dy * dy;
    }

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Retrieves the closest circle to a provided point
   *
   * @param {Array} circles The circles to see who is the nearest
   * @param {IPoint} p The point to compare the circles against for nearness
   *
   * @return {Circle} The nearest circle
   */
  static getClosest(circles: Circle<any>[], p: IPoint) {
    let closestCircle;
    let closestDistance = Number.MAX_VALUE;
    let distance = 0;

    circles.forEach((circle) => {
      distance = circle.distanceTo(p, true);
      if (distance < closestDistance) {
        closestCircle = circle;
        closestDistance = distance;
      }
    });

    return closestCircle;
  }

  /**
   * Tests if this circle is colliding with the specified circle
   *
   * @param c The circle to test against
   *
   * @return {boolean} True if colliding
   */
  hitCircle(c: Circle<any>): boolean {
    let totalDistance = c._radius + this._radius;
    totalDistance *= totalDistance;
    return this.distanceTo({x: c._centerX, y: c._centerY}, true) < totalDistance;
  }

  /**
   * @override
   * This makes it so the test of a point tests based on a Circle shape
   *
   * @param p The point to test if inside the circle
   *
   * @return True if the point is inside
   */
  hitPoint(p: IPoint): boolean {
    const r2 = this._radius * this._radius;
    const dx = p.x - this._centerX;
    const dy = p.y - this._centerY;

    return (dx * dx + dy * dy) < r2;
  }

  /**
   * If there are multiple metrics to update for the circle, this is the most
   * efficient way to do that as it will update it's bounds only once.
   *
   * @param x
   * @param y
   * @param r
   */
  position(x : number, y : number, r : number) {
    this._centerX = x;
    this._centerY = y;
    this._radius = r;
    this.updateBounds();
  }

  /**
   * @override
   * Tests if a point is inside the circle
   *
   * @param p The point to test if inside the circle
   *
   * @return True if the point is inside
   */
  pointInside(p: IPoint): boolean {
    const r2 = this._radius * this._radius;
    const dx = p.x - this._centerX;
    const dy = p.y - this._centerY;

    return (dx * dx + dy * dy) < r2;
  }

  /**
   * When the circle gains different circle metrics, it's Bounds must adjust
   * accordingly, which is what this method recalculates.
   */
  updateBounds() {
    const radius = this._radius;
    this.x = this._centerX - radius;
    this.y = this._centerY - radius;
    this.height = radius * 2;
    this.width = radius * 2;
  }

  /**
   * Pretty print the metrics of this circle
   */
  toString() {
    return `[Circle {x: ${this._centerX}, y: ${this._centerY}, r: ${this._radius}}]`;
  }
}
