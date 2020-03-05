import * as app from '..';
import * as mobx from 'mobx';

export class MainSettingsViewModel {
  @mobx.action
  changePageSize(pageSize: app.PageSize) {
    if (pageSize === this.pageSize) return;
    this.pageSize = pageSize;
    localStorage.setItem('SessionPageSize', String(this.pageSize));
  }

  @mobx.action
  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  @mobx.action
  toggleOptionAutohide() {
    this.optionAutohide = !this.optionAutohide;
    localStorage.setItem('SessionOptionAutohide', String(this.optionAutohide));
  }

  @mobx.action
  toggleOptionRTL() {
    this.optionRTL = !this.optionRTL;
    localStorage.setItem('SessionOptionRTL', String(this.optionRTL));
  }

  @mobx.observable
  optionAutohide = localStorage.getItem('SessionOptionAutohide') === 'true';

  @mobx.observable
  optionRTL = localStorage.getItem('SessionOptionRTL') !== 'false';

  @mobx.observable
  pageSize = <app.PageSize> parseFloat(localStorage.getItem('SessionPageSize') || '0');

  @mobx.observable
  showDialog = false;
}
