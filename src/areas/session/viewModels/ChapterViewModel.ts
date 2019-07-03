import * as app from '../../..';
import * as mobx from 'mobx';
const core = app.core;

export class ChapterViewModel {
  private readonly _context: app.ContextApi;
  private readonly _id: number;
  private readonly _pageCount: number;

  constructor(id: number, pageCount: number) {
    this._context = core.service.get('ContextApi');
    this._id = id;
    this._pageCount = pageCount;
    this.refreshAsync();
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    console.log({
      context: this._context,
      id: this._id,
      pageCount: this._pageCount,
      source: this.source
    });
    /*
    this.isLoading = true;
    const sessionList = await this._context.sessionList();
    if (sessionList.result) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = sessionList.result;
      });
    } else if (await core.dialog.errorAsync(sessionList.error)) {
      this.refreshAsync(true);
    }*/
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  private source?: app.ISessionPage[];
}
