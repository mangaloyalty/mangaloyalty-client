import * as app from '..';
import * as mobx from 'mobx';
const core = app.core;

export class DialogManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  async errorAsync(error?: string) {
    return await this._openAsync(app.language.errorBody, app.language.errorButtons, error).then((index) => {
      if (index) return true;
      core.screen.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.observable
  items: {
    body: string;
    buttons: string[];
    error?: string;
    id: number;
    send: (index: number) => void;
  }[];

  private _openAsync(body: string, buttons: string[], error?: string) {
    return new Promise<number>((resolve) => {
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
