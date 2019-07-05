import * as app from '..';
import * as mobx from 'mobx';

export class DialogManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  async disconnectAsync() {
    return await this._openAsync(app.language.basicDisconnectBody, app.language.basicDisconnectButtons).then((index) => {
      if (index) return true;
      app.core.screen.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.action
  async errorAsync(error?: string) {
    return await this._openAsync(app.language.basicErrorBody, app.language.basicErrorButtons, error).then((index) => {
      if (index) return true;
      if (app.core.screen.isChildVisible) app.core.screen.close();
      else app.core.screen.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.action
  async versionAsync() {
    return await this._openAsync(app.language.basicVersionBody, app.language.basicVersionButtons).then(() => {
      return true;
    });
  }

  @mobx.computed
  get isChildVisible() {
    return this.items.length !== 0;
  }

  @mobx.observable
  items: {
    body: string;
    buttons: string[];
    error?: string;
    id: number;
    send: (index: number) => void;
  }[];

  private async _openAsync(body: string, buttons: string[], error?: string) {
    return await new Promise<number>((resolve) => {
      const id = this.items.length + 1;
      this.items.push({body, buttons, error, id, send: (index: number) => {
        mobx.runInAction(() => this.items.pop());
        resolve(index);
      }});
    });
  }
}
