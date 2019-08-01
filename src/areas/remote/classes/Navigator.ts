import * as app from '../../..';
import * as areas from '../..';

export class Navigator implements app.INavigator {
  private readonly _context: app.ContextApi;
  private readonly _series: app.IRemoteSeries;
  private _index: number;

  constructor(context: app.ContextApi, index: number, series: app.IRemoteSeries) {
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

  private async _openAsync(shouldClose: boolean) {
    const chapter = this._series.chapters[this._index];
    const session = await this._context.remote.startAsync(chapter.url);
    if (session.value) {
      if (shouldClose) app.core.screen.close();
      app.core.screen.open(areas.session.ChapterController, {navigator: this, session: session.value, title: chapter.title});
    } else if (await app.core.dialog.errorAsync(session.error)) {
      await this._openAsync(shouldClose);
    }
  }
}
