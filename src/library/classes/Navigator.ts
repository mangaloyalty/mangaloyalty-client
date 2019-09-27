import * as app from '..';
import * as areas from '../../areas';

export class Navigator implements app.INavigator {
  private readonly _chapters: app.SeriesChapterViewModel[];
  private readonly _seriesId: string;
  private _index: number;

  constructor(private _context: app.ContextApi, seriesId: string, chapters: app.SeriesChapterViewModel[], index: number) {
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
    await this._openAsync();
  }

  async openPreviousAsync() {
    if (!this.hasPrevious) return;
    this._index++;
    await this._openAsync();
  }
  
  async trackAsync(pageCount: number, pageReadNumber: number) {
    return await app.core.screen.loadAsync(async () => {
      const chapter = this._chapters[this._index];     
      const response = await this._context.library.chapterPatchAsync(this._seriesId, chapter.id, pageReadNumber >= pageCount || undefined, pageReadNumber);
      return response.status === 200;
    });
  }

  private async _openAsync() {
    await app.core.screen.loadAsync(async () => {
      const chapter = this._chapters[this._index];     
      const session = await this._context.library.chapterReadAsync(this._seriesId, chapter.id);
      if (session.value) {
        const pageNumber = chapter.pageReadNumber && Math.max(Math.min(chapter.pageReadNumber, session.value.pageCount), 1);
        const constructAsync = areas.session.ChapterController.createConstruct(session.value, chapter.title, this, pageNumber);
        await app.core.screen.replaceChildAsync(constructAsync);
      } else if (session.status === 404) {
        await app.core.screen.leaveAsync();
      } else {
        await app.core.dialog.errorAsync(session.error);
        await this._openAsync();
      }
    });
  }
}
