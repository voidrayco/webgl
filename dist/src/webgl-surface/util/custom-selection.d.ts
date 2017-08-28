/**
 * Takes a map of the form <T, boolean> and returns an array of the keys,
 * excluding entries who's mapped value is false.
 *
 * @param map The map to convert to a list
 *
 * @return T[] A list of the keys, exluding false mappings
 */
export declare function boolMapToArray<T>(map: Map<T, boolean>): T[];
/**
 * Defines a selection control for custom types and categories
 */
export declare class CustomSelection {
    /** This caches the list generation of a selection */
    cachedSelection: Map<string | number, any[]>;
    /** Map of the custom categories to the selection state */
    selections: Map<string | number, Map<any, boolean>>;
    /** Keeps flags indicating if a selection for a given category has changed or not */
    _didSelectionChange: Map<string | number, boolean>;
    /**
     * Clears out all custom selections for every category
     */
    clearAllSelections(): void;
    /**
     * Clears the selection for the category specified
     *
     * @param {string} category Name of the category of selection
     */
    clearSelection(category: string | number): void;
    /**
     * Makes an item no longer flaged as selected within the given category
     *
     * @param category The custom category of the selection
     * @param item The item to remove from being selected
     */
    deselect<T>(category: string | number, item: T): void;
    /**
     * Checks if a selection from a category has been modified
     *
     * @param {string} category The selection category to check
     */
    didSelectionCategoryChange(category: string | number): boolean;
    /**
     * Checks if ANY selection has changed
     *
     * @return {boolean} True if any selection has changed
     */
    didSelectionChange(): boolean;
    /**
     * This indicates that updates have taken place to account for selection
     * changes.
     */
    finalizeUpdate(): void;
    /**
     * This retrieves a list of the items that are selected
     *
     * @param category The selection category to check on
     *
     * @return {T} Returns a list of items that are currently selected
     */
    getSelection<T>(category: string | number): T[];
    /**
     * Specifies an item to flag as selected for the given category
     *
     * @param category The custom category of the selection
     * @param item The item to flag as selected
     */
    select<T>(category: string | number, item: T): void;
    /**
     * Specifies an item to toggle it's selection status for the provided category
     *
     * @param category The custom category of the selection
     * @param item The item to flag as selected
     */
    toggleSelect<T>(category: string | number, item: T): void;
}
