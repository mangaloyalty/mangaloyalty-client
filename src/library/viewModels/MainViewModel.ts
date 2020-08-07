import * as app from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  constructor(search?: string, restoreState?: app.MainRestoreState) {
    this.search = restoreState ? restoreState.search : (search || this.search);
  }

  @mobx.action
  async changeFilterReadStatusAsync(filterReadStatus: app.IEnumeratorReadStatus) {
    if (filterReadStatus === this.filterReadStatus) return;
    this.filterReadStatus = filterReadStatus;
    localStorage.setItem('LibraryFilterReadStatus', this.filterReadStatus);
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }
  
  @mobx.action
  async changeFilterSeriesStatusAsync(filterSeriesStatus: app.IEnumeratorSeriesStatus) {
    if (filterSeriesStatus === this.filterSeriesStatus) return;
    this.filterSeriesStatus = filterSeriesStatus;
    localStorage.setItem('LibraryFilterSeriesStatus', this.filterSeriesStatus);
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }
  
  @mobx.action
  async changeFilterSortKeyAsync(filterSortKey: app.IEnumeratorSortKey) {
    if (filterSortKey === this.filterSortKey) return;
    this.filterSortKey = filterSortKey;
    localStorage.setItem('LibraryFilterSortKey', this.filterSortKey);
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }

  @mobx.action
  async openAsync(series: app.ILibraryListItem) {
    await app.core.screen.loadAsync(async () => {
      const constructAsync = app.SeriesController.createConstruct(series.id);
      const restoreState = new app.MainRestoreState(this.search);
      await app.core.screen.openChildAsync(constructAsync, restoreState);
    });
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const seriesList = await app.core.context.library.listReadAsync(this.filterReadStatus, this.filterSeriesStatus, this.filterSortKey, this.search);
      if (seriesList.value) {
        this.series = seriesList.value;
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(), seriesList.error);
      }
    });
  }

  @mobx.action
  async socketActionAsync(actions: app.ISocketAction[]) {
    if (checkActionRefresh(actions)) {
      await this.refreshAsync();
    }
  }

  @mobx.observable
  filterReadStatus = <app.IEnumeratorReadStatus> localStorage.getItem('LibraryFilterReadStatus') || 'all';

  @mobx.observable
  filterSeriesStatus = <app.IEnumeratorSeriesStatus> localStorage.getItem('LibraryFilterSeriesStatus') || 'all';

  @mobx.observable
  filterSortKey = <app.IEnumeratorSortKey> localStorage.getItem('LibraryFilterSortKey') || 'lastPageReadAt';

  @mobx.observable
  search = '';

  @mobx.observable
  series!: app.ILibraryList;
}

function checkActionRefresh(actions: app.ISocketAction[]) {
  return actions.some((action) => {
    switch (action.type) {
      case 'SocketConnect': return true;
      case 'SeriesCreate' : return true;
      case 'SeriesDelete' : return true;
      case 'SeriesUpdate' : return true;
      case 'ChapterPatch' : return true;
      default: return false;
    }
  });
}
