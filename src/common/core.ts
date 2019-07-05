import * as app from '..';

export const core = {
  dialog: new app.DialogManager(),
  screen: new app.ScreenManager(),
  service: new app.ServiceManager(),
  storage: new app.StorageManager(),
  toast: new app.ToastManager()
};
