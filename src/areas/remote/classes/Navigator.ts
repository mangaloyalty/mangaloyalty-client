import * as app from '../../..';
import * as areas from '../..';

export class Navigator implements app.INavigator {
  private readonly _context: app.ContextApi;
  private readonly _series: app.IRemoteDetail;
  private _index: number;

  constructor(context: app.ContextApi, index: number, series: app.IRemoteDetail) {
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

  async openCurrentAsync() {
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
    const session = await this._context.remote.startAsync(chapter.url);
    if (session.value) {
      this.screen(chapter, session.value, shouldClose);
    } else if (await app.core.dialog.errorAsync(session.error)) {
      await this._createAsync(shouldClose);
    }
  }

  private async _openOrCreateAsync(shouldClose: boolean) {
    const chapter = this._series.chapters[this._index];
    const sessionList = await this._context.session.listAsync();
    const session = sessionList.value && sessionList.value.find((session) => chapter.url === session.url);
    if (session) {
      this.screen(chapter, session, shouldClose);
    } else {
      await this._createAsync(shouldClose);
    }
  }

  private screen(chapter: app.IRemoteDetailChapter, session: app.ISessionListItem, shouldClose: boolean) {
    if (shouldClose) app.core.screen.close();
    app.core.screen.open(areas.session.ChapterController, {
      navigator: this,
      session: session,
      title: chapter.title
    });
  }
}
