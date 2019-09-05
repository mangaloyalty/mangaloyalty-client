import * as app from '..';
import * as mobx from 'mobx';
const storageFilterReadStatus = 'LibraryFilterReadStatusKey';
const storageFilterSeriesStatus = 'LibraryFilterSeriesStatus';
const storageFilterSortKey = 'LibraryFilterSortKey';

export class MainViewModel {
  private readonly _context: app.ContextApi;

  constructor() {
    this._context = app.core.service.get(app.settings.contextKey);
    this.refreshAsync();
  }

  @mobx.action
  changeFilterReadStatus(filterReadStatus: app.IEnumeratorReadStatus) {
    if (filterReadStatus === this.filterReadStatus) return;
    app.core.storage.set(storageFilterReadStatus, filterReadStatus);
    this.filterReadStatus = filterReadStatus;
    this.refreshAsync();
  }
  
  @mobx.action
  changeFilterSeriesStatus(filterSeriesStatus: app.IEnumeratorSeriesStatus) {
    if (filterSeriesStatus === this.filterSeriesStatus) return;
    app.core.storage.set(storageFilterSeriesStatus, filterSeriesStatus);
    this.filterSeriesStatus = filterSeriesStatus;
    this.refreshAsync();
  }
  
  @mobx.action
  changeFilterSortKey(filterSortKey: app.IEnumeratorSortKey) {
    if (filterSortKey === this.filterSortKey) return;
    app.core.storage.set(storageFilterSortKey, filterSortKey);
    this.filterSortKey = filterSortKey;
    this.refreshAsync();
  }

  @mobx.action
  changeSearch(search: string) {
    if (search === this.search) return;
    this.search = search;
    this.refreshAsync();
  }

  @mobx.action
  async openAsync(id: string) {
    this.isLoading = true;
    const series = await this._context.library.seriesReadAsync(id);
    if (series.value) {
      app.core.screen.open(app.SeriesController, {series: series.value});
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(false, series.error)) {
      await this.openAsync(id);
    } else {
      this.isLoading = false;
    }
  }
  
  @mobx.action
  async refreshAsync() {
    this.isLoading = true;
    const seriesList = await this._context.library.listAsync(this.filterReadStatus, this.filterSeriesStatus, this.filterSortKey, this.search);
    if (seriesList.value) {
      this.isLoading = false;
      this.series = seriesList.value;
    } else if (await app.core.dialog.errorAsync(true, seriesList.error)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  filterReadStatus = app.core.storage.get<app.IEnumeratorReadStatus>(storageFilterReadStatus, 'all');

  @mobx.observable
  filterSeriesStatus = app.core.storage.get<app.IEnumeratorSeriesStatus>(storageFilterSeriesStatus, 'all');

  @mobx.observable
  filterSortKey = app.core.storage.get<app.IEnumeratorSortKey>(storageFilterSortKey, 'addedAt');
  
  @mobx.observable
  isLoading = false;

  @mobx.observable
  search = '';

  @mobx.observable
  series?: app.ILibraryList;
}
