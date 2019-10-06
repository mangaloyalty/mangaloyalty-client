import * as app from '.';
let cacheDialog: app.DialogManager;
let cacheScreen: app.ScreenManager;
let cacheToast: app.ToastManager;

export const core = {
  get dialog() {
    if (cacheDialog) return cacheDialog;
    cacheDialog = new app.DialogManager();
    return cacheDialog;
  },

  get screen() {
    if (cacheScreen) return cacheScreen;
    cacheScreen = new app.ScreenManager();
    return cacheScreen;
  },

  get toast() {
    if (cacheToast) return cacheToast;
    cacheToast = new app.ToastManager();
    return cacheToast;
  }
};
