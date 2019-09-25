import * as app from '..';
import * as mobx from 'mobx';

export class RouteManager {
  constructor() {
    this.rootType = 0;
  }

  @mobx.action
  changeRoot(rootType: app.RootType) {
    if (rootType === app.RootType.Connect) {
      throw new Error('Use `disconnectAsync` instead!');
    } else {
      this.rootType = rootType;
    }
  }

  @mobx.action
  async disconnectAsync() {
    if (await app.core.dialog.confirmDisconnectAsync()) return;
    app.core.storage.clear();
    this.rootType = app.RootType.Connect;
  }

  @mobx.observable
  rootType: app.RootType;
}
