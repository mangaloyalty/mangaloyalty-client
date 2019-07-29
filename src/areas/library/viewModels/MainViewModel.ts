import * as app from '../../..';
import * as mobx from 'mobx';

export class MainViewModel {
  private readonly _context: app.ContextApi;

  constructor() {
    this._context = app.core.service.get(app.settings.contextKey);
    this.refreshAsync();
  }

  @mobx.action
  changeFilterReadStatus(filterReadStatus: app.IEnumeratorReadStatus) {
    if (filterReadStatus === this.filterReadStatus) return;
    this.filterReadStatus = filterReadStatus;
    this.refreshAsync();
  }

  @mobx.action
  changeFilterSeriesStatus(filterSeriesStatus: app.IEnumeratorSeriesStatus) {
    if (filterSeriesStatus === this.filterSeriesStatus) return;
    this.filterSeriesStatus = filterSeriesStatus;
    this.refreshAsync();
  }
  
  @mobx.action
  changeFilterSortKey(filterSortKey: app.IEnumeratorSortKey) {
    if (filterSortKey === this.filterSortKey) return;
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
  open(series: app.ILibraryListItem) {
    // TODO: Open the library series.
    alert(`${series.id}: ${series.title}`);
  }

  @mobx.action
  async refreshAsync(forceRefresh?: boolean) {
    if (!forceRefresh && this.isLoading) return;
    this.isLoading = true;
    const seriesList = await this._context.library.listAsync(this.filterReadStatus, this.filterSeriesStatus, this.filterSortKey, this.search);
    if (seriesList.value) {
      mobx.runInAction(() => {
        this.isLoading = false;
        this.source = seriesList.value;
      });
    } else if (await app.core.dialog.errorAsync(seriesList.error)) {
      await this.refreshAsync(true);
    }
  }

  @mobx.computed
  get series() {
    return this.source;
  }

  @mobx.observable
  filterReadStatus: app.IEnumeratorReadStatus = 'all';

  @mobx.observable
  filterSeriesStatus: app.IEnumeratorSeriesStatus = 'all';

  @mobx.observable
  filterSortKey: app.IEnumeratorSortKey = 'addedAt';
  
  @mobx.observable
  isLoading = false;

  @mobx.observable
  search = '';

  @mobx.observable
  private source?: app.ILibraryList;
}
