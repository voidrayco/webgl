/// <reference types="react" />
import { Vector2 } from 'three';
declare let normalizeWheel: (e: React.WheelEvent<HTMLDivElement>) => Vector2;
/**
 * Analyzes a MouseEvent and calculates the mouse coordinates (relative to the element).
 */
declare function eventElementPosition(e: any, relative?: HTMLElement): {
    x: number;
    y: number;
};
export { eventElementPosition, normalizeWheel };
