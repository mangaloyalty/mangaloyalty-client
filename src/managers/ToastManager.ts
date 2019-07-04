import * as app from '..';
import * as mobx from 'mobx';

export class ToastManager {
  constructor() {
    this.items = [];
  }

  @mobx.action
  add(body: string)  {
    this.items.push(body);
    setTimeout(() => mobx.runInAction(() => this.items.shift()), app.settings.toastTimeout);
  }

  @mobx.observable
  items: string[];
}
