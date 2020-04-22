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
  toggleOptionOneHanded() {
    this.optionOneHanded = !this.optionOneHanded;
    localStorage.setItem('SessionOptionOneHanded', String(this.optionOneHanded));
  }

  @mobx.action
  toggleOptionRightToLeft() {
    this.optionRightToLeft = !this.optionRightToLeft;
    localStorage.setItem('SessionOptionRightToLeft', String(this.optionRightToLeft));
  }

  @mobx.observable
  optionOneHanded = localStorage.getItem('SessionOptionOneHanded') === 'true';

  @mobx.observable
  optionRightToLeft = localStorage.getItem('SessionOptionRightToLeft') !== 'false';

  @mobx.observable
  pageSize = <app.PageSize> parseFloat(localStorage.getItem('SessionPageSize') || '0');

  @mobx.observable
  showDialog = false;
}
