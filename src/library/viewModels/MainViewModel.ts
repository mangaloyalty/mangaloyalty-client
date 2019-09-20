import * as app from '..';
import * as mobx from 'mobx';
const storageFilterReadStatus = 'LibraryFilterReadStatusKey';
const storageFilterSeriesStatus = 'LibraryFilterSeriesStatus';
const storageFilterSortKey = 'LibraryFilterSortKey';

export class MainViewModel {
  private readonly _context = app.core.service.get<app.ContextApi>(app.settings.contextKey);

  constructor(restoreState?: app.MainRestoreState) {
    this.search = restoreState ? restoreState.search : this.search;
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
    const constructAsync = app.SeriesController.createConstruct(id);
    const restoreState = new app.MainRestoreState(this.search);
    await app.core.screen.openChildAsync(constructAsync, restoreState);
  }
  
  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const seriesList = await this._context.library.listAsync(this.filterReadStatus, this.filterSeriesStatus, this.filterSortKey, this.search);
      if (seriesList.value) {
        this.series = seriesList.value;
      } else if (await app.core.dialog.errorAsync(true, seriesList.error)) {
        await this.refreshAsync();
      }
    });
  }

  @mobx.observable
  filterReadStatus = app.core.storage.get<app.IEnumeratorReadStatus>(storageFilterReadStatus, 'all');

  @mobx.observable
  filterSeriesStatus = app.core.storage.get<app.IEnumeratorSeriesStatus>(storageFilterSeriesStatus, 'all');

  @mobx.observable
  filterSortKey = app.core.storage.get<app.IEnumeratorSortKey>(storageFilterSortKey, 'addedAt');
  
  @mobx.observable
  search = '';

  @mobx.observable
  series!: app.ILibraryList;
}
