/**
 * Takes a map of the form <T, boolean> and returns an array of the keys,
 * excluding entries who's mapped value is false.
 *
 * @param map The map to convert to a list
 *
 * @return T[] A list of the keys, exluding false mappings
 */
export function boolMapToArray<T>(map: Map<T, boolean>): T[] {
  return Array
    .from(map)
    .filter((item: [T, boolean]) => item[1])
    .map((item: [T, boolean]) => item[0])
}

/**
 * Defines a selection control for custom types and categories
 */
export class CustomSelection {
  /** This caches the list generation of a selection */
  cachedSelection: Map<string, any[]> = new Map<string, any[]>()
  /** Map of the custom categories to the selection state */
  selections: Map<string, Map<any, boolean>> = new Map<string, Map<any, boolean>>()
  /** Keeps flags indicating if a selection for a given category has changed or not */
  _didSelectionChange: Map<string, boolean> = new Map<string, boolean>()

  /**
   * Clears out all custom selections for every category
   */
  clearAllSelections() {
    for (const key of this.selections.keys()) {
      this.clearSelection(key)
    }
  }

  /**
   * Clears the selection for the category specified
   *
   * @param {string} category Name of the category of selection
   */
  clearSelection(category: string) {
    // We must have selected items to clear the selection
    if (this.getSelection(category).length) {
      this.selections.set(category, null)
      this.cachedSelection.set(category, null)
      this._didSelectionChange.set(category, true)
    }
  }

  /**
   * Makes an item no longer flaged as selected within the given category
   *
   * @param category The custom category of the selection
   * @param item The item to remove from being selected
   */
  deselect<T>(category: string, item: T) {
    let selectionMap: Map<T, boolean> = this.selections.get(category)

    // See if the item is selected already, if it is, clear the selection and bust caches
    if (selectionMap.get(item)) {
      // Clear the cache for the selection list
      this.cachedSelection.set(category, null)
      // Set the selection
      selectionMap.set(item, false)
      // Flag the category of selections as changed
      this._didSelectionChange.set(category, true)
    }
  }

  /**
   * Checks if a selection from a category has been modified
   *
   * @param {string} category The selection category to check
   */
  didSelectionCategoryChange(category: string): boolean {
    return this._didSelectionChange.get(category)
  }

  /**
   * Checks if ANY selection has changed
   *
   * @return {boolean} True if any selection has changed
   */
  didSelectionChange(): boolean {
    return boolMapToArray<string>(this._didSelectionChange).length > 0
  }

  /**
   * This indicates that updates have taken place to account for selection
   * changes.
   */
  finalizeUpdate() {
    for (const key of this._didSelectionChange.keys()) {
      this._didSelectionChange.set(key, false)
    }
  }

  /**
   * This retrieves a list of the items that are selected
   *
   * @param category The selection category to check on
   *
   * @return {T} Returns a list of items that are currently selected
   */
  getSelection<T>(category: string): T[] {
    if (!this.cachedSelection.get(category)) {
      const theSelection = this.selections.get(category)

      if (theSelection) {
        this.cachedSelection.set(category, boolMapToArray<T>(theSelection))
      }

      else {
        this.cachedSelection.set(category, [])
      }
    }

    return this.cachedSelection.get(category)
  }

  /**
   * Specifies an item to flag as selected for the given category
   *
   * @param category The custom category of the selection
   * @param item The item to flag as selected
   */
  select<T>(category: string, item: T) {
    let selectionMap: Map<T, boolean> = this.selections.get(category)

    if (!selectionMap) {
      selectionMap = new Map<T, boolean>()
      this.selections.set(category, selectionMap)
    }

    if (!selectionMap.get(item)) {
      // Clear the cache for the selection list
      this.cachedSelection.set(category, null)
      // Set the selection
      selectionMap.set(item, true)
      // Flag the category of selections as changed
      this._didSelectionChange.set(category, true)
    }
  }

  /**
   * Specifies an item to toggle it's selection status for the provided category
   *
   * @param category The custom category of the selection
   * @param item The item to flag as selected
   */
  toggleSelect<T>(category: string, item: T) {
    let selectionMap: Map<T, boolean> = this.selections.get(category)

    if (!selectionMap) {
      selectionMap = new Map<T, boolean>()
      this.selections.set(category, selectionMap)
    }

    // Clear the cache for the selection list
    this.cachedSelection.set(category, null)

    // Toggle the selection off if already selected
    if (selectionMap.get(item)) {
      this.deselect<T>(category, item)
    }

    // We perform the select method instead of direct manipulation to make the select
    // method be the one true source of selecting an item, thus making relative selections
    // easy to generate
    else {
      this.select<T>(category, item)
    }

    // Flag the category of selections as changed
    this._didSelectionChange.set(category, true)
  }
}
