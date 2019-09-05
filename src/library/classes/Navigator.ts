import * as app from '..';
import * as areas from '../../areas';

export class Navigator implements app.INavigator {
  private readonly _chapters: app.ChapterViewModel[];
  private readonly _context: app.ContextApi;
  private readonly _seriesId: string;
  private _index: number;

  constructor(context: app.ContextApi, seriesId: string, chapters: app.ChapterViewModel[], index: number) {
    this._chapters = chapters;
    this._context = context;
    this._seriesId = seriesId;
    this._index = index;
  }

  get hasNext() {
    return this._index - 1 >= 0;
  }

  get hasPrevious() {
    return this._index + 1 < this._chapters.length;
  }

  async openCurrentAsync() {
    await this._openAsync(false);
  }
  
  async openNextAsync() {
    if (!this.hasNext) return;
    this._index--;
    await this._openAsync(true);
  }

  async openPreviousAsync() {
    if (!this.hasPrevious) return;
    this._index++;
    await this._openAsync(true);
  }
  
  async statusAsync(pageCount: number, pageReadNumber: number) {
    const isReadCompleted = pageReadNumber >= pageCount ? true : undefined;
    await this._chapters[this._index].statusAsync(isReadCompleted, pageReadNumber);
  }

  private async _openAsync(shouldClose: boolean) {
    const chapter = this._chapters[this._index];
    const session = await this._context.library.chapterReadAsync(this._seriesId, chapter.id);
    if (session.value) {
      if (shouldClose) app.core.screen.close();
      const pageNumber = chapter.pageReadNumber && chapter.pageReadNumber < session.value.pageCount ? chapter.pageReadNumber : undefined;
      app.core.screen.open(areas.session.ChapterController, {navigator: this, pageNumber: pageNumber, session: session.value, title: chapter.title});
    } else if (await app.core.dialog.errorAsync(true, session.error)) {
      await this._openAsync(shouldClose);
    }
  }
}
