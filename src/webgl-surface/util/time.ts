/**
 * This gets an integer time value that can fit within an attribute. Be aware,
 * this only supports up to 7 digits of the millisecond time.
 */
export function getAttributeCurrentTime() {
  const time = Date.now() / 1E7;
  return Math.floor((time - Math.floor(time)) * 1E7);
}
