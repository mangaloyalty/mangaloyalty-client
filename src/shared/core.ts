import * as app from '.';
let dialog: app.DialogManager;
let screen: app.ScreenManager;
let toast: app.ToastManager;

export const core = {
  get dialog() {
    if (dialog) return dialog;
    dialog = new app.DialogManager();
    return dialog;
  },

  get screen() {
    if (screen) return screen;
    screen = new app.ScreenManager();
    return screen;
  },

  get toast() {
    if (toast) return toast;
    toast = new app.ToastManager();
    return toast;
  }
};
