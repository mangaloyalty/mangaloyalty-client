import * as app from '.';
let dialog: app.DialogManager;
let screen: app.ScreenManager;
let toast: app.ToastManager;

export const core = {
  get dialog() {
    return dialog || (dialog = new app.DialogManager());
  },

  get screen() {
    return screen || (screen = new app.ScreenManager());
  },

  get toast() {
    return toast || (toast = new app.ToastManager());
  }
};
