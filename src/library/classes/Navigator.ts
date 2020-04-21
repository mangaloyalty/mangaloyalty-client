import * as app from '..';
import * as areas from '../../areas';

export class Navigator implements app.INavigator {
  private readonly _chapters: app.SeriesListItemViewModel[];
  private readonly _seriesId: string;
  private _index: number;

  constructor(seriesId: string, chapters: app.SeriesListItemViewModel[], index: number) {
    this._chapters = chapters;
    this._seriesId = seriesId;
    this._index = index;
  }

  get hasNext() {
    return this._index - 1 >= 0;
  }

  get hasPrevious() {
    return this._index + 1 < this._chapters.length;
  }
  
  async openNextAsync() {
    if (!this.hasNext) return;
    this._index--;
    await this._openAsync(false);
  }

  async openPreviousAsync(isPageNavigation: boolean) {
    if (!this.hasPrevious) return;
    this._index++;
    await this._openAsync(isPageNavigation);
  }
  
  async trackAsync(pageCount: number, pageReadNumber: number) {
    const chapter = this._chapters[this._index];     
    const response = await app.api.library.chapterPatchAsync(this._seriesId, chapter.id, pageReadNumber >= pageCount || undefined, pageReadNumber);
    if (response.status !== 200) return false;
    chapter.pageReadNumber = pageReadNumber;
    return true;
  }

  private async _openAsync(isReverse: boolean) {
    const chapter = this._chapters[this._index];
    const session = await app.api.library.chapterReadAsync(this._seriesId, chapter.id);
    if (session.value) {
      const pageNumber = isReverse ? session.value.pageCount : 1;
      const constructAsync = areas.session.MainController.createConstruct(this, pageNumber, session.value, chapter.title);
      await app.core.screen.replaceChildAsync(constructAsync);
    } else if (session.status === 404) {
      await app.core.screen.leaveAsync();
    } else {
      await app.core.dialog.errorAsync(() => this._openAsync(isReverse), session.error);
    }
  }
}
