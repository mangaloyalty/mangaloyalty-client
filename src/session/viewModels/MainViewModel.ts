import * as app from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  @mobx.action
  async openAsync(session: app.ISessionListItem) {
    const constructAsync = app.ChapterController.createConstruct(session, session.url);
    if (await app.core.screen.openChildAsync(constructAsync)) await this.refreshAsync();
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const sessionList = await app.api.session.listAsync();
      if (sessionList.value) {
        this.sessions = sessionList.value;
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(), sessionList.error);
      }
    });
  }

  @mobx.observable
  sessions!: app.ISessionListItem[];
}
