export interface IGetFontMetricsProps {
    ctx: CanvasRenderingContext2D;
    text: string;
    bboxHeight: number;
    fontFamily: string;
    baseline?: string;
    flip?: boolean;
    drawBaseline?: boolean;
    fontSize: number;
}
export declare function getFontMetrics(props: IGetFontMetricsProps): {
    bottom: number;
    height: number;
    left: number;
    top: number;
    width: number;
};
