import { IPoint } from './point';

/**
 * Class to manage the x, y, width, and height of an object
 *
 * @template T This specifies the data type associated with this shape and is accessible
 *             via the property 'd'
 */
export class Bounds<T> {
  /** The total rectangular surface area of this instance */
  get area() {
    return this.width * this.height;
  }

  /** The bottom coordinate for this instance (y + height) */
  get bottom() {
    return this.y + this.height;
  }

  height = 0;

  item : null;

  /** An x, y coordinate pair representing the center of this object */
  get mid() {
    return {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2),
    };
  }

  get right() {
    return this.x + this.width;
  }

  /** A data object for relating this shape to some information */
  d: T;
  width = 0;
  x = 0;
  y = 0;

  /**
   * Create a new instance
   *
   * @param left  The left side (x coordinate) of the instance
   * @param right The right side of the instance
   * @param top The top (y coordinate) of the instance
   * @param bottom The bottom of the instance
   */
  constructor(left : number, right : number, top : number, bottom : number) {
    if (arguments.length === 4) {
      this.x = left;
      this.width = right - left;
      this.y = top;
      this.height = bottom - top;
    }
  }

  /**
   * Check to see if a given point lies within the bounds of this instance
   *
   * @param point The point to check
   */
  containsPoint(point : IPoint) {
    if (point.x < this.x) {
      return false;
    }

    if (point.y < this.y) {
      return false;
    }

    if (point.x > this.right) {
      return false;
    }

    if (point.y > this.bottom) {
      return false;
    }

    return true;
  }

  /**
   * Copies the properties of the bounds specified
   *
   * @param b The bounds whose dimensions we wish to copy
   */
  copyBounds(b: Bounds<any>) {
    this.height =  b.height;
    this.width  = b.width;
    this.x      = b.x;
    this.y      = b.y;
  }

  /**
   * Ensure that this object contains the smaller bounds
   *
   * This method will not shrink this class, but only grow it as necessary to
   * fit the destination object
   *
   * @param bounds The bounds to encapsulate
   */
  encapsulate(bounds : Bounds<any>) {
    if (bounds.x < this.x) {
      this.width += this.x - bounds.x;
      this.x = bounds.x;
    }

    if (bounds.y < this.y) {
      this.height += this.y - bounds.y;
      this.y = bounds.y;
    }

    if (bounds.right > this.right) {
      this.width = bounds.right - this.x;
    }

    if (bounds.bottom > this.bottom) {
      this.height = bounds.bottom - this.y;
    }
  }

  /**
   * Ensure that this object contains the provided list of bounds
   *
   * This will never shrink or modify the original area covered by this bounds
   * but will instead stay the same or include the original area plus the specified
   * list of bounds.
   *
   * @param {Bounds<any>[]} bounds The list of bounds objects to encapsulate
   * @param {boolean} sizeToFirst If this is set, the procedure will start by making this bounds
   *                              be a clone of the first bounds object in the list
   */
  encapsulateBounds(bounds: Bounds<any>[], sizeToFirst?: boolean) {
    if (sizeToFirst && bounds.length) {
      this.copyBounds(bounds[0]);
    }

    if (bounds.length === 0) {
      return;
    }

    let minX = Number.MAX_VALUE, maxX = -Number.MAX_VALUE,
        minY = Number.MAX_VALUE, maxY = -Number.MAX_VALUE;

    bounds.forEach(p => {
      if (p.x < minX) {
        minX = p.x;
      }
      else if (p.right > maxX) {
        maxX = p.right;
      }
      if (p.y < minY) {
        minY = p.y;
      }
      else if (p.bottom > maxY) {
        maxY = p.bottom;
      }
    });

    // Make bounds that encompasses the bounds list, then we encapsulate
    // Those bounds
    this.encapsulate(new Bounds<any>(minX, maxX, minY, maxY));
  }

  /**
   * Grow this class to contain the specified point
   *
   * This method will not shrink this instance. It will only grow it as
   * necessary.
   *
   * @param point The point to encapsulate
   */
  encapsulatePoint(point : IPoint) {
    if (point.x < this.x) {
      this.width += this.x - point.x;
      this.x = point.x;
    }

    if (point.y < this.y) {
      this.height += this.y - point.y;
      this.y = point.y;
    }

    if (point.x > this.right) {
      this.width = point.x - this.x;
    }

    if (point.y > this.bottom) {
      this.height = point.y - this.y;
    }
  }

  /**
   * Efficiently encapsulates a set of points by growing the current dimensions
   * of the bounds until the points are enclosed. This will perform faster than
   * running encapsulatePoint for a list of points.
   *
   * @param points An array of points that Can be of format {x, y} or [x, y]
   *
   * @memberOf Bounds
   */
  encapsulatePoints(points: any[]) {
    let minX = Number.MAX_VALUE, maxX = -Number.MAX_VALUE,
        minY = Number.MAX_VALUE, maxY = -Number.MAX_VALUE;

    if (points[0] !== undefined && points[0].x) {
      points.forEach(p => {
        if (p.x < minX) {
          minX = p.x;
        }
        else if (p.x > maxX) {
          maxX = p.x;
        }
        if (p.y < minY) {
          minY = p.y;
        }
        else if (p.y > maxY) {
          maxY = p.y;
        }
      });
    }

    else {
      points.forEach(p => {
        if (p[0] < minX) {
          minX = p[0];
        }
        else if (p[0] > maxX) {
          maxX = p[0];
        }
        if (p[1] < minY) {
          minY = p[1];
        }
        else if (p[1] > maxY) {
          maxY = p[1];
        }
      });
    }

    // Make bounds that encompasses the points, then we encapsulate
    // Those bounds
    this.encapsulate(new Bounds<any>(minX, maxX, minY, maxY));
  }

  /**
   * Checks to see if another bounds fits in itself.
   *
   * @param {Bounds} inner The bounds to test against
   *
   * @return {number} int 1 is an exact fit, 2 it fits with space, 0 it doesn't fit
   */
  fits(inner: Bounds<T>): number {
    if (this.width === inner.width) {
      if (this.height === inner.height) {
        return 1;
      }
    }

    if (this.width >= inner.width) {
      if (this.height >= inner.height) {
        return 2;
      }
    }

    return 0;
  }

  /**
   * Check to see if the provided bounds intersects with this instance
   *
   * @param bounds The bounds to test against this instance
   *
   * @return True if the other object intersects with this instance
   */
  hitBounds(bounds : Bounds<T>) {
    if (bounds.right < this.x) { return false; }
    if (bounds.x > this.right) { return false; }
    if (bounds.bottom < this.y) { return false; }
    if (bounds.y > this.bottom) { return false; }

    return true;
  }

  /**
   * Tests if a point is inside this bounds
   *
   * @param p The point to test
   *
   * @return boolean The point to test
   */
  pointInside(p: IPoint): boolean {
    if (p.x < this.x) {
      return false;
    }
    if (p.y < this.y) {
      return false;
    }
    if (p.x > this.right) {
      return false;
    }
    if (p.y > this.bottom) {
      return false;
    }
    return true;
  }

  /**
   * Test function to type check the provided value
   *
   * @return True if value is a bounds object
   */
  static isBounds(value : any) : value is Bounds<any> {
    // Falsy values aren't bounds objects
    if (!value) { return false; }
    // Direct test for bounds objects
    if (value instanceof this) { return true; }

    // Duck-typing check
    return value &&
      'containsPoint' in value &&
      'encapsulate' in value &&
      'hitTest' in value;
  }

  /**
   * Check if the provided bounds is completely contained within this instance
   *
   * @param bounds The bounds to test against this instance
   *
   * @return True if the provided bounds is completely contained within this
   * instance
   */
  isInside(bounds : Bounds<T>) {
    return (
      bounds.x <= this.x &&
      bounds.right >= this.right &&
      bounds.y <= this.y &&
      bounds.bottom >= this.bottom
    );
  }

  /**
   * Generates a Bounds object covering max extents
   *
   * @return {Bounds} bounds covering as wide of a range as possible
   */
  static maxBounds() {
    return new Bounds(
      Number.MIN_VALUE, Number.MAX_VALUE,
      Number.MIN_VALUE, Number.MAX_VALUE,
    );
  }
}
