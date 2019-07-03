import * as app from '..';
import * as mobx from 'mobx';

class DialogManager {
  private _previousId = 0;

  @mobx.action
  async errorAsync(error?: string) {
    return await this._openAsync(app.language.errorBody, app.language.errorButtons, error).then((index) => {
      if (index) return true;
      app.screenManager.changeRoot(app.RootType.Connect);
      return false;
    });
  }

  @mobx.observable
  dialogs = [] as {
    body: string;
    buttons: string[];
    error?: string;
    id: number;
    send: (index: number) => void;
  }[];

  private _openAsync(body: string, buttons: string[], error?: string) {
    return new Promise<number>((resolve) => {
      const id = ++this._previousId;
      this.dialogs.push({body, buttons, error, id, send: (index: number) => {
        for (let i = 0; i < this.dialogs.length; i++) {
          if (this.dialogs[i].id !== id) continue;
          mobx.runInAction(() => this.dialogs.splice(i, 1));
          resolve(index);
          return;
        }
      }});
    });
  }
}

export const dialogManager = new DialogManager();
