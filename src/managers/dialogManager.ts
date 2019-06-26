import * as app from '..';
import * as mobx from 'mobx';
let previousId = 0;

export const dialogManager = {
  async errorAsync(error?: string) {
    return await openAsync(app.language.errorBody, app.language.errorButtons, error).then((index) => {
      if (index) return true;
      app.screenManager.changeRoot(app.RootType.Connect);
      return false;
    });
  },

  dialogs: [] as {
    body: string;
    buttons: string[];
    error?: string;
    id: number;
    send: (index: number) => void;
  }[]
};

mobx.decorate(dialogManager, {
  errorAsync: mobx.action,
  dialogs: mobx.observable
});

function openAsync(body: string, buttons: string[], error?: string) {
  return new Promise<number>((resolve) => {
    const id = ++previousId;
    dialogManager.dialogs.push({body, buttons, error, id, send: (index: number) => {
      for (let i = 0; i < dialogManager.dialogs.length; i++) {
        if (dialogManager.dialogs[i].id !== id) continue;
        mobx.runInAction(() => dialogManager.dialogs.splice(i, 1));
        resolve(index);
        return;
      }
    }});
  });
}
