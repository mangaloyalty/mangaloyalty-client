import {DialogManager} from './managers/DialogManager';
import {RouteManager} from './managers/RouteManager';
import {ScreenManager} from './managers/ScreenManager';
import {ServiceManager} from './managers/ServiceManager';
import {StorageManager} from './managers/StorageManager';
import {ToastManager} from './managers/ToastManager';

export const core = {
  data: require('../../package.json'),
  dialog: new DialogManager(),
  route: new RouteManager(),
  screen: new ScreenManager(),
  service: new ServiceManager(),
  storage: new StorageManager(),
  toast: new ToastManager()
};
