import * as app from '..';

export const core = {
  dialog: new app.DialogManager(),
  screen: new app.ScreenManager(),
  service: new app.ServiceManager(),
  toast: new app.ToastManager()
};
