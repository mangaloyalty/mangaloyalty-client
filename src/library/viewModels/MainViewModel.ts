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
  async changeFilterReadStatusAsync(filterReadStatus: app.IEnumeratorReadStatus) {
    if (filterReadStatus === this.filterReadStatus) return;
    app.core.storage.set(storageFilterReadStatus, filterReadStatus);
    this.filterReadStatus = filterReadStatus;
    await this.refreshAsync();
  }
  
  @mobx.action
  async changeFilterSeriesStatusAsync(filterSeriesStatus: app.IEnumeratorSeriesStatus) {
    if (filterSeriesStatus === this.filterSeriesStatus) return;
    app.core.storage.set(storageFilterSeriesStatus, filterSeriesStatus);
    this.filterSeriesStatus = filterSeriesStatus;
    await this.refreshAsync();
  }
  
  @mobx.action
  async changeFilterSortKeyAsync(filterSortKey: app.IEnumeratorSortKey) {
    if (filterSortKey === this.filterSortKey) return;
    app.core.storage.set(storageFilterSortKey, filterSortKey);
    this.filterSortKey = filterSortKey;
    await this.refreshAsync();
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync();
  }

  @mobx.action
  async openAsync(id: string) {
    this.isLoading = true;
    const seriesPromise = this._context.library.seriesReadAsync(id);
    const sessionListPromise = this._context.session.listAsync(id);
    const series = await seriesPromise;
    const sessionList = await sessionListPromise;
    if (series.value && sessionList.value) {
      app.core.screen.open(app.SeriesController, {series: series.value, sessionList: sessionList.value});
      this.isLoading = false;
    } else if (await app.core.dialog.errorAsync(false, series.error, sessionList.error)) {
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
      this.series = seriesList.value;
      this.isLoading = false;
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
