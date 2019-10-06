import * as app from '..';
import * as mobx from 'mobx';

export class MainViewModel {
  private _refreshPromise = Promise.resolve();

  constructor(restoreState?: app.MainRestoreState) {
    this.currentPage = restoreState ? restoreState.currentPage : this.currentPage;
    this.search = restoreState ? restoreState.search : this.search;
  }

  @mobx.action
  async changeFilterReadStatusAsync(filterReadStatus: app.IEnumeratorReadStatus) {
    if (filterReadStatus === this.filterReadStatus) return;
    localStorage.setItem('LibraryFilterReadStatus', filterReadStatus);
    this.filterReadStatus = filterReadStatus;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }
  
  @mobx.action
  async changeFilterSeriesStatusAsync(filterSeriesStatus: app.IEnumeratorSeriesStatus) {
    if (filterSeriesStatus === this.filterSeriesStatus) return;
    localStorage.setItem('LibraryFilterSeriesStatus', filterSeriesStatus);
    this.filterSeriesStatus = filterSeriesStatus;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }
  
  @mobx.action
  async changeFilterSortKeyAsync(filterSortKey: app.IEnumeratorSortKey) {
    if (filterSortKey === this.filterSortKey) return;
    localStorage.setItem('LibraryFilterSortKey', filterSortKey);
    this.filterSortKey = filterSortKey;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async openAsync(id: string) {
    const constructAsync = app.SeriesController.createConstruct(id);
    const restoreState = new app.MainRestoreState(this.currentPage, this.search);
    await app.core.screen.openChildAsync(constructAsync, restoreState);
  }

  @mobx.action
  async pageNextAsync() {
    if (!this.canPageNext) return;
    await this.refreshAsync(this.currentPage + 1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async pagePreviousAsync() {
    if (!this.canPagePrevious) return;
    await this.refreshAsync(this.currentPage - 1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async refreshAsync(nextPage?: number) {
    await (this._refreshPromise = this._refreshPromise.then(() => app.core.screen.loadAsync(async () => {
      const currentPage = nextPage || this.currentPage;
      const seriesList = await app.api.library.listAsync(this.filterReadStatus, this.filterSeriesStatus, this.filterSortKey, this.search, currentPage);
      if (seriesList.value && !seriesList.value.items.length && currentPage > 1) {
        await this.pagePreviousAsync();
      } else if (seriesList.value) {
        this.currentPage = currentPage;
        this.series = seriesList.value;
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(nextPage), seriesList.error);
      }
    })));
  }

  @mobx.action
  async socketActionAsync(actions: app.ISocketAction[]) {
    if (checkActionRefresh(actions)) {
      await this.refreshAsync();
    }
  }

  @mobx.computed
  get canPageNext() {
    return this.series.hasMorePages;
  }

  @mobx.computed
  get canPagePrevious() {
    return this.currentPage > 1;
  }

  @mobx.observable
  currentPage = 1;

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
