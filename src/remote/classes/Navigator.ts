import * as app from '..';
import * as areas from '../..';

export class Navigator implements app.INavigator {
  private readonly _chapters: app.IRemoteSeriesChapter[];
  private _index: number;

  constructor(chapters: app.IRemoteSeriesChapter[], index: number) {
    this._chapters = chapters;
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

  private async _openAsync(isReverse: boolean) {
    const chapter = this._chapters[this._index];
    const session = await app.api.remote.startAsync(chapter.url);
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
