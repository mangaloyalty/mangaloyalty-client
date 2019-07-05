import * as app from '../../..';
import * as areas from '../..';

export class Navigator implements app.INavigator {
  private readonly _context: app.ContextApi;
  private readonly _series: app.ISeriesDetail;
  private _index: number;

  constructor(context: app.ContextApi, index: number, series: app.ISeriesDetail) {
    this._context = context;
    this._index = index;
    this._series = series;
  }

  get hasNext() {
    return this._index - 1 >= 0;
  }

  get hasPrevious() {
    return this._index + 1 < this._series.chapters.length;
  }

  async openCurrent() {
    await this._openOrCreateAsync(false);
  }
  
  async openNextAsync() {
    if (!this.hasNext) return;
    this._index--;
    await this._openOrCreateAsync(true);
  }

  async openPreviousAsync() {
    if (!this.hasPrevious) return;
    this._index++;
    await this._openOrCreateAsync(true);
  }

  private async _createAsync(shouldClose: boolean) {
    const chapter = this._series.chapters[this._index];
    const session = await this._context.remoteStart(chapter.url);
    if (session.result) {
      this.screen(chapter, session.result, shouldClose);
    } else if (await app.core.dialog.errorAsync(session.error)) {
      await this._createAsync(shouldClose);
    }
  }

  private async _openOrCreateAsync(shouldClose: boolean) {
    const chapter = this._series.chapters[this._index];
    const sessionList = await this._context.sessionList();
    const session = sessionList.result && sessionList.result.find((session) => chapter.url === session.url);
    if (session) {
      this.screen(chapter, session, shouldClose);
    } else {
      await this._createAsync(shouldClose);
    }
  }

  private screen(chapter: app.ISeriesDetailChapter, session: app.ISessionListItem, shouldClose: boolean) {
    if (shouldClose) app.core.screen.close();
    app.core.screen.open(areas.session.ChapterController, {
      navigator: this,
      session: session,
      title: chapter.title
    });
  }
}
