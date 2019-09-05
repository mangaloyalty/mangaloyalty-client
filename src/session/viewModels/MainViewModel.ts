import * as app from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  private readonly _context: app.ContextApi;

  constructor() {
    this._context = app.core.service.get(app.settings.contextKey);
    this.refreshAsync();
  }

  @mobx.action
  open(session: app.ISessionListItem) {
    app.core.screen.open(app.ChapterController, {
      session: session,
      title: session.url
    });
  }

  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const sessionList = await this._context.session.listAsync();
    if (sessionList.value) {
      this.isLoading = false;
      this.sessions = sessionList.value;
    } else if (await app.core.dialog.errorAsync(true, sessionList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  sessions?: app.ISessionListItem[];
}
