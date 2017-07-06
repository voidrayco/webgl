let typeCounter = 0;

/**
 * This defines an object that is considered drawable. This will contain
 * all of the most basic requirements for drawing an item.
 */
export class Types {
  static Circle:    number = typeCounter++;
  static Line:      number = typeCounter++;
}

export function drawable(theType: number) {
  return <TFunction extends Function>(target: TFunction): TFunction | void => {
    target.prototype.type = theType;
    target.prototype.depth = 0;

    return target;
  };
}
