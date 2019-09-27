import * as app from '..';
import * as mobx from 'mobx';
const storageProvider = 'RemoteProvider';

export class MainViewModel {
  constructor(private _context: app.ContextApi, restoreState?: app.MainRestoreState) {
    this.search = restoreState ? restoreState.search : this.search;
  }

  @mobx.action
  async changeProviderAsync(providerName: app.IEnumeratorProvider) {
    if (providerName === this.providerName) return;
    app.core.storage.set(storageProvider, providerName);
    this.providerName = providerName;
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }

  @mobx.action
  async changeSearchAsync(search: string) {
    if (search === this.search) return;
    this.search = search;
    await this.refreshAsync().then(() => scrollTo(0, 0));
  }

  @mobx.action
  async openAsync(url: string) {
    const constructAsync = app.SeriesController.createConstruct(url);
    const restoreState = new app.MainRestoreState(this.search);
    if (await app.core.screen.openChildAsync(constructAsync, restoreState)) await this.refreshAsync();
  }

  @mobx.action
  async refreshAsync() {
    await app.core.screen.loadAsync(async () => {
      const seriesListPromise = this.search ? this._context.remote.searchAsync(this.providerName, this.search) : this._context.remote.popularAsync(this.providerName);
      const seriesList = await seriesListPromise;
      if (seriesList.value) {
        this.series = seriesList.value;
      } else {
        await app.core.dialog.errorAsync(seriesList.error);
        await this.refreshAsync();
      }
    });
  }

  @mobx.observable
  providerName = app.core.storage.get(storageProvider, app.settings.providerDefaultName as app.IEnumeratorProvider);
  
  @mobx.observable
  search = '';
  
  @mobx.observable
  series!: app.IRemoteList;
}
