import * as app from '..';
import * as mobx from 'mobx';

export class MainSettingsViewModel {
  @mobx.action
  async changePageSizeAsync(pageSize: app.PageSize) {
    if (pageSize === this.pageSize) return;
    localStorage.setItem('SessionPageSize', app.PageSize[pageSize]);
    this.pageSize = pageSize;
  }

  @mobx.action
  toggleDialog() {
    this.showDialog = !this.showDialog;
  }

  @mobx.observable
  pageSize = getLocalStorageEnum(app.PageSize, 'SessionPageSize', 'None');

  @mobx.observable
  showDialog = false;
}

function getLocalStorageEnum<T>(type: T, key: string, defaultValue: keyof T) {
  const value = localStorage.getItem(key) || defaultValue;
  const typedValue = value as keyof T;
  return type[typedValue];
}
