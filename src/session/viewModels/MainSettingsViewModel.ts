import * as app from '..';
import * as mobx from 'mobx';

export class MainSettingsViewModel {
  @mobx.action
  async changePageSizeAsync(pageSize: app.PageSize) {
    if (pageSize === this.pageSize) return;
    localStorage.setItem('SessionPageSize', String(pageSize));
    this.pageSize = pageSize;
  }

  @mobx.action
  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  @mobx.observable
  pageSize = <app.PageSize> parseFloat(localStorage.getItem('SessionPageSize') || '0');

  @mobx.observable
  showDialog = false;
}
