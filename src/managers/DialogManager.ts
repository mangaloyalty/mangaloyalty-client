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
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].id !== id) continue;
          mobx.runInAction(() => this.items.splice(i, 1));
          resolve(index);
          return;
        }
      }});
    });
  }
}
