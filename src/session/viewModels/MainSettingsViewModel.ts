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
  toggleModeRTL() {
    this.enableModeRTL = !this.enableModeRTL;
    localStorage.setItem('SessionModeRTL', String(this.enableModeRTL));
  }

  @mobx.action
  toggleNavigationKeyboard() {
    this.enableNavigationKeyboard = !this.enableNavigationKeyboard;
    localStorage.setItem('SessionNavigationKeyboard', String(this.enableNavigationKeyboard));
  }

  @mobx.action
  toggleNavigationSwipe() {
    this.enableNavigationSwipe = !this.enableNavigationSwipe;
    localStorage.setItem('SessionNavigationSwipe', String(this.enableNavigationSwipe));
  }

  @mobx.action
  toggleNavigationTap() {
    this.enableNavigationTap = !this.enableNavigationTap;
    localStorage.setItem('SessionNavigationTap', String(this.enableNavigationTap));
  }

  @mobx.observable
  enableModeRTL = localStorage.getItem('SessionModeRTL') !== 'false';

  @mobx.observable
  enableNavigationKeyboard = localStorage.getItem('SessionNavigationKeyboard') !== 'false';

  @mobx.observable
  enableNavigationSwipe = localStorage.getItem('SessionNavigationSwipe') !== 'false';

  @mobx.observable
  enableNavigationTap = localStorage.getItem('SessionNavigationTap') !== 'false';

  @mobx.observable
  pageSize = <app.PageSize> parseFloat(localStorage.getItem('SessionPageSize') || '0');

  @mobx.observable
  showDialog = false;
}
