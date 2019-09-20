import * as app from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);

  @mobx.action
  async openAsync(session: app.ISessionListItem) {
    await app.core.screen.openChildAsync(app.ChapterController.createConstruct(session, session.url));
  }

  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const sessionList = await this._context.session.listAsync();
    if (sessionList.value) {
      this.sessions = sessionList.value;
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(true, sessionList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  isLoading = false;

  @mobx.observable
  sessions!: app.ISessionListItem[];
}
