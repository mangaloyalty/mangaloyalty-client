import * as app from '..';
import * as mobx from 'mobx';
let previousId = 0;

export const dialogManager = {
  async errorAsync(error?: string) {
    return await openAsync(app.language.errorBody, app.language.errorButtons, error).then((index) => {
      if (index !== 0) return true;
      app.routeManager.changeView(app.ViewType.Connect);
      return false;
    });
  },

  get hasDialog() {
    return Boolean(dialogManager.items.length);
  },

  items: [] as {
    body: string;
    buttons: string[];
    error?: string;
    id: number;
    send: (index: number) => void;
  }[]
};

mobx.decorate(dialogManager, {
  errorAsync: mobx.action,
  hasDialog: mobx.computed,
  items: mobx.observable
});

function openAsync(body: string, buttons: string[], error?: string) {
  return new Promise<number>((resolve) => {
    const id = ++previousId;
    dialogManager.items.push({body, buttons, error, id, send: (index: number) => {
      for (let i = 0; i < dialogManager.items.length; i++) {
        if (dialogManager.items[i].id !== id) continue;
        mobx.runInAction(() => dialogManager.items.splice(i, 1));
        resolve(index);
        return;
      }
    }});
  });
}
