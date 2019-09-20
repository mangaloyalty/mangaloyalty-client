import * as app from '..';
import * as areas from '../../areas';

export class Navigator implements app.INavigator {
  private readonly _chapters: app.IRemoteSeriesChapter[];
  private readonly _context: app.ContextApi;
  private _index: number;

  constructor(context: app.ContextApi, chapters: app.IRemoteSeriesChapter[], index: number) {
    this._chapters = chapters;
    this._context = context;
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

  private async _openAsync() {
    await app.core.screen.loadAsync(async () => {
      const chapter = this._chapters[this._index];
      const session = await this._context.remote.startAsync(chapter.url);
      if (session.value) {
        const constructAsync = areas.session.ChapterController.createConstruct(session.value, chapter.title, this);
        await app.core.screen.replaceChildAsync(constructAsync);
      } else if (await app.core.dialog.errorAsync(true, session.error)) {
        await this._openAsync();
      }
    });
  }
}
