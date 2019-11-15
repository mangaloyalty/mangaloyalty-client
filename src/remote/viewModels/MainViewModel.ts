import * as app from '..';
import * as areas from '../../areas'
import * as mobx from 'mobx';

export class MainViewModel {
  constructor(providerName: app.IEnumeratorProvider, search?: string, restoreState?: app.MainRestoreState) {
    this.currentPage = restoreState ? restoreState.currentPage : this.currentPage;
    this.providerName = providerName;
    this.search = restoreState ? restoreState.search : (search || this.search);
  }

  @mobx.action
  async changeProviderAsync(providerName: app.IEnumeratorProvider) {
    if (providerName === this.providerName) return;
    this.providerName = providerName;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync(1).then(() => scrollTo(0, 0));
  }

  @mobx.action
  async openAsync(series: app.IRemoteListItem) {
    await app.core.screen.loadAsync(async () => {
      const libraryQueue = app.api.socket.createQueue().attach();
      const library = await app.api.library.seriesFindByUrlAsync(series.url);
      if (library.value) {
        const constructAsync = areas.library.SeriesController.createConstruct(library.value.id, libraryQueue);
        await app.core.screen.openChildAsync(constructAsync);
      } else {
        const constructAsync = app.SeriesController.createConstruct(series.imageId, series.url);
        const restoreState = new app.MainRestoreState(this.currentPage, this.search);
        await app.core.screen.openChildAsync(constructAsync, restoreState);
        libraryQueue.detach();
      }
    });
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
    await app.core.screen.loadAsync(async () => {
      const currentPage = nextPage || this.currentPage;
      const seriesListPromise = this.search ? app.api.remote.searchAsync(this.providerName, this.search, currentPage) : app.api.remote.popularAsync(this.providerName, currentPage);
      const seriesList = await seriesListPromise;
      if (seriesList.value) {
        this.currentPage = currentPage;
        this.series = seriesList.value;
      } else {
        await app.core.dialog.errorAsync(() => this.refreshAsync(nextPage), seriesList.error);
      }
    });
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
  providerName: app.IEnumeratorProvider;
  
  @mobx.observable
  search = '';
  
  @mobx.observable
  series!: app.IRemoteList;
}
