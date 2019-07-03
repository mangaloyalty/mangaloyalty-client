import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';
const core = app.core;

export class MainViewModel {
  private readonly _context: app.ContextApi;

  constructor() {
    this._context = core.service.get('ContextApi');
    this.refreshAsync();
  }

  @mobx.action
  openAsync(session: app.ISessionListItem) {
    core.screen.open(area.ChapterController, session);
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const sessionList = await this._context.sessionList();
    if (sessionList.result) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = sessionList.result;
      });
    } else if (await core.dialog.errorAsync(sessionList.error)) {
      this.refreshAsync(true);
    }
  }

  @mobx.computed
  get sessions() {
    return this.source;
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  private source?: app.ISessionListItem[];
}
