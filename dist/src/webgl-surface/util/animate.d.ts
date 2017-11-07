import { EasingMethod } from './easing';
export interface IAnimateValue {
    container: any;
    duration: number;
    easing: EasingMethod;
    end: number;
    prop: string;
    start: number;
}
export interface IAnimatePoint {
    container: any;
    duration: number;
    easing: EasingMethod;
    end: number;
    prop: string;
    start: number;
}
export declare class Animate {
    private static playState;
    private static animating;
    static animate(): void;
    static cancel(container: any, prop: string): void;
    static value(container: any, prop: string, start: number, end: number, duration: number, ease: EasingMethod): void;
    static point(container: any): void;
    static start(): void;
    static stop(): void;
}
