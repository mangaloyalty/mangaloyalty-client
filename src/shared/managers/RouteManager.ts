import * as app from '..';
import * as mobx from 'mobx';

export class RouteManager {
  constructor() {
    this.rootType = 0;
  }

  @mobx.action
  changeRoot(rootType: app.RootType) {
    if (rootType == app.RootType.Connect) {
      app.core.storage.clear();
      this.rootType = rootType;
    } else {
      this.rootType = rootType;
    }
  }

  @mobx.observable
  rootType: app.RootType;
}
