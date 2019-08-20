export class LazyQuery<T> {
  private _filter?: (item: T) => boolean;
  private _filterIndex: number;
  private _filterItems: T[];
  private _items: T[];
  private _nextItem?: T;

  constructor(items: T[], filter?: (item: T) => boolean) {
    this._filter = filter;
    this._filterIndex = 0;
    this._filterItems  = [];
    this._items = items;
  }

  getItem() {
    if (!this.hasItem() || !this._nextItem) throw new Error();
    const currentItem = this._nextItem;
    this._filterItems.push(this._nextItem);
    this._nextItem = undefined;
    return currentItem;
  }

  hasItem() {
    if (!this._nextItem) {
      while (this._filterIndex < this._items.length) {
        if (!this._filter || this._filter(this._items[this._filterIndex])) {
          this._nextItem = this._items[this._filterIndex];
          this._filterIndex++;
          break;
        } else {
          this._filterIndex++;
        }
      }
    }
    return Boolean(this._nextItem);
  }
}
