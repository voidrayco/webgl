import { CustomSelection } from 'webgl-surface/util/custom-selection';
export declare enum SelectionType {
    MOUSEOVER_OUTER_RING = 0,
    MOUSEOVER_CHORD = 1,
    SELECTED_CHORD = 2,
    RELATED_SELECTED_OUTER_SECTIONS = 3,
}
export declare class Selection extends CustomSelection {
}
