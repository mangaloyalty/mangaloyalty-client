import * as app from '../../..';
import * as area from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  private readonly _context: app.ContextApi;

  constructor() {
    this._context = app.core.service.get(app.settings.contextKey);
    this.refreshAsync();
  }

  @mobx.action
  open(session: app.ISessionListItem) {
    app.core.screen.open(area.ChapterController, {
      session: session,
      title: session.url
    });
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const sessionList = await this._context.session.listAsync();
    if (sessionList.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = sessionList.value;
      });
    } else if (await app.core.dialog.errorAsync(sessionList.error)) {
      await this.refreshAsync(true);
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
