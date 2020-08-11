import * as app from '.';
let context: app.ConnectContext;
let dialog: app.DialogManager;
let screen: app.ScreenManager;
let toast: app.ToastManager;

export const core = {
  get context() {
    return context || (context = new app.ConnectContext(location.origin));
  },

  get dialog() {
    return dialog || (dialog = new app.DialogManager());
  },

  get screen() {
    return screen || (screen = new app.ScreenManager());
  },

  get toast() {
    return toast || (toast = new app.ToastManager());
  },

  set context(value: app.ConnectContext) {
    context = value;
  }
};
